import type { Lang, StyleKey } from '../types'

export const LANGS: Lang[] = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'ru', label: 'Русский' },
]

export function labelOf(code: string): string {
  return LANGS.find((l) => l.code === code)?.label ?? code
}

export interface StylePreset {
  key: StyleKey
  label: string
  desc: string
}

export const STYLE_PRESETS: StylePreset[] = [
  { key: 'natural', label: '自然', desc: '通顺自然，忠实原意' },
  { key: 'formal', label: '正式', desc: '书面严谨，适合公文与学术' },
  { key: 'casual', label: '口语', desc: '轻松地道，像母语者聊天' },
  { key: 'business', label: '商务', desc: '专业得体，适合邮件与合同' },
  { key: 'literary', label: '文学', desc: '有文采，允许适度意译' },
]

export function styleLabel(key: StyleKey): string {
  return STYLE_PRESETS.find((s) => s.key === key)?.label ?? key
}

/**
 * 构造 AI 翻译的 system prompt。
 * 独立成纯函数以便单元测试：同样的输入必须得到稳定的 prompt。
 */
export function buildSystemPrompt(style: StyleKey, fromLabel: string, toLabel: string): string {
  const preset = STYLE_PRESETS.find((s) => s.key === style)
  const desc = preset ? `译文风格：${preset.label}（${preset.desc}）。` : ''
  return [
    `你是一名专业的${fromLabel}→${toLabel}译者。`,
    desc,
    `要求：`,
    `1. 只输出译文本身，不要任何解释、前缀或引号；`,
    `2. 保留原文的换行与段落结构；`,
    `3. 专有名词、代码、邮箱、URL 保持原样；`,
    `4. 若原文本身已是${toLabel}，则对原文做${preset?.label ?? '自然'}化润色后输出。`,
  ].join('\n')
}

export function buildUserPrompt(text: string, fromLabel: string, toLabel: string): string {
  return `请将下面的${fromLabel}内容翻译成${toLabel}：\n\n${text}`
}
