/**
 * Wiki 구조 lint CLI.
 *   npm run wiki:lint            — 검사만 (errors → exit 1)
 *   npm run wiki:lint -- --fix   — TTL expired 마킹 + index 통계 재생성
 *   npm run wiki:lint -- --json  — JSON 출력 (에이전트/자동화용)
 */
import { lintWiki } from "./wiki/lint.js";

const argv = process.argv.slice(2);
const fix = argv.includes("--fix");
const json = argv.includes("--json");

async function main(): Promise<void> {
  const report = await lintWiki({ fix });

  if (json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    for (const f of report.findings) {
      const mark = f.severity === "error" ? "✖" : f.severity === "warning" ? "⚠" : "·";
      console.log(`${mark} [${f.rule}] ${f.file} — ${f.message}`);
    }
    const s = report.stats;
    console.log(
      `\n엔티티 ${s.entities}/80 · 컨셉 ${s.concepts}/50 · 답변 ${s.answers} · 고아 ${s.orphans} · Inferred 만료 ${s.inferredExpired}/유효 ${s.inferredValid}`,
    );
    console.log(`errors=${report.errorCount} warnings=${report.warningCount}`);
    if (report.fixedFiles.length > 0) {
      console.log(`fixed: ${report.fixedFiles.join(", ")}`);
    }
  }

  process.exit(report.errorCount > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
