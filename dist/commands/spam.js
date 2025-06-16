"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const utils_1 = require("../utils/utils");
const composer = new grammy_1.Composer();
composer.command("spam_1", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) {
        await ctx.reply("User ID not found.");
        return;
    }
    const user = await utils_1.prisma.user.findUnique({
        where: { telegramId: String(userId) },
    });
    if (user?.userType === "admin") {
        await ctx.reply("Spam 1 command executed.");
        // Here you can add the logic for the spam command
    }
});
exports.default = composer;
