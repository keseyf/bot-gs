import { mainKeyboard } from "../utils/Keyboards/bot/mainKeyboard";
import { Composer } from "grammy";
import { prisma } from "../utils/utils";

const composer = new Composer();

composer.command("start", async (ctx) => {
    try{
        ctx.reply(`👋 *Bem-vindo ao nosso Bot, ${ctx.from?.first_name}!* 

✅ - Aqui você pode comprar *CC* com total praticidade e segurança.
💳 - Escolha seu *CC*, realize o pagamento via *Pix* ou com saldo de recargas e nossa equipe irá lhe instruir o uso do produto.

🛡️ Lembre-se de ler os /termos antes de prosseguir.

Se precisar de ajuda, utilize o menu ou chame o suporte. Boa compra! [ㅤㅤ](https://i.4cdn.org/r/1749933222382233.jpg)`, {parse_mode:"Markdown" , reply_markup: mainKeyboard, link_preview_options: {show_above_text: false}},)
       
try{
            const user = await prisma.user.findUnique({
                where: { telegramId: String(ctx.from?.id) },
            });

            if (!user) {
                await prisma.user.create({
                    data: {
                        telegramId: String(ctx.from?.id),
                        name: ctx.from?.first_name || "Desconhecido",
                        username: ctx.from?.username,
                        balance: 0.00,
                        userType: "regular", // Default user type
                    },
                });
                console.log("New user created:", ctx.from?.first_name);
            }
        }catch(e){
            console.log(e)
            ctx.reply("Erro desconhecido.")
        }
    }catch (e) {
        console.error("Error handling main callback query:", e);
        await ctx.editMessageText(`👋 *Bem-vindo ao nosso Bot, ${ctx.from?.first_name}!* 

✅ - Aqui você pode comprar *CC* com total praticidade e segurança.
💳 - Escolha seu *CC*, realize o pagamento via *Pix* ou com saldo de recargas e nossa equipe irá lhe instruir o uso do produto.

🛡️ Lembre-se de ler os /termos antes de prosseguir.

Se precisar de ajuda, utilize o menu ou chame o suporte. Boa compra! [ㅤㅤ](https://i.4cdn.org/r/1749933222382233.jpg)`, {parse_mode:"Markdown" , reply_markup: mainKeyboard, link_preview_options: {show_above_text: false}},)
    }
    });

export default composer;