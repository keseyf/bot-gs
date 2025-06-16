import { InlineKeyboard } from "grammy";

export const profileKeyboard = new InlineKeyboard()
.text("💵 Recarga", "chooseRechargeType").text("💳 Comprar", "cards")
.row()
.text("🔙 Voltar", "main")