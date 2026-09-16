import { describe, expect, it } from 'vitest'
import { buildSystemPrompt, buildUserPrompt, labelOf } from '../src/engines/prompt'
import { extractDelta, parseSSELines } from '../src/engines/sse'

describe('prompt builder', () => {
  it('system prompt 包含方向、风格与输出约束', () => {
    const p = buildSystemPrompt('business', '中文', 'English')
    expect(p).toContain('中文→English')
    expect(p).toContain('商务')
    expect(p).toContain('只输出译文本身')
  })

  it('不同风格产出不同 prompt', () => {
    const a = buildSystemPrompt('formal', '中文', 'English')
    const b = buildSystemPrompt('literary', '中文', 'English')
    expect(a).not.toBe(b)
    expect(b).toContain('文学')
  })

  it('user prompt 包含原文与目标语言', () => {
    const p = buildUserPrompt('你好，世界', '中文', 'English')
    expect(p).toContain('English')
    expect(p).toContain('你好，世界')
  })

  it('labelOf 对未知 code 原样返回', () => {
    expect(labelOf('zh')).toBe('中文')
    expect(labelOf('xx')).toBe('xx')
  })
})

describe('SSE parsing', () => {
  it('拆分完整事件并保留不完整尾行', () => {
    // 注意：结尾不带 \n 的 "data: {"b":" 是不完整行，必须留在 rest 里
    const buf = 'data: {"a":1}\n\ndata: {"b":'
    const { events, rest } = parseSSELines(buf)
    expect(events).toEqual(['{"a":1}'])
    expect(rest).toBe('data: {"b":')
  })

  it('忽略空行与非 data 行', () => {
    const { events } = parseSSELines(': keep-alive\n\nevent: ping\ndata: x\n\n')
    expect(events).toEqual(['x'])
  })

  it('extractDelta 提取 OpenAI 兼容 delta', () => {
    expect(extractDelta('{"choices":[{"delta":{"content":"你"}}]}')).toBe('你')
    expect(extractDelta('{"choices":[{"text":"hi"}]}')).toBe('hi')
  })

  it('extractDelta 对 [DONE] 与空 delta 返回 null', () => {
    expect(extractDelta('[DONE]')).toBeNull()
    expect(extractDelta('{"choices":[{"delta":{}}]}')).toBeNull()
    expect(extractDelta('not json')).toBeNull()
  })
})
