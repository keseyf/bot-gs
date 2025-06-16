import { Bot } from "grammy";
import { PrismaClient } from "../../generated/prisma";
import MercadoPagoConfig from "mercadopago";

const MPTOKEN = process.env.MP_TOKEN;
if (!MPTOKEN) {
	throw new Error("MP_TOKEN is not defined in the environment variables.");
}

const client = new MercadoPagoConfig({
	accessToken: MPTOKEN,
	options: { timeout: 5000 },
});

import dotenv from "dotenv";
dotenv.config();

const BToken = process.env.BOT_TOKEN;
if (!BToken) {
    throw new Error("BOT_TOKEN is not defined in the environment variables.");
}

const prisma = new PrismaClient()
const app = new Bot(process.env.BOT_TOKEN!)
export {app, prisma, client}