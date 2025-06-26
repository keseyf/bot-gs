import { Composer } from "grammy";
import { prisma } from "../utils/utils";

const composer = new Composer();

// Captura /spam <mensagem>
composer.hears(/^\/spam(?:@[\w_]+)? (.+)/, async (ctx) => {
    const userId = ctx.from?.id;

    if (!userId) {
        await ctx.reply("ID do usuário não encontrado.");
        return;
    }

    const user = await prisma.user.findUnique({
        where: { telegramId: String(userId) },
    });

    if (user?.userType !== "admin") {
        return; // Ignora se não for admin
    }

    const spamMessage = ctx.match[1];

    if (!spamMessage || spamMessage.trim() === "") {
        await ctx.reply("Você não utilizou corretamente o comando!\nUso correto: /spam <mensagem>");
        return;
    }

    // Busca todos os telegramId dos usuários
    const users = await prisma.user.findMany({
        select: { telegramId: true },
    });

    let successCount = 0;
    let failCount = 0;

    for (const u of users) {
        try {
            await ctx.api.sendMessage(Number(u.telegramId), spamMessage);
            successCount++;
        } catch (error) {
            console.error(`Erro ao enviar para ${u.telegramId}:`, error);
            failCount++;
        }
    }

    await ctx.reply(`Mensagem enviada para ${successCount} usuários.\nFalhas: ${failCount}`);
});

// Fallback caso use apenas "/spam" sem mensagem
composer.command("spam", async (ctx) => {
    await ctx.reply("Uso correto: /spam <mensagem>");
});

export default composer;