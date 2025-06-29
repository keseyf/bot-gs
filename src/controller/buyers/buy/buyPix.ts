import { Composer, InlineKeyboard } from "grammy";
import { app } from "../../../utils/utils";
import products from "../../../utils/card";
import { backMainKeyboard } from "../../../utils/Keyboards/bot/backMainKeyboard";
import { MercadoPagoConfig, Payment } from "mercadopago";
import 'dotenv/config';

const MP_TOKEN = process.env.MP_TOKEN;
if (!MP_TOKEN) throw new Error("MercadoPago access token is not defined");

const mp = new MercadoPagoConfig({ accessToken: MP_TOKEN });
const payment = new Payment(mp);

const sellerId = process.env.SELLER_ID;
if (!sellerId) console.error("No seller id provided");

const CX = process.env.CX;

const sellerUsername = process.env.SELLER_USERNAME;
if (!sellerUsername) throw new Error("SELLER_USERNAME is not defined");

const composer = new Composer();
const cooldownSet = new Set<number>(); // Cooldown antiflood

composer.callbackQuery(/^buy_pix_(.+)$/, async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) {
        await ctx.reply("Usuário não identificado.");
        return;
    }

    if (cooldownSet.has(userId)) {
        await ctx.answerCallbackQuery({
            text: "Espere um pouco antes de clicar novamente.",
            show_alert: false,
        });
        return;
    }

    cooldownSet.add(userId);
    setTimeout(() => cooldownSet.delete(userId), 5000);

    try {
        const match = ctx.callbackQuery?.data?.match(/^buy_pix_(.+)$/);
        if (!match) return;

        const cardTypeRaw = match[1];
        const productTypeKey = cardTypeRaw.toUpperCase();
        const product = products[productTypeKey];

        if (!product) {
            await ctx.reply("❌ Tipo de cartão inválido.");
            return;
        }

        await ctx.answerCallbackQuery();
        await ctx.editMessageText("Gerando código PIX...");

        const response = await payment.create({
            body: {
                transaction_amount: Number(product),
                payment_method_id: "pix",
                payer: {
                    email: `user_${userId}@example.com`,
                },
                description: `Compra de cartão ${productTypeKey}`,
            },
        });

        const qrCode = response.point_of_interaction?.transaction_data?.qr_code;
        if (!qrCode) throw new Error("QR Code não gerado.");

        const paymentId = response.id;

        await ctx.reply(
            `
✅ *Código de pagamento criado com sucesso!*

👤 *Id de usuário:* \`${userId}\`
🆔 *Id de pagamento:* ${paymentId}
🛒 *Produto:* ${productTypeKey} 
💰 *Valor do produto:* R$ ${Number(product).toFixed(2)}

🔷 *Chave Pix:* \`${qrCode}\`

💡 *Dica:* _Clique sobre o código acima para copiá-lo automaticamente para a área de transferência!_

_Assim que o pagamento for confirmado, o envio será feito pelo próprio bot._`,
            {
                parse_mode: "Markdown",
                reply_markup: new InlineKeyboard().text("⏰ Aguardando pagamento"),
            }
        );

        // Verifica o pagamento a cada 5 segundos (máx 3 minutos)
        for (let i = 0; i < 36; i++) {
            try {
                const statusResponse = await payment.get({ id: Number(paymentId) });

                if (statusResponse?.status === "approved") {
                    await ctx.editMessageText(`✅ Compra realizada com sucesso!

💳 Valor: R$ ${Number(product).toFixed(2)}
${ctx.from?.username ? "👤 Usuário: t.me/" + ctx.from.username : ""}
🆔 ID: \`${userId}\`

Logo um administrador irá entrar em contato para enviar-lhe o produto.`, {
                        parse_mode: "Markdown",
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "🏠 Menu", callback_data: "main" }],
                                [{ text: "🔄 Comprar outro produto", callback_data: "cards" }],
                                [{ text: "📞 Entrar em contato", url: `https://t.me/${sellerUsername}` }],
                            ],
                        },
                    });

                    try {
                        await app.api.sendMessage(String(sellerId), `✅ Compra de saldo concluída.

${ctx.from?.username ? "👤 Usuário: t.me/" + ctx.from.username : ""}
🆔 ID: \`${userId}\`
💳 Valor: R$ ${Number(product).toFixed(2)}
🛒 Produto: ${productTypeKey.replace(/_/g, " ")}
🕒 Horário de pagamento: ${new Date().toLocaleString()}
💠 Tipo de pagamento: Pix`, {
                            parse_mode: "Markdown",
                            reply_markup: new InlineKeyboard().text("💬 Responder Cliente", "sendT"),
                        });

                        await app.api.sendMessage(String(CX), `✅ Compra de saldo concluída.

${ctx.from?.username ? "👤 Usuário: t.me/" + ctx.from.username : ""}
🆔 ID: ${userId}
💳 Valor: R$ ${Number(product).toFixed(2)}
🛒 Produto: ${productTypeKey.replace(/_/g, " ")}
🕒 Horário de pagamento: ${new Date().toLocaleString()}
💠 Tipo de pagamento: Pix`, {
                            parse_mode: "Markdown",
                            reply_markup: new InlineKeyboard().text("💬 Responder Cliente", "sendT"),
                        });
                    } catch (error) {
                        console.error("Erro ao notificar o vendedor:", error);
                        await ctx.reply(`❌ Ocorreu um erro ao notificar o vendedor. Entre em contato com a moderação: @${sellerUsername}`);
                    }
                    return;
                }
            } catch (error) {
                console.error("Erro verificando pagamento:", error);
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        // Timeout após 3 minutos
        try {
            await ctx.editMessageText("⏳ O tempo para pagamento expirou. Por favor, tente novamente.", {
                reply_markup: backMainKeyboard,
            });
            await payment.cancel({ id: Number(paymentId) });
        } catch (error) {
            console.error("Erro ao cancelar pagamento:", error);
            await ctx.reply("❌ Ocorreu um erro ao cancelar o pagamento. Tente novamente mais tarde.");
        }
    } catch (e) {
        console.error(e);
        await ctx.reply("Erro inesperado.");
    }
});

export default composer;
