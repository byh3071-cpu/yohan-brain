export type RssFeedDefinition = {
  /** memory/ingest/rss/{feedKey}/ */
  feedKey: string;
  feedUrl: string;
  /** frontmatter source_name */
  sourceName: string;
};

export const RSS_FEED_YOZM: RssFeedDefinition = {
  feedKey: "yozm",
  feedUrl: "https://yozm.wishket.com/magazine/feed/",
  sourceName: "yozm",
};

export const RSS_FEED_AITIMES: RssFeedDefinition = {
  feedKey: "aitimes",
  feedUrl: "https://www.aitimes.com/rss/allArticle.xml",
  sourceName: "aitimes",
};

/** 구 themilk 슬롯 대체(2026-06-12) — 더밀크는 공개 피드 전무(decisions/2026-06-12-themilk-feed-replacement) */
export const RSS_FEED_TECHREVIEWKR: RssFeedDefinition = {
  feedKey: "techreviewkr",
  feedUrl: "https://www.technologyreview.kr/feed/",
  sourceName: "techreviewkr",
};

/** paulgraham.com/rss.html 은 HTML 안내 페이지. 공식 페이지가 링크하는 Aaron Swartz 스크랩 RSS 사용. */
export const RSS_FEED_PAULGRAHAM: RssFeedDefinition = {
  feedKey: "paulgraham",
  feedUrl: "http://www.aaronsw.com/2002/feeds/pgessays.rss",
  sourceName: "paulgraham",
};

export const RSS_FEED_SAMALTMAN: RssFeedDefinition = {
  feedKey: "samaltman",
  feedUrl: "https://blog.samaltman.com/posts.atom",
  sourceName: "samaltman",
};

export const RSS_FEED_KARPATHY: RssFeedDefinition = {
  feedKey: "karpathy",
  feedUrl: "https://karpathy.github.io/feed.xml",
  sourceName: "karpathy",
};
