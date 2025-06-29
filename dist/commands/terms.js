"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const backMainKeyboard_1 = require("../utils/Keyboards/bot/backMainKeyboard");
const composer = new grammy_1.Composer();
const sellerUsername = process.env.SELLER_USERNAME;
if (!sellerUsername) {
    console.error("SELLER_USERNAME is not defined");
}
composer.command("termos", async (ctx) => {
    await ctx.reply(`🔒 *Termos de Uso*

Ao utilizar este bot e efetuar uma compra, você declara estar de acordo com os seguintes termos:

1. ✅ O produto oferecido é um *cartão clonado*, entregue exclusivamente por meio do bot.
2. 🚫 *Não realizamos trocas ou devoluções*, exceto em casos comprovados de dados inválidos.
3. ⏱️ O prazo máximo para reportar qualquer problema é de *5 minutos após a entrega*.
4. 📸 É obrigatória a apresentação de *vídeo* comprovando o erro, desde a compra até a tentativa de uso.
5. ⚠️ Compras feitas fora das regras são de *responsabilidade total do comprador*.
6. 📩 Em caso de dúvidas, entre em contato com o suporte: @${sellerUsername}`, { parse_mode: "Markdown", reply_markup: backMainKeyboard_1.backMainKeyboard });
});
exports.default = composer;
