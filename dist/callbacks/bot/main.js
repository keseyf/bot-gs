"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mainKeyboard_1 = require("../../Keyboards/bot/mainKeyboard");
const grammy_1 = require("grammy");
const utils_1 = require("../../utils/utils");
const composer = new grammy_1.Composer();
composer.callbackQuery("main", async (ctx) => {
    try {
        ctx.editMessageText(`Olá, *${ctx.from?.first_name}*! 👋\nComo podemos te ajudar?[ㅤ](https://i.4cdn.org/r/1749933222382233.jpg)`, { parse_mode: "Markdown", reply_markup: mainKeyboard_1.mainKeyboard, link_preview_options: { show_above_text: false } });
        const user = await utils_1.prisma.user.findUnique({
            where: { telegramId: String(ctx.from?.id) },
        });
        if (!user) {
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
    }
    catch (e) {
        console.error("Error handling main callback query:", e);
        await ctx.reply("OLÁ, EU SOU O BOT DO RECARREGADOR DE PIX!\n\n" +
            "Aqui você pode recarregar seu saldo de forma rápida e fácil.\n\n", { reply_markup: mainKeyboard_1.mainKeyboard });
    }
});
exports.default = composer;
