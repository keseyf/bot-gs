import { Composer } from "grammy";
const composer = new Composer();

composer.callbackQuery(/^select_payment_method_(.+)$/, async (ctx) => {

    ctx.editMessageText("💳 Escolha um método de pagamento:", {
        reply_markup: {
            inline_keyboard: [
                [{ text: "💠 Pix", callback_data: `confirm_buy_pix_${ctx.match[1]}` }],
                [{ text: "👤 Saldo da conta", callback_data: `confirm_buy_balance_${ctx.match[1]}` }],
                [{ text: "🔙 Voltar", callback_data: "main" }],
            ],
        },
    });
});

export default composer;