"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const mercadopago_1 = require("mercadopago");
const card_1 = __importDefault(require("../../utils/card"));
const backMainKeyboard_1 = require("../../utils/Keyboards/bot/backMainKeyboard");
const utils_1 = require("../../utils/utils");
require("dotenv/config");
const MP_TOKEN = process.env.MP_TOKEN;
if (!MP_TOKEN) {
    throw new Error("MercadoPago access token is not defined");
}
const composer = new grammy_1.Composer();
const mp = new mercadopago_1.MercadoPagoConfig({ accessToken: MP_TOKEN });
const payment = new mercadopago_1.Payment(mp);
composer.callbackQuery(/^buy_(.+)$/, async (ctx) => {
    const match = ctx.callbackQuery?.data?.match(/^buy_(.+)$/);
    if (!match)
        return;
    const cardTypeRaw = match[1];
    const cardTypeKey = cardTypeRaw.toUpperCase();
    const cardPrice = card_1.default[cardTypeKey];
    if (!cardPrice) {
        await ctx.reply("❌ Tipo de cartão inválido.");
        return;
    }
    const userId = ctx.from?.id?.toString() ?? "0";
    const username = ctx.from?.username ?? "desconhecido";
    // Notifica o admin
    utils_1.app.api.sendMessage("7523457952", `🛒 Venda de cartão *${cardTypeKey.replace(/_/g, " ")}* iniciada.
    
👤 Usuário: @${username}
🆔 ID: ${ctx.from?.id}
📛 Nome: ${ctx.from?.first_name} ${ctx.from?.last_name || ""}
🌐 Idioma: ${ctx.from?.language_code}
🕒 Hora: ${new Date().toLocaleString()}
💸 Valor: R$${cardPrice.toFixed(2)}`, { parse_mode: "Markdown" });
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
        await ctx.editMessageText(`💳 *Cartão selecionado:* ${cardTypeKey.replace(/_/g, " ")}\n💸 *Valor:* R$ ${cardPrice.toFixed(2)}

Copie e cole a chave abaixo para efetuar o pagamento via Pix:

🔑 Chave Pix (copia e cola):\n\`${qrCode}\`

Assim que o pagamento for confirmado, o envio será feito automaticamente.`, { parse_mode: "Markdown", reply_markup: backMainKeyboard_1.backMainKeyboard });
        // 🔁 Verifica pagamento a cada 5 segundos (3 min = 36 tentativas)
        const checkPaymentLoop = async () => {
            for (let i = 0; i < 36; i++) {
                try {
                    const statusResponse = await payment.get({ id: Number(paymentId) });
                    if (statusResponse?.status === "approved") {
                        await ctx.editMessageText("✅ *Pagamento aprovado!* Em breve você receberá seu cartão.", {
                            parse_mode: "Markdown",
                            reply_markup: backMainKeyboard_1.backMainKeyboard,
                        });
                        utils_1.app.api.sendMessage("7523457952", `✅ Pagamento aprovado para o usuário @${username} (ID: ${userId}).
Cartão: ${cardTypeKey.replace(/_/g, " ")} - R$${cardPrice.toFixed(2)}
🕒 Hora: ${new Date().toLocaleString()}
                        `, { parse_mode: "Markdown" });
                        // Aqui você pode salvar o pedido ou notificar alguém
                        return;
                    }
                }
                catch (error) {
                    console.error("Erro verificando pagamento:", error);
                }
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
            // Timeout
            await ctx.editMessageText("⏳ O tempo para pagamento expirou. Por favor, tente novamente.", {
                reply_markup: backMainKeyboard_1.backMainKeyboard,
            });
            await payment.cancel({ id: Number(paymentId) });
        };
        checkPaymentLoop();
    }
    catch (error) {
        console.error("Erro ao criar pagamento:", error);
        await ctx.reply("❌ Ocorreu um erro ao gerar o pagamento. Tente novamente mais tarde.");
    }
});
exports.default = composer;
