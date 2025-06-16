import { Composer } from "grammy";
import cardlist from "../../../utils/card";
const composer = new Composer();
composer.callbackQuery(/^confirm_buy_balance_(.+)/, async (ctx) => {
    const match = ctx.match[1];

    ctx.editMessageText(`
🔴 Àpos a compra nossa equipe será notificada e irá enviar os dados no seu perfil privado.
🔴 Tempo de envio pode variar.

- \*Cartao\*: ${match.replace(/_/g, " ")}
- \*Valor\*: R$ ${cardlist[match].toFixed(2)}
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
export default composer;