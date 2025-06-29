import { Composer, InlineKeyboard } from "grammy";
import { app, prisma } from "../../../utils/utils";
import productPrices from "../../../utils/card";

const sellerUsername = process.env.SELLER_USERNAME;
const sellerId = process.env.SELLER_ID;

if (!sellerId) {
    throw new Error("SELLER_ID is not defined in the environment variables.");
}
if (!sellerUsername) {
    throw new Error("SELLER_USERNAME is not defined in the environment variables.");
}

const composer = new Composer();
const cooldownSet = new Set<number>(); // Bloqueio de flood

composer.callbackQuery(/^buy_balance_(.+)$/, async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) {
        await ctx.reply("User ID not found.");
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

    cooldownSet.add(userId);
    setTimeout(() => cooldownSet.delete(userId), 5000);

    const match = ctx.match[1];
    const productPrice = productPrices[match];

    const user = await prisma.user.findUnique({
        where: { telegramId: String(userId) },
    });

    if (!user || user.balance < productPrice) {
        await ctx.editMessageText(`❌ Saldo insuficiente, o que fazer?

- Realize uma recarga para conseguir realizar a compra com saldo da conta.
- Ou realize a compra com pagamento via PIX.`, {
            reply_markup: new InlineKeyboard().text("💸 Adicionar Saldo", "chooseRechargeType")
        });
        return;
    }

    await ctx.answerCallbackQuery(); // resposta rápida pro Telegram

    await ctx.editMessageText(`✅ Compra realizada com sucesso!

💳 Valor: R$ ${productPrice.toFixed(2)}
${ctx.from?.username ? "👤 Usuário: t.me/" + ctx.from?.username : ""}
🆔 ID: \`${ctx.from?.id}\`

Logo um administrador irá entrar em contato para enviar-lhe o produto.`, {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "🏠 Menu", callback_data: "main" }],
                [{ text: "🔄 Comprar outro produto", callback_data: "cards" }],
                [{ text: "📞 Entrar em contato", url: `https://t.me/${sellerUsername}` }]
            ],
        },
    });

    try {
        await app.api.sendMessage(sellerId, `✅ Compra de saldo concluída.

${ctx.from?.username ? "👤 Usuário: t.me/" + ctx.from?.username : ""}
🆔 ID: \`${ctx.from?.id}\`
💳 Valor: R$ ${productPrice.toFixed(2)}
🛒 Produto: ${match.replace(/_/g, " ")}
🕒 Horário de pagamento: ${new Date().toLocaleString()}
💠 Tipo de pagamento: Saldo`, {
            parse_mode: "Markdown",
            reply_markup: new InlineKeyboard().text("💬 Responder Cliente", "sendT")
        });
    } catch (error) {
        console.error("Error sending message to seller:", error);
    }

    await prisma.user.update({
        where: { telegramId: String(userId) },
        data: { balance: user.balance - productPrice },
    });
});

export default composer;
