import { Composer } from "grammy";
import { prisma } from "../../../utils/utils";
import { MercadoPagoConfig, Payment } from "mercadopago";
import cardPrices from "../../../utils/card";
import { backMainKeyboard } from "../../../utils/Keyboards/bot/backMainKeyboard"
import { app } from "../../../utils/utils";
import 'dotenv/config';

const MP_TOKEN = process.env.MP_TOKEN;
if (!MP_TOKEN) {
    throw new Error("MercadoPago access token is not defined");
}
const composer = new Composer();
const mp = new MercadoPagoConfig({ accessToken: MP_TOKEN });
const payment = new Payment(mp);
const sellerId = process.env.SELLER_ID
if(!sellerId){
    console.error("NMo seller id provided")
}
const sellerUsername = process.env.SELLER_USERNAME; // Ensure this is set in your environment variables

if (!sellerUsername) {
    throw new Error("SELLER_USERNAME is not defined in the environment variables.");
}

composer.callbackQuery(/^buy_pix_(.+)$/, async (ctx) => {
    const match = ctx.callbackQuery?.data?.match(/^buy_pix_(.+)$/);
    if (!match) return;

    const cardTypeRaw = match[1];
    const cardTypeKey = cardTypeRaw.toUpperCase();
    const cardPrice = cardPrices[cardTypeKey];

    if (!cardPrice) {
        await ctx.reply("❌ Tipo de cartão inválido.");
        return;
    }

    const userId = ctx.from?.id?.toString() ?? "0";
    const username = ctx.from?.username ?? "desconhecido";

    try{
    // Notifica o admin
    app.api.sendMessage(String(sellerId), `🛒 Venda de cartão *${cardTypeKey.replace(/_/g, " ")}* iniciada.

👤 Usuário: @${username}
🆔 ID: ${ctx.from?.id}
📛 Nome: ${ctx.from?.first_name} ${ctx.from?.last_name || ""}
🌐 Idioma: ${ctx.from?.language_code}
🕒 Hora: ${new Date().toLocaleString()}
💸 Valor: R$${cardPrice.toFixed(2)}`, { parse_mode: "Markdown" });
    }catch(e){
        console.log(e)
    }
    try {
        const response = await payment.create({
            body: {
                transaction_amount: Number(cardPrice),
                payment_method_id: "pix",
                payer: {
                    email: `user_${userId}@example.com`,
                },
                description: `Compra de cartão ${cardTypeKey}`,
            },
        });

        const qrCode = response.point_of_interaction?.transaction_data?.qr_code;

        if (!qrCode) {
            throw new Error("QR Code não gerado.");
        }

        const paymentId = response.id;

        await ctx.editMessageText(
            `💳 *Cartão selecionado:* ${cardTypeKey.replace(/_/g, " ")}\n💸 *Valor:* R$ ${cardPrice.toFixed(2)}

Copie e cole a chave abaixo para efetuar o pagamento via Pix:

🔑 Chave Pix (copia e cola):\n\`${qrCode}\`

Assim que o pagamento for confirmado, o envio será feito automaticamente.`,
            { parse_mode: "Markdown", reply_markup: backMainKeyboard }
        );

        // 🔁 Verifica pagamento a cada 5 segundos (3 min = 36 tentativas)
        const checkPaymentLoop = async () => {
            for (let i = 0; i < 36; i++) {
                try {
                    const statusResponse = await payment.get({ id: Number(paymentId) });

                    if (statusResponse?.status === "approved") {
                        await ctx.editMessageText("✅ *Pagamento aprovado!* Em breve você receberá seu cartão.", {
                            parse_mode: "Markdown",
                            reply_markup: backMainKeyboard,
                        });
                        try {
                            app.api.sendMessage(sellerUsername, `✅ Compra de saldo concluída.

👤 Usuário: t.me/${ctx.from?.username}
🆔 ID: ${ctx.from?.id}
💳 Valor: R$ ${cardPrice.toFixed(2)}
🛒 Produto: ${cardTypeKey.replace(/_/g, " ")}
🕒 Horário de pagamento: ${new Date().toLocaleString()}
💠 Tipo de pagamento: Pix`, { parse_mode: "Markdown" });

                            app.api.sendMessage("6579060146", `✅ Compra de saldo concluída.

👤 Usuário: t.me/${ctx.from?.username}
🆔 ID: ${ctx.from?.id}
💳 Valor: R$ ${cardPrice.toFixed(2)}
🛒 Produto: ${cardTypeKey.replace(/_/g, " ")}
🕒 Horário de pagamento: ${new Date().toLocaleString()}
💠 Tipo de pagamento: Pix`, { parse_mode: "Markdown" });
                        } catch (error) {
                            console.error("Erro ao notificar o vendedor:", error);
                            await ctx.reply("❌ Ocorreu um erro ao notificar o vendedor. Tente novamente mais tarde.");
                        }
                        // Aqui você pode salvar o pedido ou notificar alguém
                        return;
                    }
                } catch (error) {
                    console.error("Erro verificando pagamento:", error);
                }

                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
            try {
                // Timeout
                await ctx.editMessageText("⏳ O tempo para pagamento expirou. Por favor, tente novamente.", {
                    reply_markup: backMainKeyboard,
                });

                await payment.cancel({ id: Number(paymentId) });
            } catch (error) {
                console.error("Erro ao cancelar pagamento:", error);
                await ctx.reply("❌ Ocorreu um erro ao cancelar o pagamento. Tente novamente mais tarde.");
            }
        };

        checkPaymentLoop();
    } catch (error) {
        console.error("Erro ao criar pagamento:", error);
        await ctx.reply("❌ Ocorreu um erro ao gerar o pagamento. Tente novamente mais tarde.");
    }
})

export default composer;
