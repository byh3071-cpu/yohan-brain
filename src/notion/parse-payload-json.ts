/**
 * malformed JSON 입력을 사용자 친화 에러로 변환하기 위한 순수 헬퍼.
 * CLI top-level catch가 generic 메시지만 내는 문제를 막고,
 * 파일 경로 + 'JSON 파싱 실패' 힌트를 담은 명확한 에러를 던진다.
 */

/** JSON 파싱 실패 시 던지는, 파일 경로를 보존하는 에러. */
export class JsonPayloadParseError extends Error {
  readonly filePath: string;

  constructor(filePath: string, cause: unknown) {
    const reason = cause instanceof Error ? cause.message : String(cause);
    super(`JSON 파싱 실패: ${filePath}\n  └ ${reason}`);
    this.name = "JsonPayloadParseError";
    this.filePath = filePath;
    // 원인 보존 (디버깅용)
    this.cause = cause;
  }
}

/**
 * 파일에서 읽은 raw JSON 문자열을 파싱한다.
 * malformed JSON이면 파일 경로와 원인을 담은 JsonPayloadParseError를 던진다.
 *
 * @param rawJson 파일에서 읽은 원본 문자열
 * @param filePath 사용자에게 보여줄 입력 파일 경로
 */
export function parsePayloadJson(rawJson: string, filePath: string): unknown {
  try {
    return JSON.parse(rawJson) as unknown;
  } catch (err) {
    throw new JsonPayloadParseError(filePath, err);
  }
}
