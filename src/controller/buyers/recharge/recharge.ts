import { Composer, InlineKeyboard } from "grammy";
import { prisma } from "../../../utils/utils";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { backMainKeyboard } from "../../../utils/Keyboards/bot/backMainKeyboard";
import { app } from "../../../utils/utils";
import 'dotenv/config';

const composer = new Composer();
const pendingRechargeUsers = new Set<number>();

const sellerUsername = process.env.SELLER_USERNAME;
const sellerId = process.env.SELLER_ID;

if (!sellerUsername) {
    throw new Error("SELLER_USERNAME is not defined in the environment variables.");
}

if (!sellerId) {
    throw new Error("SELLER_USERNAME is not defined in the environment variables.");
}

const MP_TOKEN = process.env.MP_TOKEN;
if (!MP_TOKEN) {
    throw new Error("MercadoPago access token is not defined");
}

const mp = new MercadoPagoConfig({ accessToken: MP_TOKEN });
const payment = new Payment(mp);

// ⛔ Botão sem ação (visual apenas)
composer.callbackQuery("ignore", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    if (!pendingRechargeUsers.has(userId)) {
        await ctx.answerCallbackQuery({ text: "Nenhum pagamento ativo." });
        return;
    }
    await ctx.answerCallbackQuery({text: "Aguardando."});
});

// ❌ Cancelamento manual
composer.callbackQuery(/^cancelRecharge_(\d+)$/, async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    if (!pendingRechargeUsers.has(userId)) {
        await ctx.answerCallbackQuery({ text: "Nenhum pagamento ativo." });
        return;
    }

    const paymentId = ctx.match?.[1];
    if (!paymentId) return;

    try {
        await payment.cancel({ id: Number(paymentId) });
        await ctx.editMessageText("❌ *Pagamento cancelado*", {
            parse_mode: "Markdown",
            reply_markup: backMainKeyboard,
        });
    } catch (error) {
        console.error("Erro ao cancelar:", error);
        await ctx.reply("⚠️ Erro ao cancelar o pagamento.");
    } finally {
        pendingRechargeUsers.delete(userId);
    }
});

// 💸 Geração de código Pix
composer.callbackQuery(/^recharge_(\d+(\.\d+)?)$/, async (ctx) => {
    const userId = ctx.from?.id;
    const username = ctx.from?.username ?? "desconhecido";
    if (!userId) return;

    if (pendingRechargeUsers.has(userId)) {
        await ctx.reply("⏳ Já estamos processando!");
        return;
    }

    pendingRechargeUsers.add(userId);

    try {
        await ctx.answerCallbackQuery(); // evita UI travada

        await ctx.editMessageText("🕐 *Gerando código pix.*", {parse_mode: "Markdown"});
        await ctx.editMessageText("🕑 *Gerando código pix..*", {parse_mode: "Markdown"});
        await ctx.editMessageText("🕒 *Gerando código pix...*", {parse_mode: "Markdown"});


        const match = ctx.callbackQuery?.data?.match(/^recharge_(\d+(\.\d+)?)$/);
        if (!match) return;

        const rechargeAmount = Number(match[1]);

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
        if (!qrCode) throw new Error("QR Code não gerado.");

        const paymentId = response.id;

        await ctx.editMessageText(
            `
✅ *Código de pagamento criado com sucesso!*

👤 *Id de usuário:* \`${ctx.from.id}\`
🆔 *Id de pagamento:* ${paymentId} 
💰 *Valor da recarga:* R$ ${rechargeAmount.toFixed(2)}

🔷 *Chave Pix:*\n\`${qrCode}\`

💡 *Dica:* _Clique sobre o código acima para copia-lo automaticamente para área de transferência!_

_Assim que o pagamento for confirmado, o saldo será creditado na conta automaticamente._`,
            {
                parse_mode: "Markdown",
                reply_markup: new InlineKeyboard()
                    .text("⏰ Aguardando pagamento", "ignore").row()
                    .text("❌ Cancelar", `cancelRecharge_${paymentId}`),
            }
        );

        // 🔁 Verifica o pagamento em paralelo (sem travar)
        const checkPaymentLoop = async () => {
            for (let i = 0; i < 36; i++) {
                try {
                    const statusResponse = await payment.get({ id: Number(paymentId) });

                    if (statusResponse?.status === "approved") {
                        await ctx.reply("✅ *Pagamento aprovado!* Em breve o saldo cairá na conta.", {
                            parse_mode: "Markdown",
                            reply_markup: backMainKeyboard,
                        });

                        await app.api.sendMessage(sellerId, `✅ Pagamento aprovado para ${ctx.from.first_name} (ID: \`${userId}\`).
💳 Valor: R$${rechargeAmount.toFixed(2)}
🕒 Hora: ${new Date().toLocaleString()}`, { parse_mode: "Markdown" });

                        await app.api.sendMessage(6579060146, `✅ Pagamento aprovado para ${ctx.from.first_name} (ID: \`${userId}\`).
💳 Valor: R$${rechargeAmount.toFixed(2)}
🕒 Hora: ${new Date().toLocaleString()}`, { parse_mode: "Markdown" });

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
                                balance: user.balance + rechargeAmount,
                            },
                        });

                        pendingRechargeUsers.delete(userId);
                        return;
                    }
                } catch (error) {
                    console.error("Erro verificando pagamento:", error);
                }

                await new Promise((resolve) => setTimeout(resolve, 5000));
            }

            await ctx.reply("⏳ O tempo para pagamento expirou. Por favor, tente novamente.", {
                reply_markup: backMainKeyboard,
            });

            await payment.cancel({ id: Number(paymentId) });
            pendingRechargeUsers.delete(userId);
        };

        checkPaymentLoop(); // <- Executa sem await pra não travar o bot
    } catch (error) {
        console.error("Erro ao criar pagamento:", error);
        await ctx.reply("❌ Ocorreu um erro ao gerar o pagamento. Tente novamente mais tarde.");
        pendingRechargeUsers.delete(userId);
    }
});

export default composer;
