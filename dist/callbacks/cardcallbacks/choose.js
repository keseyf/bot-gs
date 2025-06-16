"use strict";
// import { prisma } from "../../utils/utils";
// import { Composer, InlineKeyboard } from "grammy";
// const composer = new Composer();
// composer.callbackQuery("choose", async (ctx) => {
//     try {
//         const cardList = await prisma.cards.findMany();
//         const keyboard = new InlineKeyboard();
//         for (const card of cardList) {
//             keyboard.text(`${card.bank} - R$ ${card.balance.toFixed(2)}`, `card_${card.id}`).row();
//         }
//         keyboard.text("🔙 Voltar", "cards").row();
//         await ctx.editMessageText("Escolha um cartão:", {
//             reply_markup: keyboard
//         });
//     } catch (error) {
//         console.error("Error fetching card list:", error);
//         await ctx.reply("Desculpe, ocorreu um erro ao buscar os cartões disponíveis.");
//     }
// });
// export default composer;
