"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const card_1 = __importDefault(require("../../../utils/card"));
const composer = new grammy_1.Composer();
composer.callbackQuery(/^confirm_buy_balance_(.+)/, async (ctx) => {
    const match = ctx.match[1];
    ctx.editMessageText(`
🔴 Àpos a compra nossa equipe será notificada e irá enviar os dados no seu perfil privado.
🔴 Tempo de envio pode variar.

- \*Cartao\*: ${match.replace(/_/g, " ")}
- \*Valor\*: R$ ${card_1.default[match].toFixed(2)}
💳 Confirmar compra com saldo da conta?`, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "✅ Confirmar", callback_data: `buy_balance_${match}` },
                    { text: "🔙 Voltar", callback_data: `select_payment_method_${match}` }
                ]
            ]
        },
        parse_mode: "Markdown"
    });
});
exports.default = composer;
