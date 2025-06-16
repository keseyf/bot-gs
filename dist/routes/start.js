"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const composer = new grammy_1.Composer();
composer.command("start", (ctx) => {
    ctx.reply("Welcome to the bot! Use /help to see available commands.");
});
exports.default = composer;
