import { Composer } from "grammy";
import { prisma } from "../../../utils/utils";
import { MercadoPagoConfig, Payment } from "mercadopago";
import cardPrices from "../../../utils/card";
import {backMainKeyboard}  from "../../../utils/Keyboards/bot/backMainKeyboard"
import {app} from "../../../utils/utils";
import 'dotenv/config';

const sellerUsername = process.env.SELLER_USERNAME; // Ensure this is set in your environment variables
if (!sellerUsername) {
    throw new Error("SELLER_USERNAME is not defined in the environment variables.");
}
const MP_TOKEN = process.env.MP_TOKEN;
if (!MP_TOKEN) {
    throw new Error("MercadoPago access token is not defined");
}
const composer = new Composer();
const mp = new MercadoPagoConfig({ accessToken: MP_TOKEN });
const payment = new Payment(mp);

composer.callbackQuery(/^recharge_(\d+(\.\d+)?)$/, async (ctx) => {
    const match = ctx.callbackQuery?.data?.match(/^recharge_(\d+(\.\d+)?)$/);
    if (!match) return;

    const rechargeAmount = Number(match[1]);
    const userId = ctx.from?.id?.toString() ?? "0";
    const username = ctx.from?.username ?? "desconhecido";

    try {
        const response = await payment.create({
            body: {
                transaction_amount: rechargeAmount,
                payment_method_id: "pix",
                payer: {
                    email: `user_${userId}@example.com`,
                },
                description: `recarga de saldo de R$ ${rechargeAmount.toFixed(2)}`,
            },
        });

        const qrCode = response.point_of_interaction?.transaction_data?.qr_code;

        if (!qrCode) {
            throw new Error("QR Code não gerado.");
        }

        const paymentId = response.id;

        await ctx.editMessageText(
            `💳 *Valor da recarga:* R$ ${rechargeAmount.toFixed(2)}

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
                        await ctx.editMessageText("✅ *Pagamento aprovado!* Em breve o saldo caira na conta.", {
                            parse_mode: "Markdown",
                            reply_markup: backMainKeyboard,
                        });
                        try{

                            app.api.sendMessage(sellerUsername, `✅ Pagamento aprovado para o usuário @${username} (ID: ${userId}).
💳 Recarga: R$${rechargeAmount.toFixed(2)}
🕒 Hora: ${new Date().toLocaleString()}
                            `, { parse_mode: "Markdown" });
    
                            app.api.sendMessage(6579060146, `✅ Pagamento aprovado para o usuário @${username} (ID: ${userId}).
💳 Recarga: R$${rechargeAmount.toFixed(2)}
🕒 Hora: ${new Date().toLocaleString()}
                            `, { parse_mode: "Markdown" });
                        }catch (error) {
                            console.error("Erro ao enviar mensagem para o vendedor:", error);
                       }

                        const user = await prisma.user.findUnique({
                            where: { telegramId: String(userId) },
                        });
                        if (!user) {
                            console.error("Usuário não encontrado.");
                            return;
                        }
                        await prisma.user.update({
                            where: { telegramId: String(userId) },
                            data: {
                                balance: (user.balance) + rechargeAmount,
                            },
                        });

                        // Aqui você pode salvar o pedido ou notificar alguém
                        return;
                    }
                } catch (error) {
                    console.error("Erro verificando pagamento:", error);
                }

                await new Promise((resolve) => setTimeout(resolve, 5000));
            }

            // Timeout
            await ctx.editMessageText("⏳ O tempo para pagamento expirou. Por favor, tente novamente.", {
                reply_markup: backMainKeyboard,
            });

            await payment.cancel({ id: Number(paymentId) });
        };

        checkPaymentLoop();
    } catch (error) {
        console.error("Erro ao criar pagamento:", error);
        await ctx.reply("❌ Ocorreu um erro ao gerar o pagamento. Tente novamente mais tarde.");
    }
})

export default composer;
