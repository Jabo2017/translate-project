/**
 * AI 模式：OpenAI 兼容 Chat Completions，默认指向 Novita AI。
 * base URL 约定：https://api.novita.ai/openai（实际请求 {base}/v1/chat/completions）
 * 流式输出：SSE，逐段回调 onDelta。
 * 文档：https://docs.novita.ai/guides/llm-api
 */
import { extractDelta, parseSSELines } from './sse'

export interface NovitaStreamOptions {
  apiKey: string
  baseUrl: string
  model: string
  system: string
  user: string
  signal?: AbortSignal
  onDelta: (chunk: string) => void
}

export async function novitaChatStream(o: NovitaStreamOptions): Promise<string> {
  const url = o.baseUrl.replace(/\/+$/, '') + '/v1/chat/completions'
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + o.apiKey,
    },
    body: JSON.stringify({
      model: o.model,
      messages: [
        { role: 'system', content: o.system },
        { role: 'user', content: o.user },
      ],
      stream: true,
      max_tokens: 2048,
      temperature: 0.3,
    }),
    signal: o.signal,
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    let hint = ''
    if (res.status === 401) hint = '（API Key 无效或已过期）'
    if (res.status === 429) hint = '（请求过于频繁或余额不足）'
    throw new Error(`AI 服务返回 ${res.status}${hint} ${body.slice(0, 160)}`)
  }
  if (!res.body) throw new Error('当前浏览器不支持流式响应')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buf = ''
  let full = ''

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    const { events, rest } = parseSSELines(buf)
    buf = rest
    for (const payload of events) {
      const delta = extractDelta(payload)
      if (delta) {
        full += delta
        o.onDelta(delta)
      }
    }
  }
  return full
}
