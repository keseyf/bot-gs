import { Composer } from "grammy";
import { backMainKeyboard } from "../../utils/Keyboards/bot/backMainKeyboard";

const composer = new Composer();
const cooldownSet = new Set<number>(); // Cooldown temporário

composer.callbackQuery(/^select_payment_method_(.+)$/, async (ctx) => {
    const userId = ctx.from?.id;

    if (!userId) {
        await ctx.reply("Usuário não encontrado.");
        return;
    }

    // Evita cliques repetidos em sequência
    if (cooldownSet.has(userId)) {
        await ctx.answerCallbackQuery({
            text: "Espere um pouco antes de clicar novamente.",
            show_alert: false,
        });
        return;
    }

    cooldownSet.add(userId);
    setTimeout(() => cooldownSet.delete(userId), 5000);

    try {
        await ctx.answerCallbackQuery(); // resposta rápida ao clique

        await ctx.editMessageText("💳 Escolha um método de pagamento:", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "💠 Pix", callback_data: `confirm_buy_pix_${ctx.match[1]}` }],
                    [{ text: "👤 Saldo da conta", callback_data: `confirm_buy_balance_${ctx.match[1]}` }],
                    [{ text: "🔙 Voltar", callback_data: "main" }],
                ],
            },
        });
    } catch (error) {
        console.error("Erro ao processar select_payment_method:", error);
        await ctx.reply("Erro inesperado.", {
            reply_markup: backMainKeyboard,
        });
    }
});

export default composer;
