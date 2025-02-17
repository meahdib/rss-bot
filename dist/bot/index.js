"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const telegraf_1 = require("telegraf");
const bot = new telegraf_1.Telegraf(config_1.config.telegram_bot_token);
bot.telegram
    .getMe()
    .then((me) => console.log("BOT initialized as ", me.username));
bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    ctx.reply("Hello! " + ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.username));
}));
// on added to a channel or group
bot.on("my_chat_member", (ctx) => {
    const chatMember = ctx.myChatMember;
    if (chatMember.new_chat_member.status === "administrator") {
        ctx.reply(`Thanks for adding me to ${ctx.from.username}`);
    }
});
exports.default = bot;
