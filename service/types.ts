interface IChannel {
  channel: string;
  title: string;
}

interface BotData {
  lastFetch: string;
  feedUrl: string;
  channels: IChannel[];
}

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  categories: {
    $: {
      domain: string;
    };
    _: string;
  }[];
  ["media:content"]: {
    $: {
      url: string | null;
      type: string | null;
      width: string | null;
      height: string | null;
    };
  } | null;
  content: string;
  category: string;
  description: string;
}

interface Feed extends NewsItem {
  tags: string[];
  media: {
    url: string | null;
    type: string | null;
    width: string | null;
    height: string | null;
  };
}
interface FeedResult {
  feed: Partial<Feed>[];
  last: string;
}

interface rssData {
  category: string;
  rss: string;
  active: boolean;
}
