"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const profileKeyboard_1 = require("../Keyboards/profileKeyboard");
const utils_1 = require("../utils/utils");
const composer = new grammy_1.Composer();
composer.callbackQuery("profile", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) {
        await ctx.reply("Usuário não encontrado.");
        return;
    }
    const user = await utils_1.prisma.user.findUnique({
        where: { telegramId: String(userId) },
    });
    const profileText = `
Perfil do usuário:
Nome: ${user?.name || "Desconhecido"}
Saldo: R$ ${user?.balance?.toFixed(2) || "0.00"}
Tipo de usuário: ${user?.userType || "Desconhecido"}
    `;
    try {
        await ctx.editMessageText(profileText, {
            reply_markup: profileKeyboard_1.profileKeyboard
        });
    }
    catch (e) {
        console.error("Error handling profile callback query:", e);
        await ctx.reply(profileText, {
            reply_markup: profileKeyboard_1.profileKeyboard,
        });
    }
});
exports.default = composer;
