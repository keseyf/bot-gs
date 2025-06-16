"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const utils_1 = require("../utils/utils");
const backMainKeyboard_1 = require("../Keyboards/backMainKeyboard");
const composer = new grammy_1.Composer();
composer.callbackQuery(/^card_.+$/, async (ctx) => {
    const cardId = ctx.callbackQuery.data.split('_')[1]; // Extract the card ID from the callback data
    console.log('Card ID:', cardId);
    try {
        console.log("Saldo suficiente para comprar o cartão.");
        const card = await utils_1.prisma.cards.findUnique({
            where: { id: cardId }
        });
        const user = await utils_1.prisma.user.findUnique({
            where: { telegramId: String(ctx.from?.id) },
        });
        if (!user) {
            await ctx.reply("Usuário não encontrado.", { reply_markup: backMainKeyboard_1.backMainKeyboard });
            return;
        }
        if (!card) {
            await ctx.reply("Cartão não encontrado.", { reply_markup: backMainKeyboard_1.backMainKeyboard });
            return;
        }
        if (user.balance < card.price) {
            await ctx.editMessageText("Saldo insuficiente para comprar este cartão.", { reply_markup: backMainKeyboard_1.backMainKeyboard });
            return;
        }
        await utils_1.prisma.orders.create({
            data: {
                userId: String(ctx.from?.id),
                itemId: cardId, // Assuming itemId is the card ID
                amount: card?.price || 100, // Assuming you have a price field in the card,
                paymentId: "1",
                qrCode: "teste"
            },
        });
        ctx.editMessageText("Pedido criado com sucesso! 🎉\n\nNossa equipe logo");
    }
    catch (error) {
        console.error("Erro ao criar pedido:", error);
        await ctx.reply("Desculpe, ocorreu um erro ao processar seu pedido.");
    }
});
exports.default = composer;
