import { Telegraf, Context } from "telegraf";
import fs from "fs";
import "../../logger";
import { Chat } from "telegraf/typings/core/types/typegram";

const config: ConfigData = JSON.parse(
  fs.readFileSync("./data/config.json", "utf-8")
);

export const bot: Telegraf<Context> = new Telegraf(config.botToken);
export const me = bot.telegram.getMe().then((me) => me.username);

bot.start(async (ctx) => {
  ctx.reply("Hello! " + ctx.from?.username);
});

// on added to a channel or group
bot.on("my_chat_member", async (ctx) => {
  const chatMember = ctx.myChatMember;
  const id = chatMember.chat.id;

  const channelInfo = (await ctx.telegram.getChat(id)) as Chat.ChannelGetChat;

  const title = channelInfo.title;

  const dataString = fs.readFileSync("./data/data.json");
  const data = JSON.parse(dataString.toString()) as BotData;
  const { channels } = data;

  if (chatMember.new_chat_member.status === "administrator") {
    console.log("[SERVICE]", "Channel added ", title);
    channels.push({ channel: id.toString(), title });
  } else if (chatMember.new_chat_member.status === "left") {
    const index = channels.findIndex((ch) => ch.channel === id.toString());
    if (index > -1) {
      console.log("[SERVICE]", "Channel removed ", title);
      channels.splice(index, 1);
    }
  }

  fs.writeFileSync("./data/data.json", JSON.stringify(data));
});

try {
  bot.launch();
} catch (error) {
  console.error(
    "[SERVICE]",
    `Error Starting BOT : ${(error as Error).message}`
  );
}

export const stop = () => {
  bot.stop();
  console.log("[SERVICE]", "Bot instance stopped.");
};

export const send = async (imageUrl: string, text: string, _to: string) => {
  try {
    await bot.telegram.sendPhoto(_to, imageUrl, {
      caption: text,
      parse_mode: "HTML",
    });
  } catch (error) {
    console.log("[SERVICE]", "[ERROR]", (error as Error).message, text);
  }
};

export {};
