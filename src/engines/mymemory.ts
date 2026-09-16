/**
 * 极速模式：MyMemory 免费翻译 API。
 * 无需 Key、支持 CORS、可直接从浏览器调用；匿名限额约 5000 字符/天、单次 500 字符。
 * 文档：https://mymemory.translated.net/doc/spec.php
 */

// MyMemory 的区域码与 UI 语言码的映射
const LANG_MAP: Record<string, string> = {
  zh: 'zh-CN',
  en: 'en-GB',
  ja: 'ja-JP',
  ko: 'ko-KR',
  fr: 'fr-FR',
  de: 'de-DE',
  es: 'es-ES',
  ru: 'ru-RU',
}

/** 匿名单次请求上限（保守取 450，留出 URL 编码余量） */
export const MYMEMORY_MAX_LEN = 450

export async function translateMyMemory(
  text: string,
  from: string,
  to: string,
  signal?: AbortSignal,
): Promise<string> {
  if (text.length > MYMEMORY_MAX_LEN) {
    throw new Error(`极速模式单次最多 ${MYMEMORY_MAX_LEN} 字符，长文本请用 AI 模式`)
  }
  const langpair = `${LANG_MAP[from] ?? from}|${LANG_MAP[to] ?? to}`
  const url =
    'https://api.mymemory.translated.net/get?q=' +
    encodeURIComponent(text) +
    '&langpair=' +
    encodeURIComponent(langpair)

  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`MyMemory 请求失败（HTTP ${res.status}）`)

  const data = await res.json()
  const translated: unknown = data?.responseData?.translatedText
  if (typeof translated !== 'string' || translated.length === 0) {
    throw new Error('MyMemory 返回内容异常')
  }
  if (/MYMEMORY WARNING|QUERY LENGTH LIMIT|INVALID SOURCE/i.test(translated)) {
    throw new Error('MyMemory 免费额度已用尽或参数受限，请改用 AI 模式')
  }
  return translated
}
