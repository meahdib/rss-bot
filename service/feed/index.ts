import { send } from "@/service/bot";
import Parser from "rss-parser";
import "../../logger";
import { FEED_URL } from "@/service";

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
          .map((category) =>
            typeof category === "object" && category.$.domain === "tag"
              ? category._
              : null
          )
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
    console.error((error as Error).message);
    return { feed: [], last: new Date(0).toISOString() };
  }
};

export const sendFeed = async (
  channels: {
    channel: string;
    title: string;
  }[],
  feeds: Partial<Feed>[],
  botusername: string
) => {
  for (const channel of channels) {
    for (const filteredFeed of feeds) {
      if (!filteredFeed.media?.url) return;
      if (!filteredFeed.title) return;
      if (!filteredFeed.content) return;

      let readyCaption: string = "";

      readyCaption += "✅ <b>" + filteredFeed.title + "</b>\n\n";
      readyCaption += filteredFeed.content + "\n\n";

      if (filteredFeed.tags) {
        filteredFeed.tags.forEach((tag) => {
          readyCaption += "#" + tag.trim().replace(" ", "_") + "\n";
        });
      }
      readyCaption += "\n\nBy Crypto News Robot @" + botusername;

      send(filteredFeed.media?.url, readyCaption, channel.channel);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Delay 2 seconds
    }
  }
};
