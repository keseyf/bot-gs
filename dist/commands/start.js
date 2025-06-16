"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const mainKeyboard_1 = require("../utils/Keyboards/bot/mainKeyboard");
const utils_1 = require("../utils/utils");
const composer = new grammy_1.Composer();
composer.command("start", async (ctx) => {
    try {
        ctx.reply(`👋 *Bem-vindo ao nosso Bot, ${ctx.from?.first_name}!* 

✅ - Aqui você pode comprar *CC* com total praticidade e segurança.
💳 - Escolha seu *CC*, realize o pagamento via *Pix* ou com saldo de recargas e nossa equipe irá lhe instruir o uso do produto.

🛡️ Lembre-se de ler os /termos antes de prosseguir.

Se precisar de ajuda, utilize o menu ou chame o suporte. Boa compra! [ㅤㅤ](https://i.4cdn.org/r/1749933222382233.jpg)`, { parse_mode: "Markdown", reply_markup: mainKeyboard_1.mainKeyboard, link_preview_options: { show_above_text: false } });
        const user = await utils_1.prisma.user.findUnique({
            where: { telegramId: String(ctx.from?.id) },
        });
        if (!user) {
            try {
                await utils_1.prisma.user.create({
                    data: {
                        telegramId: String(ctx.from?.id),
                        name: ctx.from?.first_name || "Desconhecido",
                        username: ctx.from?.username || "Desconhecido",
                        balance: 0.00,
                        userType: "regular", // Default user type
                    },
                });
                console.log("New user created:", ctx.from?.first_name);
            }
            catch (e) {
                console.error("Error creating new user:", e);
                await ctx.reply("Erro ao criar usuário. Por favor, tente novamente mais tarde.");
                return;
            }
        }
    }
    catch (e) {
        console.error("Error handling main callback query:", e);
        await ctx.reply("OLÁ, EU SOU O BOT DO RECARREGADOR DE PIX!\n\n" +
            "Aqui você pode recarregar seu saldo de forma rápida e fácil.\n\n", { reply_markup: mainKeyboard_1.mainKeyboard });
    }
});
exports.default = composer;
