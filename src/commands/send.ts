import { Composer, InlineKeyboard } from "grammy";
import { prisma } from "../utils/utils";
import dotenv from "dotenv";
dotenv.config();

const sellerUsername = process.env.SELLER_USERNAME;
const composer = new Composer();

composer.command("send", async (ctx) => {
  const senderId = ctx.from?.id;
  const senderUser = ctx.from?.username || ctx.from?.first_name || "Usuário";

  if (!senderId) {
    await ctx.reply("Usuário não identificado.");
    return;
  }

  // Verifica permissão do usuário
  const sender = await prisma.user.findUnique({
    where: { telegramId: String(senderId) },
  });

  if (sender?.userType !== "admin") {
    await ctx.reply("❌ Você não tem permissão para usar este comando.");
    return;
  }

  // Verifica estrutura do comando
  const parts = ctx.message?.text?.split(" ");
  if (!parts || parts.length < 3) {
    await ctx.reply("❗ Uso incorreto. Exemplo: /send <id> <mensagem>");
    return;
  }

  const targetId = parts[1].trim();
  const message = parts.slice(2).join(" ");

  // Não pode enviar mensagem para si mesmo
  if (senderId === Number(targetId)) {
    await ctx.reply("Você não pode enviar mensagens para você mesmo!");
    return;
  }

  try {
    await ctx.api.sendMessage(
      Number(targetId),
      `Olá *${ctx.from?.first_name || "Usuário"}*! Aqui está seu pedido:\n\n${message}\n\n- Mensagem enviada por: @${senderUser}\n\nAvalie o serviço nas opções abaixo: (opcional)`,
      {
        parse_mode: "Markdown",
        reply_markup: new InlineKeyboard()
          .text("✅ Tudo certo!", "ntg")
          .row()
          .url("❌ Erro no pedido", `https://t.me/${sellerUsername}`)
          .row()
          .text("🏠 Início", "main"),
      }
    );
    await ctx.reply("✅ Mensagem enviada com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    await ctx.reply("❌ Erro ao enviar mensagem. Verifique o ID e tente novamente.");
  }
});

export default composer;
