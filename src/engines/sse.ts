/**
 * 解析 SSE（text/event-stream）缓冲区：返回完整事件与剩余的不完整行。
 * 纯函数，方便单元测试。
 */
export function parseSSELines(buf: string): { events: string[]; rest: string } {
  const lines = buf.split('\n')
  const rest = lines.pop() ?? ''
  const events: string[] = []
  for (const line of lines) {
    const s = line.trim()
    if (s.startsWith('data:')) events.push(s.slice(5).trim())
  }
  return { events, rest }
}

/** 从一条 SSE data 里提取 OpenAI 兼容 delta 文本；无法解析时返回 null */
export function extractDelta(dataPayload: string): string | null {
  if (dataPayload === '[DONE]') return null
  try {
    const json = JSON.parse(dataPayload)
    const choice = json?.choices?.[0]
    const delta: unknown = choice?.delta?.content ?? choice?.text
    return typeof delta === 'string' && delta.length > 0 ? delta : null
  } catch {
    return null
  }
}
