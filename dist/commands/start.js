"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mainKeyboard_1 = require("../utils/Keyboards/bot/mainKeyboard");
const grammy_1 = require("grammy");
const utils_1 = require("../utils/utils");
const composer = new grammy_1.Composer();
composer.command("start", async (ctx) => {
    try {
        ctx.reply(`👋 *Bem-vindo ao nosso Bot, ${ctx.from?.first_name}!* 

✅ - Aqui você pode comprar *CC* com total praticidade e segurança.
💳 - Escolha seu *CC*, realize o pagamento via *Pix* ou com saldo de recargas e nossa equipe irá lhe instruir o uso do produto.

🛡️ Lembre-se de ler os /termos antes de prosseguir.

Se precisar de ajuda, utilize o menu ou chame o suporte. Boa compra! [ㅤㅤ](https://i.4cdn.org/b/1753404701592459.jpg)`, { parse_mode: "Markdown", reply_markup: mainKeyboard_1.mainKeyboard, link_preview_options: { show_above_text: false } });
        try {
            const user = await utils_1.prisma.user.findUnique({
                where: { telegramId: String(ctx.from?.id) },
            });
            if (!user) {
                await utils_1.prisma.user.create({
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
        }
        catch (e) {
            console.log(e);
            ctx.reply("Erro desconhecido.");
        }
    }
    catch (e) {
        console.error("Error handling main callback query:", e);
        await ctx.editMessageText(`👋 *Bem-vindo ao nosso Bot, ${ctx.from?.first_name}!* 

✅ - Aqui você pode comprar *CC* com total praticidade e segurança.
💳 - Escolha seu *CC*, realize o pagamento via *Pix* ou com saldo de recargas e nossa equipe irá lhe instruir o uso do produto.

🛡️ Lembre-se de ler os /termos antes de prosseguir.

Se precisar de ajuda, utilize o menu ou chame o suporte. Boa compra! [ㅤㅤ](https://i.4cdn.org/b/1753404701592459.jpg)`, { parse_mode: "Markdown", reply_markup: mainKeyboard_1.mainKeyboard, link_preview_options: { show_above_text: false } });
    }
});
exports.default = composer;
