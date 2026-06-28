import { config } from "dotenv";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { loadNotionOcrEnv } from "./notion/notion-ocr-env.js";
import { JsonPayloadParseError, parsePayloadJson } from "./notion/parse-payload-json.js";
import { OcrPushInputSchema, pushOcrResourceAndSummary } from "./notion/push-ocr.js";
import { resolveRepoRoot } from "./paths.js";

config({ path: join(resolveRepoRoot(), ".env") });

async function main(): Promise<void> {
  const path = process.argv[2];
  if (!path) {
    console.error("Usage: npm run sync:notion:ocr -- <payload.json>");
    console.error("JSON keys: date_ymd, resource_title, ocr_raw_body, tags?, source_select?, resource_status?");
    console.error("Optional: summary_title, summary_body, summary_type?, summary_status?, resource_only?");
    process.exit(1);
  }
  const rawJson = await readFile(path, "utf8");
  let data: unknown;
  try {
    data = parsePayloadJson(rawJson, path);
  } catch (err) {
    if (err instanceof JsonPayloadParseError) {
      // malformed JSON: top-level catch의 generic 메시지 대신 사용자 친화 힌트 출력
      console.error(err.message);
      console.error("입력 파일이 올바른 JSON 형식인지 확인하세요.");
      process.exit(1);
    }
    throw err;
  }
  const parsed = OcrPushInputSchema.safeParse(data);
  if (!parsed.success) {
    console.error(JSON.stringify(parsed.error.format(), null, 2));
    process.exit(1);
  }
  const env = loadNotionOcrEnv();
  const r = await pushOcrResourceAndSummary(env, parsed.data);
  console.log(JSON.stringify(r, null, 2));
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
