"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const grammy_1 = require("grammy");
const composer = new grammy_1.Composer();
composer.callbackQuery("choose", async (ctx) => {
    try {
        const cardList = await utils_1.prisma.cards.findMany();
        const keyboard = new grammy_1.InlineKeyboard();
        for (const card of cardList) {
            keyboard.text(`${card.bank} - R$ ${card.balance.toFixed(2)}`, `card_${card.id}`).row();
        }
        keyboard.text("🔙 Voltar", "cards").row();
        await ctx.editMessageText("Escolha um cartão:", {
            reply_markup: keyboard
        });
    }
    catch (error) {
        console.error("Error fetching card list:", error);
        await ctx.reply("Desculpe, ocorreu um erro ao buscar os cartões disponíveis.");
    }
});
exports.default = composer;
