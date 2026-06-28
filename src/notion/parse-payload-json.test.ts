import assert from "node:assert/strict";
import { test } from "node:test";
import { JsonPayloadParseError, parsePayloadJson } from "./parse-payload-json.js";

test("정상 JSON은 파싱된 객체를 반환한다", () => {
  const data = parsePayloadJson('{"a":1,"b":"x"}', "C:/tmp/payload.json");
  assert.deepEqual(data, { a: 1, b: "x" });
});

test("malformed JSON이면 JsonPayloadParseError를 던진다", () => {
  assert.throws(
    () => parsePayloadJson("{ not valid json ", "C:/tmp/bad.json"),
    JsonPayloadParseError,
  );
});

test("에러 메시지에 파일 경로와 'JSON 파싱 실패' 힌트가 포함된다", () => {
  try {
    parsePayloadJson("{ broken", "C:/tmp/bad.json");
    assert.fail("에러가 발생해야 한다");
  } catch (err) {
    assert.ok(err instanceof JsonPayloadParseError);
    assert.equal(err.filePath, "C:/tmp/bad.json");
    assert.match(err.message, /JSON 파싱 실패/);
    assert.match(err.message, /C:\/tmp\/bad\.json/);
  }
});
