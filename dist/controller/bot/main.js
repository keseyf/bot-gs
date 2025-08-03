"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mainKeyboard_1 = require("../../utils/Keyboards/bot/mainKeyboard");
const grammy_1 = require("grammy");
const utils_1 = require("../../utils/utils");
const composer = new grammy_1.Composer();
// Guarda últimos tempos de uso por usuário (em ms)
const cooldowns = new Map();
const COOLDOWN_TIME = 5000; // 5 segundos
composer.callbackQuery("main", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId)
        return; // só pra garantir
    const now = Date.now();
    const lastUsed = cooldowns.get(userId) || 0;
    if (now - lastUsed < COOLDOWN_TIME) {
        // Pode avisar que está em cooldown ou só ignorar
        await ctx.answerCallbackQuery({
            text: `⏳ Aguarde ${((COOLDOWN_TIME - (now - lastUsed)) / 1000).toFixed(1)}s antes de usar novamente.`,
            show_alert: false,
        });
        return;
    }
    cooldowns.set(userId, now);
    try {
        await ctx.editMessageText(`👋 *Bem-vindo ao nosso Bot, ${ctx.from?.first_name}!* 

✅ - Aqui você pode comprar *CC* com total praticidade e segurança.
💳 - Escolha seu *CC*, realize o pagamento via *Pix* ou com saldo de recargas e nossa equipe irá lhe instruir o uso do produto.

🛡️ Lembre-se de ler os /termos antes de prosseguir.

Se precisar de ajuda, utilize o menu ou chame o suporte. Boa compra! [ㅤㅤ](https://i.4cdn.org/b/1753404701592459.jpg)`, {
            parse_mode: "Markdown",
            reply_markup: mainKeyboard_1.mainKeyboard,
            link_preview_options: { show_above_text: false },
        });
        const user = await utils_1.prisma.user.findUnique({
            where: { telegramId: String(userId) },
        });
        if (!user) {
            await utils_1.prisma.user.create({
                data: {
                    telegramId: String(userId),
                    name: ctx.from?.first_name || "Desconhecido",
                    username: ctx.from?.username,
                    balance: 0.0,
                    userType: "regular",
                },
            });
            console.log("New user created:", ctx.from?.first_name);
        }
    }
    catch (e) {
        console.error("Error handling main callback query:", e);
        await ctx.editMessageText(`👋 *Bem-vindo ao nosso Bot, ${ctx.from?.first_name}!* 

✅ - Aqui você pode comprar *CC* com total praticidade e segurança.
💳 - Escolha seu *CC*, realize o pagamento via *Pix* ou com saldo de recargas e nossa equipe irá lhe instruir o uso do produto.

🛡️ Lembre-se de ler os /termos antes de prosseguir.

Se precisar de ajuda, utilize o menu ou chame o suporte. Boa compra! [ㅤㅤ](https://i.4cdn.org/b/1753404701592459.jpg)`, {
            parse_mode: "Markdown",
            reply_markup: mainKeyboard_1.mainKeyboard,
            link_preview_options: { show_above_text: false },
        });
    }
});
exports.default = composer;
