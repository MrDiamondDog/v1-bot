import { defineCommand } from "../command";
import { play } from "../modules/say";

export default defineCommand({
    name: "say",
    description: "Make the v1 say something",
    usage: "say <text>",

    async execute(msg, ...args) {
        if (!args.length) return;

        play(msg.author.id, msg.guildID!, args.join(" ").replace("\n", " "));
    },
});
