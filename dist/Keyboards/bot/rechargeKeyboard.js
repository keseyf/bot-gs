"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rechargeKeyboard = void 0;
const grammy_1 = require("grammy");
exports.rechargeKeyboard = new grammy_1.InlineKeyboard()
    .text("R$ 3", "recharge_3")
    .text("R$ 5", "recharge_5")
    .row()
    .text("R$ 10", "recharge_10")
    .text("R$ 20", "recharge_20")
    .row()
    .text("R$ 50", "recharge_50")
    .row()
    .text("R$ 100", "recharge_100")
    .row()
    .text("🔙 Voltar ao menu", "main");
