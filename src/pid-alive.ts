import { execFileSync } from "node:child_process"

/**
 * PID 생존 확인. Windows에서 `process.kill(pid, 0)`이 이미 종료된 PID에도
 * 성공하는 사례가 관찰됨(2026-06-12, 죽은 봇 PID를 alive로 오판) — tasklist로 교차 검증한다.
 */
export function isPidAlive(pid: number): boolean {
  if (!Number.isInteger(pid) || pid <= 0) return false
  try {
    process.kill(pid, 0)
  } catch {
    return false
  }
  if (process.platform === "win32") {
    try {
      const out = execFileSync("tasklist", ["/fi", `PID eq ${pid}`, "/fo", "csv", "/nh"], {
        encoding: "utf8",
      })
      return out.includes(`"${pid}"`)
    } catch {
      return false
    }
  }
  return true
}
