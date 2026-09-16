<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { LANGS, STYLE_PRESETS, labelOf } from '../engines/prompt'
import { MYMEMORY_MAX_LEN, translateMyMemory } from '../engines/mymemory'
import { novitaChatStream } from '../engines/novita'
import { buildSystemPrompt, buildUserPrompt } from '../engines/prompt'
import { addHistory, settings } from '../store'
import type { EngineKey, HistoryItem, StyleKey } from '../types'

const QUICK_HINT = '极速模式由 MyMemory 免费接口提供，免 Key、即开即用，单次限 450 字符'
const AI_HINT = 'AI 模式走 LLM（默认 Novita AI），流式输出、语气可调，需在设置里填 API Key'

const ui = reactive({
  input: '',
  output: '',
  loading: false,
  error: '',
  engine: 'quick' as EngineKey,
  from: 'zh',
  to: 'en',
  style: 'natural' as StyleKey,
})

const copied = ref(false)
let controller: AbortController | null = null

const charCount = computed(() => ui.input.length)
const quickOverflow = computed(
  () => ui.engine === 'quick' && charCount.value > MYMEMORY_MAX_LEN,
)
const streaming = computed(() => ui.loading && ui.engine === 'ai' && ui.output.length > 0)

function swap(): void {
  if (ui.loading) return
  ;[ui.from, ui.to] = [ui.to, ui.from]
  ;[ui.input, ui.output] = [ui.output, ui.input]
  ui.error = ''
}

async function run(): Promise<void> {
  const text = ui.input.trim()
  if (!text || ui.loading) return
  if (ui.engine === 'quick' && text.length > MYMEMORY_MAX_LEN) {
    ui.error = `极速模式单次最多 ${MYMEMORY_MAX_LEN} 字符，请改用 AI 模式`
    return
  }

  controller?.abort()
  controller = new AbortController()
  ui.loading = true
  ui.error = ''
  ui.output = ''
  const startedAt = Date.now()

  try {
    let result: string
    if (ui.engine === 'quick') {
      result = await translateMyMemory(text, ui.from, ui.to, controller.signal)
      ui.output = result
    } else {
      if (!settings.novitaKey) {
        throw new Error('AI 模式需要 API Key：请点击右上角「设置」填入 Novita AI Key')
      }
      const fromLabel = labelOf(ui.from)
      const toLabel = labelOf(ui.to)
      result = await novitaChatStream({
        apiKey: settings.novitaKey,
        baseUrl: settings.novitaBaseUrl,
        model: settings.novitaModel,
        system: buildSystemPrompt(ui.style, fromLabel, toLabel),
        user: buildUserPrompt(text, fromLabel, toLabel),
        signal: controller.signal,
        onDelta: (d) => {
          ui.output += d
        },
      })
      ui.output = result
    }

    const item: HistoryItem = {
      id: `${startedAt}-${Math.random().toString(36).slice(2, 8)}`,
      source: text,
      result,
      engine: ui.engine,
      from: ui.from,
      to: ui.to,
      style: ui.style,
      at: startedAt,
    }
    addHistory(item)
  } catch (e) {
    const err = e as Error
    if (err?.name === 'AbortError') return
    ui.error = err?.message ?? String(e)
  } finally {
    ui.loading = false
  }
}

function stop(): void {
  controller?.abort()
}

async function copyOutput(): Promise<void> {
  if (!ui.output) return
  try {
    await navigator.clipboard.writeText(ui.output)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    /* 忽略剪贴板失败 */
  }
}
</script>

<template>
  <section class="card">
    <!-- 引擎切换 -->
    <div class="engine-row">
      <div class="tabs" role="tablist">
        <button
          class="tab"
          :class="{ active: ui.engine === 'quick' }"
          role="tab"
          :aria-selected="ui.engine === 'quick'"
          @click="ui.engine = 'quick'"
        >
          ⚡ 极速模式
        </button>
        <button
          class="tab"
          :class="{ active: ui.engine === 'ai' }"
          role="tab"
          :aria-selected="ui.engine === 'ai'"
          @click="ui.engine = 'ai'"
        >
          ✨ AI 模式
        </button>
      </div>
      <span class="hint">{{ ui.engine === 'quick' ? QUICK_HINT : AI_HINT }}</span>
    </div>

    <!-- 语气（仅 AI 模式） -->
    <div v-if="ui.engine === 'ai'" class="styles">
      <button
        v-for="s in STYLE_PRESETS"
        :key="s.key"
        class="chip"
        :class="{ active: ui.style === s.key }"
        :title="s.desc"
        @click="ui.style = s.key"
      >
        {{ s.label }}
      </button>
      <span class="style-desc">{{ STYLE_PRESETS.find((x) => x.key === ui.style)?.desc }}</span>
    </div>

    <!-- 双栏 -->
    <div class="panes">
      <div class="pane">
        <div class="pane-head">
          <select v-model="ui.from" class="lang" :disabled="ui.loading">
            <option v-for="l in LANGS" :key="l.code" :value="l.code">{{ l.label }}</option>
          </select>
          <span class="count" :class="{ over: quickOverflow }">
            {{ charCount }}<template v-if="ui.engine === 'quick'"> / {{ MYMEMORY_MAX_LEN }}</template>
          </span>
        </div>
        <textarea
          v-model="ui.input"
          class="io"
          placeholder="输入要翻译的内容…"
          spellcheck="false"
          @keydown.enter.exact.meta.prevent="run"
          @keydown.enter.exact.ctrl.prevent="run"
        ></textarea>
      </div>

      <button class="swap" title="交换语言与内容" :disabled="ui.loading" @click="swap">⇄</button>

      <div class="pane out">
        <div class="pane-head">
          <select v-model="ui.to" class="lang" :disabled="ui.loading">
            <option v-for="l in LANGS" :key="l.code" :value="l.code">{{ l.label }}</option>
          </select>
          <button v-if="ui.output" class="mini" @click="copyOutput">
            {{ copied ? '已复制 ✓' : '复制' }}
          </button>
        </div>
        <div class="io result" :class="{ streaming }">
          <template v-if="ui.output">{{ ui.output }}<span v-if="streaming" class="caret" /></template>
          <span v-else-if="ui.loading" class="pending">翻译中…</span>
          <span v-else class="placeholder">译文会出现在这里</span>
        </div>
      </div>
    </div>

    <!-- 错误 -->
    <p v-if="ui.error" class="error">⚠ {{ ui.error }}</p>

    <!-- 动作 -->
    <div class="act-row">
      <button class="primary" :disabled="ui.loading || !ui.input.trim() || quickOverflow" @click="run">
        {{ ui.loading ? (ui.engine === 'ai' ? '生成中…' : '翻译中…') : '翻 译' }}
      </button>
      <button v-if="ui.loading" class="stop" @click="stop">停止</button>
      <span class="kbd-hint">Ctrl / ⌘ + Enter 快速翻译</span>
    </div>
  </section>
</template>

<style scoped>
.card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 20px;
}

.engine-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.tabs {
  display: inline-flex;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 3px;
  gap: 3px;
}

.tab {
  border: none;
  background: transparent;
  color: var(--ink-2);
  font-size: 13px;
  padding: 7px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.tab.active {
  background: #fff;
  color: var(--accent);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(31, 36, 48, 0.1);
}

.hint {
  font-size: 12px;
  color: var(--ink-3);
}

.styles {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.chip {
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink-2);
  font-size: 12.5px;
  padding: 5px 13px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s;
}

.chip.active {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-soft);
  font-weight: 600;
}

.style-desc {
  font-size: 12px;
  color: var(--ink-3);
}

.panes {
  display: grid;
  grid-template-columns: 1fr 40px 1fr;
  gap: 10px;
  align-items: stretch;
}

.pane {
  border: 1px solid var(--line);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: border-color 0.15s;
}

.pane:focus-within {
  border-color: var(--accent);
}

.pane-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  border-bottom: 1px solid var(--line);
  background: var(--bg);
}

.lang {
  border: none;
  background: transparent;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
  outline: none;
}

.count {
  font-size: 11.5px;
  color: var(--ink-3);
}

.count.over {
  color: var(--err);
  font-weight: 600;
}

.io {
  flex: 1;
  min-height: 190px;
  border: none;
  outline: none;
  resize: vertical;
  padding: 14px;
  font-size: 15px;
  line-height: 1.7;
  color: var(--ink);
  font-family: inherit;
  background: transparent;
}

.result {
  white-space: pre-wrap;
  word-break: break-word;
  overflow-y: auto;
}

.placeholder,
.pending {
  color: var(--ink-3);
  font-size: 14px;
}

.pending::after {
  content: '…';
  animation: dots 1.2s steps(4) infinite;
}

@keyframes dots {
  0% { content: ''; }
  25% { content: '·'; }
  50% { content: '··'; }
  75% { content: '···'; }
}

.caret {
  display: inline-block;
  width: 2px;
  height: 1.05em;
  background: var(--accent);
  vertical-align: text-bottom;
  margin-left: 1px;
  animation: blink 0.9s steps(1) infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

.swap {
  align-self: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink-2);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.15s;
}

.swap:hover:not(:disabled) {
  color: var(--accent);
  border-color: var(--accent);
  transform: rotate(180deg);
}

.swap:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.mini {
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink-2);
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.mini:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.error {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--err);
}

.act-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}

.primary {
  min-width: 140px;
  padding: 11px 28px;
  border: none;
  border-radius: 11px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  font-size: 14.5px;
  font-weight: 600;
  letter-spacing: 4px;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(79, 93, 237, 0.32);
  transition: all 0.15s;
}

.primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 9px 20px rgba(79, 93, 237, 0.4);
}

.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.stop {
  padding: 11px 20px;
  border: 1px solid var(--err);
  background: #fff;
  color: var(--err);
  border-radius: 11px;
  font-size: 13.5px;
  cursor: pointer;
}

.kbd-hint {
  font-size: 12px;
  color: var(--ink-3);
}

@media (max-width: 720px) {
  .panes {
    grid-template-columns: 1fr;
  }

  .swap {
    justify-self: center;
  }
}
</style>
