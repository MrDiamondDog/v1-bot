import { createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import SamJs from "sam-js";
import { Readable } from "stream";

import { V1Bot } from "../client";

const audioPlayer = createAudioPlayer();
const v1 = new SamJs();
let connection: VoiceConnection | undefined = undefined;

export async function play(userId: string, guildId: string, text: string) {
    if (!V1Bot.getVoiceConnection(guildId)) {
        const member = await V1Bot.rest.guilds.getMember(guildId, userId);
        if (!member) return;

        const voiceChannel = member.voiceState?.channelID;
        if (!voiceChannel) return;

        const guild = V1Bot.guilds.get(guildId);
        if (!guild) return;

        connection = joinVoiceChannel({
            channelId: voiceChannel,
            guildId,
            // @ts-ignore
            adapterCreator: member.voiceState.guild.voiceAdapterCreator
        });
    }

    if (!connection) return;

    const validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=;':,./? ";
    for (let i = 0; i < text.length; i++) {
        if (!validChars.includes(text[i])) {
            text = text.replace(text[i], "");
        }
    }

    const audioStream = v1.wav(text);
    const buffer = Buffer.from(audioStream);
    const resource = createAudioResource(Readable.from(buffer));
    connection.subscribe(audioPlayer);

    audioPlayer.play(resource);
}
