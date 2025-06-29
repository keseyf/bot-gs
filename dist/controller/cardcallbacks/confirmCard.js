"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const card_1 = __importDefault(require("../../utils/card"));
const composer = new grammy_1.Composer();
const cooldownSet = new Set(); // Proteção contra flood
composer.callbackQuery(/^select_card_(.+)$/, async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) {
        await ctx.reply("Usuário não identificado.");
        return;
    }
    // Bloqueia múltiplos cliques
    if (cooldownSet.has(userId)) {
        await ctx.answerCallbackQuery({
            text: "Aguarde um momento antes de clicar novamente.",
            show_alert: false,
        });
        return;
    }
    cooldownSet.add(userId);
    setTimeout(() => cooldownSet.delete(userId), 5000);
    try {
        await ctx.answerCallbackQuery();
        const cardKey = ctx.match[1];
        const cardType = cardKey.replace(/_/g, " ");
        const price = card_1.default[cardKey];
        if (!price) {
            await ctx.reply("Cartão não encontrado.");
            return;
        }
        await ctx.editMessageText(`✅ *Tudo certo*, você escolheu o cartão: 
💳 - \`${cardType}\`
💵 - *R$ ${price}*

Escolha uma opção abaixo:`, {
            parse_mode: "Markdown",
            reply_markup: new grammy_1.InlineKeyboard()
                .text("💵 Comprar", `select_payment_method_${cardKey}`).row()
                .text("🔄 Escolher outro", "cards").row()
                .text("🏠 Menu", "main"),
        });
    }
    catch (error) {
        console.error("Erro ao processar select_card:", error);
        await ctx.reply("Erro inesperado.");
    }
});
exports.default = composer;
