"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils/utils");
// Commands
const start_1 = __importDefault(require("./commands/start"));
const help_1 = __importDefault(require("./controller/bot/help"));
const send_1 = __importDefault(require("./commands/send"));
const spam_1 = __importDefault(require("./commands/spam"));
const terms_1 = __importDefault(require("./commands/terms"));
const text_1 = __importDefault(require("./commands/text"));
// User controllers
const profile_1 = __importDefault(require("./controller/user/profile"));
// Buyer controllers
const recharge_1 = __importDefault(require("./controller/buyers/recharge/recharge"));
const rechargeType_1 = __importDefault(require("./controller/buyers/recharge/rechargeType"));
const rechargeValue_1 = __importDefault(require("./controller/buyers/recharge/rechargeValue"));
const confirmBalance_1 = __importDefault(require("./controller/buyers/confirm/confirmBalance"));
const confirmPix_1 = __importDefault(require("./controller/buyers/confirm/confirmPix"));
const buyPix_1 = __importDefault(require("./controller/buyers/buy/buyPix"));
const buyBalance_1 = __importDefault(require("./controller/buyers/buy/buyBalance"));
const selectPaymentMethod_1 = __importDefault(require("./controller/buyers/selectPaymentMethod"));
const sendT_1 = __importDefault(require("./controller/user/sendT"));
const ntg_1 = __importDefault(require("./controller/bot/ntg"));
const confirmCourse_1 = __importDefault(require("./controller/cardcallbacks/confirmCourse"));
// Card-related callbacks
const typeCard_1 = __importDefault(require("./controller/cardcallbacks/typeCard"));
const confirmCard_1 = __importDefault(require("./controller/cardcallbacks/confirmCard"));
// Main bot logic
const main_1 = __importDefault(require("./controller/bot/main"));
// Register command handlers
utils_1.app.use(start_1.default);
utils_1.app.use(help_1.default);
utils_1.app.use(send_1.default);
utils_1.app.use(spam_1.default);
utils_1.app.use(terms_1.default);
utils_1.app.use(sendT_1.default);
utils_1.app.use(text_1.default);
// Register user and card callbacks
utils_1.app.use(profile_1.default);
utils_1.app.use(typeCard_1.default);
utils_1.app.use(confirmCard_1.default);
utils_1.app.use(ntg_1.default);
utils_1.app.use(confirmCourse_1.default);
// Register buyer flow handlers
utils_1.app.use(recharge_1.default);
utils_1.app.use(rechargeType_1.default);
utils_1.app.use(rechargeValue_1.default);
utils_1.app.use(confirmBalance_1.default);
utils_1.app.use(confirmPix_1.default);
utils_1.app.use(buyPix_1.default);
utils_1.app.use(buyBalance_1.default);
utils_1.app.use(selectPaymentMethod_1.default);
// Main callbacks
utils_1.app.use(main_1.default);
// Start the bot
utils_1.app.start({
    onStart: () => {
        console.clear();
        console.log("[+] ByeBot v1 is running\n[+] o.O #FYE");
    }
});
