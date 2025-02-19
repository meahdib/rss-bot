import { me, stop } from "@/service/bot";
import fs from "fs";
import { getFeed, sendFeed } from "@/service/feed";
import "../logger";

let botusername: string | null = null;
let interval: NodeJS.Timeout;

const main = async () => {
  let fileData: BotData;

  if (botusername == null) {
    botusername = await me;
    console.log("[SERVICE]", "Bot started as ", botusername);
  }

  if (!fs.existsSync("./data")) {
    fs.mkdirSync("./data");
  }

  if (fs.existsSync("./data/data.json")) {
    console.log("[SERVICE]", "Running News fetch...");
    const data = fs.readFileSync("./data/data.json");

    fileData = JSON.parse(data.toString()) as BotData;

    const { lastFetch, channels } = fileData;

    if (channels.length == 0) {
      console.log(
        "[SERVICE]",
        "No Channels added, add @" + botusername + " to your channel"
      );
      console.log("SERVICE STARTED");

      return;
    }

    const { feed, last } = await getFeed();
    console.log("[SERVICE]", `${feed.length} fetched.`);

    if (!feed) {
      console.log("[SERVICE]", "Feed is undefined!");
      return;
    }

    const filteredFeeds = feed.filter((item) => {
      if (!item.pubDate) return false;
      const itemDate = new Date(item.pubDate).getTime();
      const lastFetchDate = new Date(lastFetch).getTime();
      return itemDate > lastFetchDate;
    });
    console.log("[SERVICE]", `${filteredFeeds.length} item will be send.`);

    fileData.lastFetch = last;
    fs.writeFileSync("./data/data.json", JSON.stringify(fileData));
    console.log("[SERVICE]", "Update last fetched time.");
    console.log("SERVICE STARTED");

    if (filteredFeeds.length == 0) return;

    const reversedFeeds = filteredFeeds.reverse();
    await sendFeed(channels, reversedFeeds, botusername);
  } else {
    console.log("[SERVICE]", "[ERROR]", "Missin data file");
    throw new Error("Missing DATA file");
  }
};

process.on("SIGTERM", async () => {
  console.log("[SERVICE]", "Gracefully shutting down...");
  clearInterval(interval);
  // Add this line to stop your bot (adjust based on how your bot is exported)
  stop();
  process.exit(0);
});

main();

//run every 1 hour!
interval = setInterval(main, 60 * 60 * 1000);
