import { Composer } from "grammy";
import { prisma } from "../../utils/utils";
import { chooseTypeCardKeyboard } from "../../utils/Keyboards/cards/chooseTypeCardKeyboard";

const composer = new Composer();
const userClickCooldown = new Set<number>(); // guarda os IDs em cooldown

composer.callbackQuery("cards", async (ctx) => {
    const userId = ctx.from?.id;

    if (!userId) {
        await ctx.reply("Usuário não encontrado.");
        return;
    }

    // ❌ Se o usuário já clicou recentemente
    if (userClickCooldown.has(userId)) {
        await ctx.answerCallbackQuery({
            text: "Aguarde um momento antes de clicar novamente.",
            show_alert: false,
        });
        return;
    }

    // ✅ Adiciona o usuário ao cooldown
    userClickCooldown.add(userId);
    setTimeout(() => userClickCooldown.delete(userId), 5000); // 5 segundos

    try {
        await ctx.answerCallbackQuery(); // responde rápido pro Telegram

        const user = await prisma.user.findUnique({
            where: { telegramId: String(userId) },
        });

        await ctx.editMessageText(
            `Escolha o tipo do produto na tabela abaixo: [ㅤ](https://i.ibb.co/ZWNF4F5/photo-2023-06-06-18-19-36.jpg)`,
            {
                parse_mode: "Markdown",
                reply_markup: chooseTypeCardKeyboard,
            }
        );
    } catch (error) {
        console.error("Erro ao processar cards:", error);
        await ctx.reply("Ocorreu um erro ao processar seu pedido.");
    }
});

export default composer;
