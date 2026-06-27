#!/usr/bin/env node

/**
 * soul-render.mjs — CP1 반자동 soul render CLI
 *
 * 흐름:
 *  ① Notion API로 SOUL 설계실 페이지 읽기
 *  ② LLM(OpenAI)으로 노션 블록 → YAML 구조 변환 (few-shot 스키마 프롬프트)
 *  ③ yaml 파싱 + 필수 키 검증 (심정지 폴백 ① 감지)
 *  ④ 현재 soul.yaml vs 새 YAML diff 출력
 *  ⑤ 터미널 y/n 승인 게이트
 *  ⑥ 승인 시 memory/soul.yaml 덮어쓰기 + soul.yaml.bak 백업
 *  ⑦ inject-soul.mjs --write 실행 (주입 팬아웃)
 *  ⑧ git commit
 *
 * 사용:
 *  npm run soul:render          # 기본 (dry-run — diff만 보여주고 대기)
 *  npm run soul:render -- --write  # 승인 후 저장·주입·커밋까지
 *
 * 환경변수:
 *  NOTION_API_TOKEN  — Notion API 토큰 (필수)
 *  OPENAI_API_KEY     — OpenAI API 키 (필수)
 *
 * 안전장치:
 *  - dry-run 기본 (승인 없이 파일 안 건드림)
 *  - 백업 자동 (soul.yaml.bak)
 *  - 검증 실패 시 즉시 중단
 *  - 스키마 프롬프트로 LLM 출력 안정화 (멱등 확보)
 */

import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'fs';
import { execSync } from 'child_process';
import { createInterface } from 'readline';

// ─── 설정 ───────────────────────────────────────────────────────────────────

const SOUL_PAGE_ID = '20b33238-cce6-461f-9457-d3c0ae70667b';
const SOUL_YAML_PATH = 'memory/soul.yaml';
const SOUL_BAK_PATH = 'memory/soul.yaml.bak';
const SCHEMA_PATH = 'scripts/soul-schema.json';

// ─── 환경변수 확인 ────────────────────────────────────────────────────────────

function checkEnv() {
  const missing = [];
  if (!process.env.NOTION_API_TOKEN) missing.push('NOTION_API_TOKEN');
  if (!process.env.OPENAI_API_KEY) missing.push('OPENAI_API_KEY');
  if (missing.length > 0) {
    console.error(`❌ 환경변수 누락: ${missing.join(', ')}`);
    console.error('   .env 파일을 확인하거나 환경에 설정하세요.');
    process.exit(1);
  }
}

// ─── ① Notion API로 페이지 읽기 ──────────────────────────────────────────────────

async function fetchNotionPage(pageId) {
  console.log('📖 Notion 설계실 페이지 읽는 중...');

  // 페이지 블록 가져오기 (자식 블록 포함 재귀)
  const blocks = [];
  let cursor = undefined;

  do {
    const url = `https://api.notion.com/v1/blocks/${pageId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ''}`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_API_TOKEN}`,
        'Notion-Version': '2022-06-28',
      },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Notion API 에러 (${res.status}): ${body}`);
    }
    const data = await res.json();
    blocks.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  // 각 블록의 자식 블록도 재귀적으로 가져오기
  const blockMap = {};
  for (const block of blocks) {
    blockMap[block.id] = block;
    if (block.has_children) {
      const children = await fetchChildren(block.id);
      blockMap[block.id]._children = children;
    }
  }

  // 페이지 속성도 가져오기
  const pageRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_API_TOKEN}`,
      'Notion-Version': '2022-06-28',
    },
  });
  const pageData = await pageRes.json();

  return { page: pageData, blocks };
}

async function fetchChildren(blockId) {
  const children = [];
  let cursor = undefined;
  do {
    const url = `https://api.notion.com/v1/blocks/${blockId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ''}`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_API_TOKEN}`,
        'Notion-Version': '2022-06-28',
      },
    });
    if (!res.ok) throw new Error(`Notion children API 에러: ${res.status}`);
    const data = await res.json();
    children.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return children;
}

// ─── ② LLM 변환 (OpenAI) ──────────────────────────────────────────────────────────

async function convertWithLLM(notionData, currentSoulYaml) {
  console.log('🤖 LLM으로 YAML 변환 중...');

  // 노션 블록을 간소화된 JSON으로 직렬화 (토큰 절약)
  const blockSummary = JSON.stringify(notionData.blocks, null, 2).slice(0, 30000);

  const prompt = `You are a YAML conversion engine. Convert the Notion page blocks into a soul.yaml YAML structure.

IMPORTANT RULES:
1. Follow the EXACT schema shown in the few-shot example below.
2. Do NOT invent new keys. Only use keys that exist in the example.
3. Preserve Korean text as-is.
4. Output ONLY valid YAML — no markdown fences, no explanations.
5. Start with the header comments exactly as shown.
6. Update the # rendered date to today's date.

FEW-SHOT EXAMPLE (current soul.yaml — use this exact structure):

${currentSoulYaml}

NOTION BLOCKS TO CONVERT (JSON):

${blockSummary}

Convert the above Notion blocks into soul.yaml following the EXACT structure of the few-shot example. Output ONLY the YAML file content starting with the # comment header.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0, // 결정적 출력 (멱등 안정화)
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI API 에러 (${res.status}): ${body}`);
  }

  const data = await res.json();
  let yaml = data.choices[0]?.message?.content || '';

  // 코드 펜스 제거 (LLM이 실수로 감쌀 경우)
  yaml = yaml.replace(/^```ya?ml\n?/gm, '').replace(/```$/gm, '').trim();

  return yaml;
}

// ─── ③ YAML 파싱 + 필수 키 검증 ───────────────────────────────────────────────────

async function validateYaml(yamlString, schemaPath) {
  console.log('🔍 YAML 검증 중...');

  const YAML = await import('yaml');
  const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));

  // YAML 파싱
  let parsed;
  try {
    parsed = YAML.parse(yamlString);
  } catch (err) {
    throw new Error(`YAML 파싱 실패: ${err.message}`);
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('YAML이 객체가 아님 — 빈 결과 또는 잘못된 형식');
  }

  // 필수 키 체크 (스키마 기반)
  const errors = [];
  for (const key of schema.required) {
    if (!(key in parsed)) {
      errors.push(`필수 키 누락: ${key}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`스키마 검증 실패:\n  ${errors.join('\n  ')}`);
  }

  console.log('✅ 검증 통과 — 모든 필수 키 존재');
  return parsed;
}

// ─── ④ diff 출력 ─────────────────────────────────────────────────────────────────

function showDiff(oldYaml, newYaml) {
  const { execSync } = require('child_process');
  const { writeFileSync, unlinkSync } = require('fs');

  const oldFile = '.soul-diff-old.yaml';
  const newFile = '.soul-diff-new.yaml';

  writeFileSync(oldFile, oldYaml);
  writeFileSync(newFile, newYaml);

  try {
    const diff = execSync(`git diff --no-index --no-color ${oldFile} ${newFile}`, { encoding: 'utf-8' });
    console.log('\n📋 diff (현재 → 새로):');
    console.log(diff);
  } catch (err) {
    // git diff --no-index는 차이가 있으면 exit code 1 반환
    if (err.stdout) {
      console.log('\n📋 diff (현재 → 새로):');
      console.log(err.stdout);
    } else {
      console.log('⚠️ diff 생성 실패. 새 YAML을 직접 확인하세요.');
    }
  } finally {
    try { unlinkSync(oldFile); } catch {}
    try { unlinkSync(newFile); } catch {}
  }
}

// ─── ⑤ 승인 게이트 ────────────────────────────────────────────────────────────────

async function askApproval() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question('\n🚦 이 diff로 soul.yaml을 갱신할까? (y/N): ', (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'y');
    });
  });
}

// ─── ⑥ 저장 + 백업 ──────────────────────────────────────────────────────────────

function saveYaml(newYaml) {
  // 백업
  if (existsSync(SOUL_YAML_PATH)) {
    copyFileSync(SOUL_YAML_PATH, SOUL_BAK_PATH);
    console.log(`💾 백업 생성: ${SOUL_BAK_PATH}`);
  }

  // 덮어쓰기
  writeFileSync(SOUL_YAML_PATH, newYaml, 'utf-8');
  console.log(`✅ 저장 완료: ${SOUL_YAML_PATH}`);
}

// ─── ⑦ inject-soul.mjs 실행 ─────────────────────────────────────────────────────────

function runInject() {
  console.log('💉 inject-soul.mjs 실행 중...');
  try {
    execSync('node scripts/inject-soul.mjs --write', { stdio: 'inherit' });
    console.log('✅ 주입 완료');
  } catch (err) {
    console.error('⚠️ 주입 실패 (수동으로 `npm run inject:soul:write` 실행 필요)');
  }
}

// ─── ⑧ git commit ────────────────────────────────────────────────────────────────

function gitCommit() {
  console.log('📝 git commit 중...');
  try {
    execSync('git add memory/soul.yaml memory/soul.yaml.bak', { stdio: 'inherit' });
    // .agents/도 변경되었을 수 있음
    try {
      execSync('git add .agents/', { stdio: 'inherit' });
    } catch {}
    execSync('git commit -m "chore: soul render — 노션 설계실에서 최신 갱신"', { stdio: 'inherit' });
    console.log('✅ 커밋 완료');
  } catch (err) {
    console.error('⚠️ 커밋 실패 (수동으로 커밋 필요)');
  }
}

// ─── 메인 ─────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('════════════════════════════════════════════');
  console.log('  🫀 soul render — CP1 반자동 렌더');
  console.log('════════════════════════════════════════════\n');

  const isWrite = process.argv.includes('--write');

  checkEnv();

  // ① Notion 읽기
  const notionData = await fetchNotionPage(SOUL_PAGE_ID);
  console.log(`   → ${notionData.blocks.length}개 블록 읽음\n`);

  // 현재 soul.yaml 읽기 (few-shot 예시용)
  let currentSoulYaml = '';
  if (existsSync(SOUL_YAML_PATH)) {
    currentSoulYaml = readFileSync(SOUL_YAML_PATH, 'utf-8');
    console.log('   → 현재 soul.yaml을 few-shot 예시로 사용\n');
  } else {
    console.error('❌ memory/soul.yaml이 없습니다. 최소 1회 수동 렌더가 필요합니다.');
    process.exit(1);
  }

  // ② LLM 변환
  const newYaml = await convertWithLLM(notionData, currentSoulYaml);

  // ③ 검증
  await validateYaml(newYaml, SCHEMA_PATH);

  // ④ diff
  showDiff(currentSoulYaml, newYaml);

  // ⑤ 승인 + ⑥⑦⑧ 실행
  if (!isWrite) {
    console.log('\n🔍 dry-run 모드 — 파일 변경 없음.');
    console.log('   실제 적용: npm run soul:render -- --write\n');
    return;
  }

  const approved = await askApproval();
  if (!approved) {
    console.log('❌ 취소됨 — soul.yaml 변경 없음.');
    return;
  }

  saveYaml(newYaml);
  runInject();
  gitCommit();

  console.log('\n🎉 soul render 완료!');
}

main().catch((err) => {
  console.error(`\n❌ 오류: ${err.message}`);
  process.exit(1);
});
