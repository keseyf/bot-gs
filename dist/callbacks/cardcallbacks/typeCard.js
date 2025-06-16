"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const utils_1 = require("../../utils/utils");
const chooseTypeCardKeyboard_1 = require("../../Keyboards/cards/chooseTypeCardKeyboard");
const composer = new grammy_1.Composer();
composer.callbackQuery("cards", async (ctx) => {
    try {
        const userId = ctx.from?.id;
        if (!userId) {
            await ctx.reply("Usuário não encontrado.");
            return;
        }
        const user = await utils_1.prisma.user.findUnique({
            where: { telegramId: String(userId) },
        });
        ctx.editMessageText(`Escolha o tipo do cartão na tabela abaixo: [ㅤ](https://i.ibb.co/ZWNF4F5/photo-2023-06-06-18-19-36.jpg)`, { parse_mode: "Markdown", reply_markup: chooseTypeCardKeyboard_1.chooseTypeCardKeyboard });
    }
    catch (error) {
        console.error("Error handling cards callback query:", error);
        await ctx.reply("Ocorreu um erro ao processar seu pedido.");
    }
});
exports.default = composer;
