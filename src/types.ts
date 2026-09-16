export interface Lang {
  code: string
  label: string
}

/** 引擎标识：quick = 传统翻译 API（免 Key），ai = LLM 翻译（需 Key） */
export type EngineKey = 'quick' | 'ai'

export type StyleKey = 'natural' | 'formal' | 'casual' | 'business' | 'literary'

export interface Settings {
  /** Novita AI 的 API Key，仅存于浏览器 localStorage，不经过任何第三方服务器 */
  novitaKey: string
  /** OpenAI 兼容 base URL，默认 Novita，可换成任意兼容服务 */
  novitaBaseUrl: string
  /** 模型 ID，默认 deepseek-v3-turbo（翻译性价比高） */
  novitaModel: string
}

export interface HistoryItem {
  id: string
  source: string
  result: string
  engine: EngineKey
  from: string
  to: string
  style: StyleKey
  at: number
}
