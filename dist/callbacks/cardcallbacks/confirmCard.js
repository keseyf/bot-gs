"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const card_1 = __importDefault(require("../../utils/card"));
const composer = new grammy_1.Composer();
composer.callbackQuery(/^select_card_(.+)$/, async (ctx) => {
    const cardType = ctx.match[1].replace(/_/g, " ");
    await ctx.editMessageText(`✅ \*Tudo certo\*,Você escolheu o cartão: 
💳 - \`${cardType}\`
💵 - \*R$ ${card_1.default[ctx.match[1]]}\*

Escolha uma opção abaixo:`, {
        reply_markup: new grammy_1.InlineKeyboard()
            .text("💵 Comprar", `buy_${cardType}`).row()
            .text("🔄 Escolher outro", "cards").row()
            .text("🏠 Menu", "main"),
        parse_mode: "Markdown",
    });
});
exports.default = composer;
