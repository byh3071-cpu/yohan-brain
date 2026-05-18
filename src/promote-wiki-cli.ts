import { promoteToWiki, suggestPromotions } from "./wiki/promote.js";

type Args = {
  insightPath?: string;
  type?: "concept" | "entity";
  entityType?: "person" | "company" | "technology" | "tool" | "other";
  id?: string;
  suggest: boolean;
  limit?: number;
  includeDraft: boolean;
};

function parseArgs(argv: string[]): Args {
  const a: Args = { suggest: false, includeDraft: false };
  for (let i = 0; i < argv.length; i += 1) {
    const v = argv[i];
    if (v === "--suggest") a.suggest = true;
    else if (v === "--type") a.type = argv[++i] as Args["type"];
    else if (v === "--entity-type")
      a.entityType = argv[++i] as Args["entityType"];
    else if (v === "--id") a.id = argv[++i];
    else if (v === "--limit") a.limit = Number.parseInt(argv[++i] ?? "10", 10);
    else if (v === "--include-draft") a.includeDraft = true;
    else if (!v.startsWith("--") && !a.insightPath) a.insightPath = v;
  }
  return a;
}

function usage(): void {
  console.error(
    [
      "Usage:",
      "  npm run promote-wiki -- <insight path> [--type concept|entity] [--entity-type person|company|technology|tool|other] [--id slug]",
      "  npm run promote-wiki -- --suggest [--limit 10] [--include-draft]",
    ].join("\n"),
  );
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.suggest) {
    const r = await suggestPromotions({ limit: args.limit, includeDraft: args.includeDraft });
    console.log(JSON.stringify(r, null, 2));
    return;
  }

  if (!args.insightPath) {
    usage();
    process.exit(1);
  }

  const r = await promoteToWiki({
    insightPath: args.insightPath,
    type: args.type,
    entityType: args.entityType,
    id: args.id,
  });
  console.log(JSON.stringify(r, null, 2));
  if (!r.ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
