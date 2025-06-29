"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const card_1 = __importDefault(require("../../../utils/card"));
const backMainKeyboard_1 = require("../../../utils/Keyboards/bot/backMainKeyboard");
const composer = new grammy_1.Composer();
const cooldownSet = new Set(); // Cooldown por usuário
composer.callbackQuery(/^confirm_buy_balance_(.+)/, async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) {
        await ctx.reply("Usuário não encontrado.");
        return;
    }
    // Verifica se o usuário está em cooldown
    if (cooldownSet.has(userId)) {
        await ctx.answerCallbackQuery({
            text: "Aguarde um momento antes de clicar novamente.",
            show_alert: false,
        });
        return;
    }
    // Adiciona o usuário no cooldown (5s)
    cooldownSet.add(userId);
    setTimeout(() => cooldownSet.delete(userId), 5000);
    try {
        await ctx.answerCallbackQuery(); // resposta rápida
        const match = ctx.match[1];
        const produto = match.replace(/_/g, " ");
        const valor = card_1.default[match]?.toFixed(2);
        if (!valor) {
            await ctx.reply("Produto não encontrado.", { reply_markup: backMainKeyboard_1.backMainKeyboard });
            return;
        }
        await ctx.editMessageText(`
🔴 Após a compra nossa equipe será notificada e irá enviar os dados/conteúdo no seu perfil privado através do *bot* ou *perfil de suporte*.
🔴 *Tempo de envio pode variar!*

- *Produto*: ${produto}
- *Valor*: R$ ${valor}

💳 Confirmar compra com saldo da conta?
            `.trim(), {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "✅ Confirmar", callback_data: `buy_balance_${match}` },
                        { text: "🔙 Voltar", callback_data: `select_payment_method_${match}` }
                    ]
                ]
            },
        });
    }
    catch (error) {
        console.error("Erro ao processar confirm_buy_balance:", error);
        await ctx.reply("Erro inesperado.", { reply_markup: backMainKeyboard_1.backMainKeyboard });
    }
});
exports.default = composer;
