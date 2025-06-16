import { Composer } from "grammy";
import { app, prisma } from "../../../utils/utils";
import cardPrices from "../../../utils/card";

const sellerUsername = process.env.SELLER_USERNAME; // Ensure this is set in your environment variables
const sellerId = process.env.SELLER_ID; // Ensure this is set in your environment variables
if (!sellerId) {
    throw new Error("SELLER_ID is not defined in the environment variables.");
}

if (!sellerUsername) {
    throw new Error("SELLER_USERNAME is not defined in the environment variables.");
}
const composer = new Composer();
composer.callbackQuery(/^buy_balance_(.+)$/, async (ctx) => {
    const match = ctx.match[1];
    const userId = ctx.from?.id;
    const cardPrice = cardPrices[match];

    if (!userId) {
        await ctx.reply("User ID not found.");
        return;
    }

    const user = await prisma.user.findUnique({
        where: { telegramId: String(userId) },
    });

    if (!user || user.balance < cardPrice) {
        await ctx.reply("Saldo insuficiente.");
        return;
    }

    // Proceed with the balance purchase logic
    await ctx.editMessageText(`✅ Compra realizada com sucesso!

💳 Valor: R$ ${cardPrice.toFixed(2)}
👤 Usuário: @${ctx.from?.username}
🆔 ID: ${ctx.from?.id}

Logo um administrador irá entrar em contato para enviar-lhe o produto.`, {
        parse_mode: "Markdown", 
        reply_markup: {
            inline_keyboard: [
                [{ text: "🏠 Menu", callback_data: "main" }],
                [{ text: "🔄 Comprar outro cartão", callback_data: "cards" }],
                [{ text: `📞 Entrar em contato`, url:`https://t.me/${sellerUsername}` }]
            ],
        },
    });

try{
    app.api.sendMessage(sellerId, `✅ Compra de saldo concluída.
                            
👤 Usuário: t.me/${ctx.from?.username}
🆔 ID: ${ctx.from?.id}
💳 Valor: R$ ${cardPrice.toFixed(2)}
🛒 Produto: ${match.replace(/_/g, " ")}
🕒 Horário de pagamento: ${new Date().toLocaleString()}
💠 Tipo de pagamento: Saldo de perfil`, { parse_mode: "Markdown" });
    }catch (error) {
        console.error("Error sending message to seller:", error);
    }
    await prisma.user.update({
        where: { telegramId: String(userId) },
        data: { balance: user.balance - cardPrice },
    });
});

export default composer;
