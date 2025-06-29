"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const backMainKeyboard_1 = require("../../utils/Keyboards/bot/backMainKeyboard");
const composer = new grammy_1.Composer();
composer.callbackQuery("help", async (ctx) => {
    await ctx.editMessageText(`💳 *Como funciona a compra de cartões:*

1. O usuário seleciona o tipo de cc que deseja comprar.
2. O bot exibe o preço e as informações do cc.
3. O usuário confirma a compra e realiza o pagamento via Pix ou com saldo da conta.
4. Após a confirmação do pagamento, o ADMINISTRADOR será contatado e enviará o cartão para o usuário.

💰 *Como funciona a recarga de saldo:*

1. O usuário escolhe o valor da recarga.
2. O bot exibe as opções de pagamento.
3. O usuário confirma a recarga e realiza o pagamento.
4. Após a confirmação do pagamento, o saldo do usuário é atualizado.

Leia os /termos antes do uso do bot.
`, {
        reply_markup: backMainKeyboard_1.backMainKeyboard,
        parse_mode: "Markdown",
    });
});
exports.default = composer;
