"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const grammy_1 = require("grammy");
const buyKeyboard_1 = require("../Keyboards/buyKeyboard");
const backMainKeyboard_1 = require("../Keyboards/backMainKeyboard");
const composer = new grammy_1.Composer();
composer.callbackQuery("generate", async (ctx) => {
    try {
        const cards = await utils_1.prisma.cards.findMany({
            where: {
                active: true,
            }
        });
        if (cards.length === 0) {
            await ctx.editMessageText("Nenhum cartão disponível no momento.", { reply_markup: backMainKeyboard_1.backMainKeyboard });
            return;
        }
        const i = Math.floor(Math.random() * cards.length);
        const card = cards[i];
        await ctx.editMessageText(`
Informações do cartão gerado:
Número do Cartão: ${card.cardNumber.replace(/\d(?=\d{-4})/g, "*")}
Banco: ${card.bank}
Saldo: R$ ${card.balance.toFixed(2)}
Tipo de Cartão: ${card.type}
            `, { reply_markup: buyKeyboard_1.buyKeyboard });
    }
    catch (error) {
        console.error("Error handling generate callback query:", error);
        await ctx.reply("Ocorreu um erro ao processar seu pedido.");
    }
});
exports.default = composer;
