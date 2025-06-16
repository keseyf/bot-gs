"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyKeyboard = void 0;
const grammy_1 = require("grammy");
exports.buyKeyboard = new grammy_1.InlineKeyboard()
    .text("💳 Escolher cartão", "choose")
    .row()
    .text("💵 Recarregar", "recharge")
    .row()
    .text("🔙 Voltar", "main");
