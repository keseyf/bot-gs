import { InlineKeyboard } from "grammy";

export const rechargeKeyboard = new InlineKeyboard()
    .text("💵 R$ 3", "recharge_3")
    .text("💵 R$ 5", "recharge_5")
    .row()
    .text("💵 R$ 10", "recharge_10")
    .text("💵 R$ 20", "recharge_20")
    .row()
    .text("💵 R$ 50", "recharge_50")
    .row()
    .text("💵 R$ 100", "recharge_100")
    .row()
    .text("🔙 Voltar ao menu", "main")
    