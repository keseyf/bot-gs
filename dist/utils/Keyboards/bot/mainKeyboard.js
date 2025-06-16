"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainKeyboard = void 0;
const grammy_1 = require("grammy");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sellerUsername = process.env.SELLER_USERNAME;
if (!sellerUsername) {
    throw new Error("SELLER_USERNAME is not defined in the environment variables.");
}
exports.mainKeyboard = new grammy_1.InlineKeyboard()
    .text("💳 Comprar", "cards")
    .text("👤 Perfil", "profile")
    .row()
    .text("❓ Sobre", "help")
    .url("📖 Dicas de uso", "https://t.me/recargatips")
    .row()
    .text("💵 Recarga", "chooseRechargeType")
    .url("📢 Refs", "https://t.me/canalgratist")
    .row()
    .url("👥 Faq", `https://t.me/${sellerUsername}`);
