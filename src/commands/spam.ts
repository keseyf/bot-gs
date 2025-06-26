import { Composer } from "grammy";
import { prisma } from "../utils/utils";

const composer = new Composer();

composer.command("spam", async (ctx) => {
    const userId = ctx.from?.id;

    if (!userId) {
        await ctx.reply("User ID not found.");
        return;
    }
    const user = await prisma.user.findUnique({
        where: { telegramId: String(userId) },
    })

    if(user?.userType === "admin") {
        const spamMessage = ctx.match[1]
        if (!spamMessage || spamMessage === undefined || spamMessage === null){
ctx.reply("Você não utilizou corretamente o comando!\nUso correto: /spam <Mensagem>"
}
    }else{
       return;
    }
});

export default composer;