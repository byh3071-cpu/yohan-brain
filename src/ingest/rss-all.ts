/**
 * 전체 RSS 피드 순차 ingest — CLI(ingest-all-rss-cli)와 automation-batch가 공유.
 * 한 피드가 실패해도 나머지 계속.
 */
import {
  type RssFeedDefinition,
  RSS_FEED_AITIMES,
  RSS_FEED_KARPATHY,
  RSS_FEED_PAULGRAHAM,
  RSS_FEED_SAMALTMAN,
  RSS_FEED_TECHREVIEWKR,
  RSS_FEED_YOZM,
} from "./rss-feed-config.js";
import { ingestRssFeed, type IngestRssFeedResult } from "./rss-feed.js";

export const ALL_RSS_FEEDS: RssFeedDefinition[] = [
  RSS_FEED_YOZM,
  RSS_FEED_AITIMES,
  RSS_FEED_TECHREVIEWKR,
  RSS_FEED_PAULGRAHAM,
  RSS_FEED_SAMALTMAN,
  RSS_FEED_KARPATHY,
];

export type RssFeedRunSummary = {
  feed_key: string;
  ok: boolean;
  written: number;
  skipped: number;
  error?: string;
};

export async function ingestAllRssFeeds(
  limit = 20,
  onFeedResult?: (entry: RssFeedRunSummary, raw?: IngestRssFeedResult) => void,
): Promise<RssFeedRunSummary[]> {
  const summary: RssFeedRunSummary[] = [];

  for (const def of ALL_RSS_FEEDS) {
    try {
      const r = await ingestRssFeed(def, { limit });
      const entry: RssFeedRunSummary = {
        feed_key: def.feedKey,
        ok: true,
        written: r.written.length,
        skipped: r.skipped.length,
      };
      summary.push(entry);
      onFeedResult?.(entry, r);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const entry: RssFeedRunSummary = {
        feed_key: def.feedKey,
        ok: false,
        written: 0,
        skipped: 0,
        error: msg,
      };
      summary.push(entry);
      onFeedResult?.(entry);
    }
  }

  return summary;
}
