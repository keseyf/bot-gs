"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const utils_1 = require("../../../utils/utils");
const card_1 = __importDefault(require("../../../utils/card"));
const sellerUsername = process.env.SELLER_USERNAME; // Ensure this is set in your environment variables
const sellerId = process.env.SELLER_ID; // Ensure this is set in your environment variables
if (!sellerId) {
    throw new Error("SELLER_ID is not defined in the environment variables.");
}
if (!sellerUsername) {
    throw new Error("SELLER_USERNAME is not defined in the environment variables.");
}
const composer = new grammy_1.Composer();
composer.callbackQuery(/^buy_balance_(.+)$/, async (ctx) => {
    const match = ctx.match[1];
    const userId = ctx.from?.id;
    const productPrice = card_1.default[match];
    if (!userId) {
        await ctx.reply("User ID not found.");
        return;
    }
    const user = await utils_1.prisma.user.findUnique({
        where: { telegramId: String(userId) },
    });
    if (!user || user.balance < productPrice) {
        await ctx.editMessageText(`❌ Saldo insuficiente, O que fazer?

- Realize uma recarga para conseguir realizar a compra com saldo da conta.
- Realize a compra com pagamento via PIX.             `, { reply_markup: new grammy_1.InlineKeyboard().text("💸 Adicionar Saldo", "chooseRechargeType") });
        return;
    }
    // Proceed with the balance purchase logic
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
                [{ text: `📞 Entrar em contato`, url: `https://t.me/${sellerUsername}` }]
            ],
        },
    });
    try {
        utils_1.app.api.sendMessage(sellerId, `✅ Compra de saldo concluída.

${ctx.from?.username ? "👤 Usuário: t.me/" + ctx.from?.username : ""}
🆔 ID: \`${ctx.from?.id}\`
💳 Valor: R$ ${productPrice.toFixed(2)}
🛒 Produto: ${match.replace(/_/g, " ")}
🕒 Horário de pagamento: ${new Date().toLocaleString()}
💠 Tipo de pagamento: Pix`, { parse_mode: "Markdown", reply_markup: new grammy_1.InlineKeyboard().text("💬 Responder Cliente", "sendT") });
    }
    catch (error) {
        console.error("Error sending message to seller:", error);
    }
    await utils_1.prisma.user.update({
        where: { telegramId: String(userId) },
        data: { balance: user.balance - productPrice },
    });
});
exports.default = composer;
