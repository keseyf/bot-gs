"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainKeyboard = void 0;
const grammy_1 = require("grammy");
exports.mainKeyboard = new grammy_1.InlineKeyboard()
    .text("💳 Comprar", "cards")
    .text("👤 Perfil", "profile")
    .row()
    .text("❓ Sobre", "about")
    .url("📖 Dicas de uso", "https://t.me/recargatips")
    .row()
    .text("💵 Recarga", "recharge")
    .url("📢 Refs", "https://t.me/canalgratist")
    .row()
    .url("👥 Faq", "https://t.me/fyex86");
