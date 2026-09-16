<script setup lang="ts">
import { history, clearHistory } from '../store'
import { labelOf, styleLabel } from '../engines/prompt'
import type { HistoryItem } from '../types'

const emit = defineEmits<{ (e: 'close'): void }>()

function fmt(at: number): string {
  const d = new Date(at)
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function engineTag(item: HistoryItem): string {
  return item.engine === 'ai' ? `AI · ${styleLabel(item.style)}` : '极速'
}
</script>

<template>
  <div class="mask" @click.self="emit('close')">
    <aside class="drawer">
      <header>
        <h3>历史记录 <small>（最近 50 条，仅存本机）</small></h3>
        <div class="h-actions">
          <button v-if="history.length" class="danger" @click="clearHistory">清空</button>
          <button class="x" @click="emit('close')">✕</button>
        </div>
      </header>

      <div class="list">
        <p v-if="!history.length" class="empty">还没有翻译记录</p>
        <article v-for="item in history" :key="item.id" class="item">
          <div class="meta">
            <span class="tag" :class="item.engine">{{ engineTag(item) }}</span>
            <span class="pair">{{ labelOf(item.from) }} → {{ labelOf(item.to) }}</span>
            <time>{{ fmt(item.at) }}</time>
          </div>
          <p class="src">{{ item.source }}</p>
          <p class="res">{{ item.result }}</p>
        </article>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.mask {
  position: fixed;
  inset: 0;
  background: rgba(31, 36, 48, 0.35);
  z-index: 40;
  display: flex;
  justify-content: flex-end;
}

.drawer {
  width: min(440px, 92vw);
  height: 100%;
  background: var(--card);
  box-shadow: -12px 0 40px rgba(31, 36, 48, 0.15);
  display: flex;
  flex-direction: column;
  animation: slide 0.22s ease-out;
}

@keyframes slide {
  from { transform: translateX(30px); opacity: 0.4; }
  to { transform: translateX(0); opacity: 1; }
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--line);
}

h3 {
  margin: 0;
  font-size: 15px;
}

h3 small {
  color: var(--ink-3);
  font-weight: 400;
  font-size: 12px;
}

.h-actions {
  display: flex;
  gap: 8px;
}

.danger,
.x {
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink-2);
  font-size: 12.5px;
  padding: 5px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.danger:hover {
  color: var(--err);
  border-color: var(--err);
}

.x:hover {
  color: var(--ink);
}

.list {
  flex: 1;
  overflow-y: auto;
  padding: 14px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty {
  text-align: center;
  color: var(--ink-3);
  margin-top: 60px;
  font-size: 13.5px;
}

.item {
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 12px 14px;
}

.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 600;
}

.tag.quick {
  background: #e8f7ee;
  color: var(--ok);
}

.tag.ai {
  background: var(--accent-soft);
  color: var(--accent);
}

.pair {
  font-size: 12px;
  color: var(--ink-2);
  font-weight: 600;
}

time {
  font-size: 11px;
  color: var(--ink-3);
  margin-left: auto;
}

.src {
  margin: 0 0 6px;
  font-size: 12.5px;
  color: var(--ink-3);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.res {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.65;
  white-space: pre-wrap;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
