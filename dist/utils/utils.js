"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.prisma = exports.app = void 0;
const grammy_1 = require("grammy");
const prisma_1 = require("../../generated/prisma");
const mercadopago_1 = __importDefault(require("mercadopago"));
const MPTOKEN = process.env.MP_TOKEN;
if (!MPTOKEN) {
    throw new Error("MP_TOKEN is not defined in the environment variables.");
}
const client = new mercadopago_1.default({
    accessToken: MPTOKEN,
    options: { timeout: 5000 },
});
exports.client = client;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const BToken = process.env.BOT_TOKEN;
if (!BToken) {
    throw new Error("BOT_TOKEN is not defined in the environment variables.");
}
const prisma = new prisma_1.PrismaClient();
exports.prisma = prisma;
const app = new grammy_1.Bot(process.env.BOT_TOKEN);
exports.app = app;
