import { send } from "@/service/bot";
import Parser from "rss-parser";
import "../../../logger";

import { DATA_PATH } from "@/dashboard";
import { v2 } from "@google-cloud/translate";
import fs from "fs";

const data: BotData = JSON.parse(fs.readFileSync("./data/data.json", "utf-8"));

let translate: v2.Translate | undefined;

if (data.enableTranslation) {
  translate = new v2.Translate({ key: data.googleApiKey });
}

const FEED_URL: string = (
  JSON.parse(fs.readFileSync(DATA_PATH, "utf-8")) as BotData
).feedUrl;

const parser = new Parser({
  customFields: {
    item: ["media:content"],
  },
});

const getRawFeed = async () => {
  try {
    const feed = await parser.parseURL(FEED_URL);

    return feed;
  } catch (error) {
    throw error;
  }
};

export const getFeed = async (): Promise<FeedResult> => {
  try {
    const feed = await getRawFeed();

    const result: Partial<Feed>[] = feed.items.map((item: any) => {
      const {
        title,
        link,
        pubDate,
        categories,
        ["media:content"]: media,
        content,
      } = item as NewsItem;

      let tags: string[] = [];

      if (categories) {
        tags = categories
          .map((category) => (typeof category === "object" ? category._ : null))
          .filter((tag) => tag !== null) as string[];
      }

      return {
        title,
        link,
        pubDate,
        tags,
        content,
        media: {
          url: media ? media.$.url : null,
          type: media ? media.$.type : null,
          width: media ? media.$.width : null,
          height: media ? media.$.height : null,
        },
      };
    });

    const lastPubDate = result.reduce((latest, item) => {
      if (!item.pubDate) return latest;

      const itemDate = new Date(item.pubDate).getTime();
      return itemDate > latest ? itemDate : latest;
    }, 0);

    const last = new Date(lastPubDate).toISOString();

    return { feed: result, last };
  } catch (error) {
    console.error("[SERVICE]", "[ERROR]", (error as Error).message);
    return { feed: [], last: new Date(0).toISOString() };
  }
};

export const sendFeed = async (
  channels: {
    channel: string;
    title: string;
  }[],
  feeds: Partial<Feed>[],
  botusername: string,
  enableTranslation: boolean = false,
  translationLanguage: string = ""
) => {
  for (const channel of channels) {
    for (const filteredFeed of feeds) {
      if (!filteredFeed.media?.url) return;
      if (!filteredFeed.title) return;
      if (!filteredFeed.content) return;

      let title = filteredFeed.title;
      let content = filteredFeed.content;

      if (enableTranslation && translate !== undefined) {
        const [translatedTitle, translatedContent] = await Promise.all([
          translate.translate(title, translationLanguage),
          translate.translate(content, translationLanguage),
        ]);
        title = translatedTitle[0];
        content = translatedContent[0];
      }

      let readyCaption: string = "";

      readyCaption += "✅ <b>" + title + "</b>\n\n";
      readyCaption += content + "\n\n";

      readyCaption += "\n\nBy Crypto News Robot @" + botusername;

      send(filteredFeed.media?.url, readyCaption, channel.channel);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Delay 5 seconds
    }
  }
};
