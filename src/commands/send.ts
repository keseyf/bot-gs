import { Composer } from "grammy";
import { app } from "../utils/utils";

const composer = new Composer();
composer.hears("seeeeeend", async (ctx) => {
    await app.api.sendMessage("6579060146", "Hello, this is a test message!" )
    ctx.reply("Message sent successfully!");
})

export default composer;