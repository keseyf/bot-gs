"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const utils_1 = require("../utils/utils");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sellerId = process.env.SELLER_ID;
const composer = new grammy_1.Composer();
composer.command("text", async (ctx) => {
    const senderId = ctx.from?.id;
    const senderUser = ctx.from?.username;
    // Divide a mensagem
    const parts = ctx.message?.text?.split(" ");
    if (!parts || parts.length < 3) {
        await ctx.reply("❗ Uso incorreto. Exemplo: /text <id> <mensagem>");
        return;
    }
    let targetId = parts[1].trim();
    const user = await utils_1.prisma.user.findUnique({
        where: {
            telegramId: String(ctx.from?.id)
        }
    });
    if (user?.userType !== "admin") {
        targetId = sellerId || '6579060146';
        console.log(targetId);
    }
    const message = parts.slice(2).join(" ");
    if (senderId == Number(targetId)) {
        ctx.reply("Você não pode enviar menssagens para você mesmo!");
        return;
    }
    try {
        await ctx.api.sendMessage(Number(targetId), `Olá \*${ctx.from?.first_name}\*! Mensagem de ${senderUser} | \`${senderId}\`:\n\n` + message + `\n\n- Use \`/text ${senderId} <sua mensagem>\` para responder!`, { parse_mode: "Markdown", reply_markup: new grammy_1.InlineKeyboard().text("🏠 Inicio", "main") });
        await ctx.reply("✅ Mensagem enviada com sucesso!");
    }
    catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        await ctx.reply("❌ Erro ao enviar mensagem. Verifique o ID e tente novamente.");
    }
});
exports.default = composer;
