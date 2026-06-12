import "dotenv/config";
import { loadNotionRecordsEnv } from "./notion/notion-records-env.js";
import {
  summarizeForStdout,
  syncRecordsToNotion,
} from "./notion/sync-records.js";

function readFlag(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  if (i < 0) return undefined;
  const next = process.argv[i + 1];
  if (!next || next.startsWith("--")) return "";
  return next;
}

async function main(): Promise<void> {
  const since = readFlag("--since") || "today";
  const json = process.argv.includes("--json");
  // --files a.md,b.md : git log 대신 명시 파일 목록 동기화 (미커밋 파일 검증용)
  const filesFlag = readFlag("--files");
  const files = filesFlag
    ? filesFlag
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

  let env;
  try {
    env = loadNotionRecordsEnv();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (json) {
      process.stdout.write(
        JSON.stringify({ ok: false, error: msg }, null, 2) + "\n",
      );
    } else {
      process.stderr.write(`[sync-records] ${msg}\n`);
    }
    process.exit(1);
  }

  try {
    const summary = await syncRecordsToNotion(env, { since, files });
    if (json) {
      process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
      return;
    }
    console.log(summarizeForStdout(summary));
    for (const r of summary.synced) {
      console.log(`  + ${r.kind.padEnd(15)} ${r.file}`);
    }
    for (const r of summary.errors) {
      console.log(`  ! ${r.kind.padEnd(15)} ${r.file}\n      ${r.error}`);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (json) {
      process.stdout.write(
        JSON.stringify({ ok: false, error: msg }, null, 2) + "\n",
      );
    } else {
      process.stderr.write(`[sync-records] ${msg}\n`);
    }
    process.exit(1);
  }
}

main();
