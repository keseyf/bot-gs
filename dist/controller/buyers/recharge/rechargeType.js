"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const composer = new grammy_1.Composer();
const cooldownSet = new Set(); // Controla flood por userId
composer.callbackQuery("chooseRechargeType", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) {
        await ctx.reply("Usuário não identificado.");
        return;
    }
    // Verifica se o usuário está em cooldown
    if (cooldownSet.has(userId)) {
        await ctx.answerCallbackQuery({
            text: "Espere um pouco antes de clicar novamente.",
            show_alert: false,
        });
        return;
    }
    // Aplica o cooldown de 5 segundos
    cooldownSet.add(userId);
    setTimeout(() => cooldownSet.delete(userId), 5000);
    try {
        await ctx.answerCallbackQuery(); // responde o clique
        await ctx.editMessageText("💸 Escolha um tipo de recarga:", {
            reply_markup: new grammy_1.InlineKeyboard()
                .text("💠 Pix", "recharge")
                .row()
                .text("🔙 Voltar", "main")
        });
    }
    catch (e) {
        console.error(e);
        await ctx.reply("Erro inesperado.");
    }
});
exports.default = composer;
