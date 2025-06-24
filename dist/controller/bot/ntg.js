"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const backMainKeyboard_1 = require("../../utils/Keyboards/bot/backMainKeyboard");
const composer = new grammy_1.Composer();
composer.callbackQuery('ntg', async (ctx) => {
    ctx.reply("😁 Agradecemos ter gostado do nosso serviço!", { reply_markup: backMainKeyboard_1.backMainKeyboard });
});
exports.default = composer;
