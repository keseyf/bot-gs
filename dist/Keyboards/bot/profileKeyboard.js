"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileKeyboard = void 0;
const grammy_1 = require("grammy");
exports.profileKeyboard = new grammy_1.InlineKeyboard()
    .text("💵 Recarga", "chooseRechargeType")
    .row()
    .text("🔙 Voltar", "main");
