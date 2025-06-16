import { Composer, InlineKeyboard } from "grammy";
const composer = new Composer();

composer.callbackQuery("chooseRechargeType", async (ctx) => {
    ctx.editMessageText("💸 Escolha um tipo de recarga:", {reply_markup: new InlineKeyboard()
        .text("💠 Pix", "recharge")
        .row()
        .text("🔙 Voltar", "main")
})});

export default composer;