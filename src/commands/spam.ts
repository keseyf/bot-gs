import { Composer } from "grammy";
import { prisma } from "../utils/utils";

const composer = new Composer();

composer.command("spam_1", async (ctx) => {
    const userId = ctx.from?.id;

    if (!userId) {
        await ctx.reply("User ID not found.");
        return;
    }
    const user = await prisma.user.findUnique({
        where: { telegramId: String(userId) },
    })

    if(user?.userType === "admin") {
        await ctx.reply("Spam 1 command executed.");
        // Here you can add the logic for the spam command
    }
});

export default composer;
