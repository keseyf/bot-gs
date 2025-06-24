import { Composer } from "grammy";
import { backMainKeyboard } from "../../utils/Keyboards/bot/backMainKeyboard";

const composer = new Composer()

composer.callbackQuery('ntg', async ctx=>{
    ctx.reply("😁 Agradecemos ter gostado do nosso serviço!", {reply_markup: backMainKeyboard})
})

export default composer;