import { Composer } from "grammy";

const composer = new Composer();
composer.callbackQuery("recharge", async (ctx) => {
    ctx.editMessageText("💸 Escolha um valor de recarga:", {
        reply_markup: {
            inline_keyboard: [
                [{text: "R$ 5,00", callback_data: "recharge_0.01"}],
                [{ text: "R$ 10,00", callback_data: "recharge_10" }],
                [{ text: "R$ 20,00", callback_data: "recharge_20" }],
                [{ text: "R$ 50,00", callback_data: "recharge_50" }],
                [{ text: "R$ 100,00", callback_data: "recharge_100" }],
                [{ text: "🔙 Voltar", callback_data: "main" }],
            ],
        },
    });
});

export default composer;