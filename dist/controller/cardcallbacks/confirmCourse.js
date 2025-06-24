"use strict";
// Este é um curso exclusivo para aqueles que procuram dominar a arte do estelionato. Nossos instrutores experientes ensinarão técnicas avançadas para enganar e manipular o seu alvo, para que você possa alcançar seus objetivos financeiros.
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const composer = new grammy_1.Composer();
composer.callbackQuery("buyCourse", async (ctx) => {
    await ctx.editMessageText(`
📖 Estelionato: o curso exclusiva para quem quer dominar a arte do estelionato! 

No curso alguns conteúdos que você terá acesso serão:

📄 - Falsificação de documentos 
🍊 - Uso de laranjas para abrir contas bancárias e adquirir bens.
👐 - Como fazer depósitos em contas offshore e investir o dinheiro de forma discreta.  
💳 - Fraudar informações financeiras para aumentar os limites de cartões de crédito.
💻 - Explorar brechas nas instituições financeiras para acessar recursos e informações financeiras confidenciais.
🎰 - Criar esquemas Ponzi e sistemas de pirâmide para atrair investimentos ilícitos.
😍 - Aprovar saldo com cc. 

🤩 E muito mais!

Escolha uma opção abaixo:`, {
        reply_markup: new grammy_1.InlineKeyboard()
            .text("💵 Comprar", `select_payment_method_CURSO_SETE`).row()
            .text("🏠 Menu", "main"),
        parse_mode: "Markdown",
    });
});
exports.default = composer;
