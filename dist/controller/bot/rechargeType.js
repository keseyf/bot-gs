"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const composer = new grammy_1.Composer();
composer.callbackQuery("chooseRechargeType", async (ctx) => {
    ctx.editMessageText("💸 Escolha um tipo de recarga:", { reply_markup: new grammy_1.InlineKeyboard()
            .text("💠 Pix", "recharge")
            .row()
            .text("🔙 Voltar", "main")
    });
});
exports.default = composer;
