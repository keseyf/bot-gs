import { Composer } from "grammy";

const composer = new Composer();
const cooldownSet = new Set<number>(); // Armazena IDs em cooldown

composer.callbackQuery("recharge", async (ctx) => {
    const userId = ctx.from?.id;

    if (!userId) {
        await ctx.reply("Usuário não identificado.");
        return;
    }

    // Verifica se o usuário está em cooldown
    if (cooldownSet.has(userId)) {
        await ctx.answerCallbackQuery({
            text: "Espere um pouco antes de clicar novamente.",
            show_alert: false,
        });
        return;
    }

    // Adiciona usuário ao cooldown de 5 segundos
    cooldownSet.add(userId);
    setTimeout(() => cooldownSet.delete(userId), 5000);

    try {
        await ctx.answerCallbackQuery(); // Evita botão travado

        await ctx.editMessageText("💸 Escolha um valor de recarga:", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "R$ 5,00", callback_data: "recharge_0.01" }],
                    [{ text: "R$ 10,00", callback_data: "recharge_10" }],
                    [{ text: "R$ 20,00", callback_data: "recharge_20" }],
                    [{ text: "R$ 50,00", callback_data: "recharge_50" }],
                    [{ text: "R$ 100,00", callback_data: "recharge_100" }],
                    [{ text: "🔙 Voltar", callback_data: "chooseRechargeType" }],
                ],
            },
        });
    } catch (e) {
        console.error(e);
        await ctx.reply("Erro inesperado!");
    }
});

export default composer;
