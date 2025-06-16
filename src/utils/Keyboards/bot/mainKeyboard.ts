import { InlineKeyboard } from "grammy";
import dotenv from "dotenv";
dotenv.config();
const sellerUsername = process.env.SELLER_USERNAME;

if (!sellerUsername) {
    throw new Error("SELLER_USERNAME is not defined in the environment variables.");
}

export const mainKeyboard = new InlineKeyboard()
    .text("💳 Comprar", "cards")
    .text("👤 Perfil", "profile")
    .row()
    .text("❓ Sobre", "help")
    .url("📖 Dicas de uso", "https://t.me/recargatips")
    .row()
    .text("💵 Recarga", "chooseRechargeType")
    .url("📢 Refs", "https://t.me/canalgratist")
    .row()
    .url("👥 Faq", `https://t.me/${sellerUsername}`)