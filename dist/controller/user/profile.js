"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const profileKeyboard_1 = require("../../utils/Keyboards/bot/profileKeyboard");
const utils_1 = require("../../utils/utils");
const composer = new grammy_1.Composer();
const cooldownSet = new Set();
composer.callbackQuery("profile", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) {
        await ctx.reply("Usuário não encontrado.");
        return;
    }
    if (cooldownSet.has(userId)) {
        await ctx.answerCallbackQuery({
            text: "Aguarde um momento antes de clicar novamente.",
            show_alert: false,
        });
        return;
    }
    cooldownSet.add(userId);
    setTimeout(() => cooldownSet.delete(userId), 3000);
    try {
        const user = await utils_1.prisma.user.findUnique({
            where: { telegramId: String(userId) },
        });
        const profileText = `
Este é o seu perfil, \`${ctx.from?.first_name || "usuário"}\`! 

👤 *Nome:* ${user?.name || "Desconhecido"}
🆔 *Id:* \`${user?.telegramId || "Desconhecido"}\`
💵 *Saldo:* R$ ${user?.balance?.toFixed(2) || "0.00"}
🎈 *Tipo de usuário:* ${user?.userType || "Desconhecido"}
`;
        await ctx.editMessageText(profileText, {
            reply_markup: profileKeyboard_1.profileKeyboard,
            parse_mode: "Markdown",
        });
    }
    catch (e) {
        console.error("Error handling profile callback query:", e);
        await ctx.reply("Erro ao carregar seu perfil. Tente novamente mais tarde.", { reply_markup: profileKeyboard_1.profileKeyboard });
    }
});
exports.default = composer;
