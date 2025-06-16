import { Composer } from "grammy";
import { prisma } from "../../utils/utils";
import { chooseTypeCardKeyboard } from "../../utils/Keyboards/cards/chooseTypeCardKeyboard";

const composer = new Composer();
composer.callbackQuery("cards", async (ctx) => {
    try {
        const userId = ctx.from?.id;
        if (!userId) {
            await ctx.reply("Usuário não encontrado.");
            return;
        }
        const user = await prisma.user.findUnique({
            where: { telegramId: String(userId) },
        });
        ctx.editMessageText(
            `Escolha o tipo do cartão na tabela abaixo: [ㅤ](https://i.ibb.co/ZWNF4F5/photo-2023-06-06-18-19-36.jpg)`,{parse_mode:"Markdown", reply_markup: chooseTypeCardKeyboard}
        )
    } catch (error) {
        console.error("Error handling cards callback query:", error);
        await ctx.reply("Ocorreu um erro ao processar seu pedido.");
    }
});
export default composer;