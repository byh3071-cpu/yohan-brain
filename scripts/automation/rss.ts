/**
 * automation-batch의 RSS ingest 24h staleness 가드.
 * 가드 파일은 "시도 시점"에 기록한다 — 부분 실패여도 갱신해
 * 깨진 피드를 배치 주기마다 두드리지 않는다 (피드별 에러는 needs-attention 알림으로).
 */
import { join } from "node:path"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { resolveRepoRoot } from "../../src/paths.js"
import type { RssFeedRunSummary } from "../../src/ingest/rss-all.js"

export const RSS_INGEST_INTERVAL_MS = 24 * 60 * 60 * 1000

function lastRssIngestPath(): string {
  return join(resolveRepoRoot(), "memory", "metrics", "automation", "last-rss-ingest.json")
}

export async function readLastRssIngestAt(): Promise<number | null> {
  const p = lastRssIngestPath()
  if (!existsSync(p)) return null
  try {
    const raw = await readFile(p, "utf8")
    const j = JSON.parse(raw) as { ranAt?: number }
    return typeof j.ranAt === "number" ? j.ranAt : null
  } catch {
    return null
  }
}

export async function isRssDue(): Promise<boolean> {
  const last = await readLastRssIngestAt()
  return last === null || Date.now() - last >= RSS_INGEST_INTERVAL_MS
}

export async function writeLastRssIngest(perFeed: RssFeedRunSummary[]): Promise<void> {
  const p = lastRssIngestPath()
  await mkdir(join(resolveRepoRoot(), "memory", "metrics", "automation"), { recursive: true })
  await writeFile(p, JSON.stringify({ ranAt: Date.now(), perFeed }, null, 2), "utf8")
}
