import { Composer, InlineKeyboard } from "grammy";
import cardPrices from "../../utils/card";
const composer = new Composer();

composer.callbackQuery(/^select_card_(.+)$/, async (ctx) => {
    const cardType = ctx.match[1].replace(/_/g, " ");
    await ctx.editMessageText(`✅ \*Tudo certo\*,Você escolheu o cartão: 
💳 - \`${cardType}\`
💵 - \*R$ ${cardPrices[ctx.match[1]]}\*

Escolha uma opção abaixo:`, {
        reply_markup: new InlineKeyboard()
            .text("💵 Comprar", `select_payment_method_${ctx.match[1]}`).row()
            .text("🔄 Escolher outro", "cards").row()
            .text("🏠 Menu", "main"),
        parse_mode: "Markdown",
    });
});

export default composer;