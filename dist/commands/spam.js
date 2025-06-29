"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const utils_1 = require("../utils/utils");
const texts_1 = __importDefault(require("../utils/preTexts/texts"));
const composer = new grammy_1.Composer();
composer.hears(/^\/spam(?:@[\w_]+)? (.+)/, async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) {
        await ctx.reply("ID do usuário não encontrado.");
        return;
    }
    const user = await utils_1.prisma.user.findUnique({
        where: { telegramId: String(userId) },
    });
    if (user?.userType !== "admin")
        return;
    const input = ctx.match[1]?.trim();
    if (!input) {
        await ctx.reply("Uso correto: /spam <mensagem>");
        return;
    }
    // Verifica se o input é uma key da spamlist
    const entry = texts_1.default.find(obj => Object.hasOwn(obj, input));
    const spamMessage = entry ? Object.values(entry)[0] : input; // usa a mensagem da lista ou o texto original
    await ctx.reply("**Iniciando!**", { parse_mode: "Markdown" });
    const users = await utils_1.prisma.user.findMany({
        select: { telegramId: true },
    });
    let successCount = 0;
    let failCount = 0;
    try {
        for (const u of users) {
            try {
                await ctx.api.sendMessage(Number(u.telegramId), spamMessage, {
                    parse_mode: "Markdown",
                });
                successCount++;
            }
            catch (error) {
                console.error(`Erro ao enviar para ${u.telegramId}:`, error);
                failCount++;
            }
        }
        await ctx.editMessageText(`Mensagem enviada para ${successCount} usuários.\nFalhas: ${failCount}`);
    }
    catch {
        console.log(" e");
    }
});
composer.command("spam", async (ctx) => {
    await ctx.reply("Uso correto: /spam <mensagem>");
});
exports.default = composer;
