---
id: session-checklist
date: 2026-06-28
tags: [harness, session]
related: [agent-harness]
status: active
---

# 세션 체크리스트 (5줄)

> 상세: `memory/rules/agent-harness.md` §1 · Cursor/Claude 공통 · **이 파일만 고치고 다른 곳에 복붙 금지**

1. **get_context** — yohan-mcp 1회 (`profile` · `active_project` · `recent_decisions`).
2. **역할** — Claude=primary(설계·handoff·release-gate) / Cursor=secondary(실험·반복).
3. **정본** — 규칙 변경은 `memory/` 또는 레포 `RULES.md`만. Tier S/A `AGENTS.md` 직접 수정 금지 → `vhk sync`.
4. **병렬** — same repo + same branch 2 agent 금지 → worktree.
5. **종료** — handoff md 또는 `/handoff` · Lab 세션이면 `/done`.
