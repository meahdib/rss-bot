import { config } from "@/config";
import { Telegraf, Context } from "telegraf";

const bot: Telegraf<Context> = new Telegraf(config.telegram_bot_token);

bot.telegram
  .getMe()
  .then((me) => console.log("BOT initialized as ", me.username));

bot.start(async (ctx) => {
  ctx.reply("Hello! " + ctx.from?.username);
});

// on added to a channel or group
bot.on("my_chat_member", (ctx) => {
  const chatMember = ctx.myChatMember;
  if (chatMember.new_chat_member.status === "administrator") {
    ctx.reply(`Thanks for adding me to ${ctx.from.username}`);
  }
});

export default bot;
