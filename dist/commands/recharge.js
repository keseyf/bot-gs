"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const mercadopago_1 = require("mercadopago");
const rechargeKeyboard_1 = require("../utils/Keyboards/bot/rechargeKeyboard");
const composer = new grammy_1.Composer();
const MPToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
const mpClient = new mercadopago_1.MercadoPagoConfig({ accessToken: MPToken });
composer.callbackQuery("recharge", async (ctx) => {
    ctx.editMessageText("💸 Escolha um valor de recarga:", { reply_markup: rechargeKeyboard_1.rechargeKeyboard });
});
exports.default = composer;
