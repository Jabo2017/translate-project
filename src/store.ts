import { reactive, watch } from 'vue'
import type { HistoryItem, Settings } from './types'

const SETTINGS_KEY = 'tp_settings_v1'
const HISTORY_KEY = 'tp_history_v1'

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback
  } catch {
    return fallback
  }
}

export const settings = reactive<Settings>(
  loadJSON(SETTINGS_KEY, {
    novitaKey: '',
    novitaBaseUrl: 'https://api.novita.ai/openai',
    novitaModel: 'deepseek/deepseek-v3-turbo',
  }),
)

watch(
  settings,
  (s) => localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)),
  { deep: true },
)

function loadHistory(): HistoryItem[] {
  try {
    const raw = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

export const history = reactive<HistoryItem[]>(loadHistory())

watch(
  history,
  (h) => localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 50))),
  { deep: true },
)

export function addHistory(item: HistoryItem): void {
  history.unshift(item)
  if (history.length > 50) history.pop()
}

export function clearHistory(): void {
  history.splice(0, history.length)
}
