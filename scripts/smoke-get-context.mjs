import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const serverPath = join(repoRoot, "dist", "index.js");

const child = spawn(process.execPath, [serverPath], {
  cwd: repoRoot,
  stdio: ["pipe", "pipe", "inherit"],
  env: { ...process.env },
});

let buf = "";
const responses = [];
child.stdout.on("data", (chunk) => {
  buf += chunk.toString("utf8");
  let idx;
  while ((idx = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, idx).trim();
    buf = buf.slice(idx + 1);
    if (!line) continue;
    try {
      responses.push(JSON.parse(line));
    } catch (e) {
      console.error("parse fail:", line.slice(0, 200));
    }
  }
});

function send(obj) {
  child.stdin.write(`${JSON.stringify(obj)}\n`);
}

async function waitFor(id, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const found = responses.find((r) => r.id === id);
    if (found) return found;
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error(`timeout waiting for id=${id}`);
}

try {
  send({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "smoke", version: "0" },
    },
  });
  await waitFor(1);

  send({ jsonrpc: "2.0", method: "notifications/initialized", params: {} });

  send({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: { name: "get_context", arguments: {} },
  });

  const res = await waitFor(2);
  if (res.error) {
    console.error("tool error:", JSON.stringify(res.error, null, 2));
    process.exitCode = 1;
  } else {
    const text = res.result?.content?.[0]?.text ?? "";
    const payload = JSON.parse(text);
    const summary = {
      keys: Object.keys(payload),
      recent_changes_7d: {
        window_days: payload.recent_changes_7d?.window_days,
        decisions_count: payload.recent_changes_7d?.decisions?.length,
        evaluations_count: payload.recent_changes_7d?.evaluations?.length,
        wiki_source: payload.recent_changes_7d?.wiki?.source,
        wiki_files_count: payload.recent_changes_7d?.wiki?.files?.length,
        warning: payload.recent_changes_7d?.warning,
      },
      inbox_status: payload.inbox_status,
      sample_decision: payload.recent_changes_7d?.decisions?.[0],
      sample_evaluation: payload.recent_changes_7d?.evaluations?.[0],
      sample_wiki_files: payload.recent_changes_7d?.wiki?.files?.slice(0, 3),
    };
    console.log(JSON.stringify(summary, null, 2));
  }
} catch (e) {
  console.error("smoke error:", e);
  process.exitCode = 1;
} finally {
  child.kill();
}
