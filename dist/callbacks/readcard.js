"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const grammy_1 = require("grammy");
const composer = new grammy_1.Composer();
composer.callbackQuery(/^card_.+$/, async (ctx) => {
    const data = ctx.callbackQuery.data; // Exemplo: "card_8123a9b8-4b1e-4c29-b8de-8a84a6c8209e"
    const cardId = data.split("_")[1]; // Pegamos só o ID, já como stringc
    console.log("Card ID:", cardId);
    try {
        const card = await utils_1.prisma.cards.findUnique({
            where: { id: cardId },
        });
        if (!card) {
            await ctx.reply("Cartão não encontrado.");
            return;
        }
        await ctx.reply(`Você selecionou o cartão: ${card.cardName}, no valor de R$ ${card.price.toFixed(2)}.`, { reply_markup: new grammy_1.InlineKeyboard().text("Comprar", `buy_${card.id}`) });
    }
    catch (error) {
        console.error("Erro ao buscar o cartão:", error);
        await ctx.reply("Desculpe, ocorreu um erro ao processar sua escolha.");
    }
});
exports.default = composer;
