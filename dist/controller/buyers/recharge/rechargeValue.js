"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const composer = new grammy_1.Composer();
composer.callbackQuery("recharge", async (ctx) => {
    ctx.editMessageText("💸 Escolha um valor de recarga:", {
        reply_markup: {
            inline_keyboard: [
                [{ text: "R$ 5,00", callback_data: "recharge_5" }],
                [{ text: "R$ 10,00", callback_data: "recharge_10" }],
                [{ text: "R$ 20,00", callback_data: "recharge_20" }],
                [{ text: "R$ 50,00", callback_data: "recharge_50" }],
                [{ text: "R$ 100,00", callback_data: "recharge_100" }],
                [{ text: "🔙 Voltar", callback_data: "chooseRechargeType" }],
            ],
        },
    });
});
exports.default = composer;
