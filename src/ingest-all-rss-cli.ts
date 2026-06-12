/**
 * 6개 RSS 피드를 순차 실행. 한 피드가 실패해도 나머지 계속, 종료 코드 0.
 * 피드 루프 본체는 src/ingest/rss-all.ts (automation-batch와 공유).
 */
import { ingestAllRssFeeds } from "./ingest/rss-all.js";

const arg = process.argv[2];
const limit = arg !== undefined ? Number.parseInt(arg, 10) : 20;

if (arg !== undefined && (Number.isNaN(limit) || limit < 1)) {
  console.error("Usage: npx tsx src/ingest-all-rss-cli.ts [limit]");
  process.exit(1);
}

async function main(): Promise<void> {
  const summary = await ingestAllRssFeeds(limit, (entry, raw) => {
    if (entry.ok && raw) {
      console.log(JSON.stringify({ feed_key: entry.feed_key, ok: true, result: raw }, null, 2));
    } else {
      console.error(JSON.stringify({ feed_key: entry.feed_key, ok: false, error: entry.error }, null, 2));
    }
  });

  console.log(JSON.stringify({ ingest_all_summary: summary }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
