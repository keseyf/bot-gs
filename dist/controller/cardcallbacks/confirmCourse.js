"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const composer = new grammy_1.Composer();
// Mapa para armazenar timestamps dos usuários (ID do usuário => timestamp da última execução)
const cooldowns = new Map();
// Cooldown em milissegundos (10 segundos)
const COOLDOWN_TIME = 10 * 1000;
composer.callbackQuery("buyCourse", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId)
        return; // Segurança: se não tiver userId, ignore
    const now = Date.now();
    const last = cooldowns.get(userId) || 0;
    if (now - last < COOLDOWN_TIME) {
        const remaining = Math.ceil((COOLDOWN_TIME - (now - last)) / 1000);
        await ctx.answerCallbackQuery({
            text: `⏳ Aguarde ${remaining} segundos antes de tentar novamente.`,
            show_alert: true,
        });
        return;
    }
    cooldowns.set(userId, now);
    try {
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
                .text("🏠 Menu", "main").row(),
            parse_mode: "Markdown",
        });
    }
    catch (e) {
        console.log(e);
        ctx.reply("Erro inesperado.");
    }
});
exports.default = composer;
