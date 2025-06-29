import { app } from "./utils/utils";

// Commands
import start from "./commands/start";
import help from "./controller/bot/help";
import send from "./commands/send";
import spam from "./commands/spam";
import terms from "./commands/terms";
import text from "./commands/text"

// User controllers
import profile from "./controller/user/profile";

// Buyer controllers
import recharge from "./controller/buyers/recharge/recharge";
import rechargetype from "./controller/buyers/recharge/rechargeType";
import rechargeValue from "./controller/buyers/recharge/rechargeValue";
import confirmBalance from "./controller/buyers/confirm/confirmBalance";
import confirmPix from "./controller/buyers/confirm/confirmPix";
import buyPix from "./controller/buyers/buy/buyPix";
import buyBalance from "./controller/buyers/buy/buyBalance";
import selectPaymentMethod from "./controller/buyers/selectPaymentMethod";
import sendT from "./controller/user/sendT"
import ntg from "./controller/bot/ntg"
import buyCourse from "./controller/cardcallbacks/confirmCourse"

// Card-related callbacks
import card from "./controller/cardcallbacks/typeCard";
import buycard from "./controller/cardcallbacks/confirmCard";

// Main bot logic
import main from "./controller/bot/main";

// Register command handlers
app.use(start);
app.use(help);
app.use(send);
app.use(spam);
app.use(terms);
app.use(sendT)
app.use(text)

// Register user and card callbacks
app.use(profile);
app.use(card);
app.use(buycard);
app.use(ntg)
app.use(buyCourse)

// Register buyer flow handlers
app.use(recharge);
app.use(rechargetype);
app.use(rechargeValue);
app.use(confirmBalance);
app.use(confirmPix);
app.use(buyPix);
app.use(buyBalance);
app.use(selectPaymentMethod);

// Main callbacks
app.use(main);


// Start the bot
app.start({
    onStart: () => {
        console.clear()
        console.log("[+] ByeBot v1 is running\n[+] o.O #FYE")
    }
});
