import { Composer } from "grammy";
import { prisma } from "../../utils/utils";

const composer = new Composer();

composer.callbackQuery("sendT", async (ctx) => {
    const uid = ctx.from.id;

    const user = await prisma.user.findUnique({
        where: { telegramId: String(uid) }
    });

    if (user?.userType !== "admin") {
        await ctx.reply("❌ Você não possui permissão para utilizar este comando!");
        return;
    }

    await ctx.reply(`
📤 *Enviar mensagem ao usuário:*
- Use o comando: /text <id> <msg>
- <id> = ID do usuário
- <msg> = Mensagem

📎 *Exemplo:*
/text 70000000 Olá, esta é uma mensagem de teste

🎁 *Enviar produto ao usuário:*
- Use o comando: /send <id> <produto>
- <id> = ID do usuário
- <produto> = Detalhes do produto

📎 *Exemplo:*
/send 70000000 Cartão X numero do cartão: 55555555555 cvv: 555 validade: 05/2025
`, { parse_mode: "Markdown" });
});

export default composer;
