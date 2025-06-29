import { InlineKeyboard } from "grammy";
import dotenv from "dotenv";
dotenv.config();
const sellerUsername = process.env.SELLER_USERNAME;

if (!sellerUsername) {
    throw new Error("SELLER_USERNAME is not defined in the environment variables.");
}

export const mainKeyboard = new InlineKeyboard()
    .text("💳 Comprar", "cards")
    .row()
    .text("⭐ Comprar curso", "buyCourse")
    .text("💵 Recarga", "chooseRechargeType")
    .row()
    .text("👤 Perfil", "profile")
    .text("❓ Sobre", "help")
    .row()
    // .url("📢 Refs",                                "https://t.me/canalgratist")
    .url("👥 Suporte", `https://t.me/${sellerUsername}`)