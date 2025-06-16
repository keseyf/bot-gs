"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const utils_1 = require("../utils/utils");
const composer = new grammy_1.Composer();
composer.hears("seeeeeend", async (ctx) => {
    await utils_1.app.api.sendMessage("6579060146", "Hello, this is a test message!");
    ctx.reply("Message sent successfully!");
});
exports.default = composer;
