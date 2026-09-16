<script setup lang="ts">
import { ref } from 'vue'
import TranslateCard from './components/TranslateCard.vue'
import SettingsModal from './components/SettingsModal.vue'
import HistoryDrawer from './components/HistoryDrawer.vue'

const showSettings = ref(false)
const showHistory = ref(false)
</script>

<template>
  <div class="page">
    <header class="topbar">
      <div class="brand">
        <span class="logo">译</span>
        <div class="brand-text">
          <strong>Translate Studio</strong>
          <small>多模式翻译工作台</small>
        </div>
      </div>
      <nav class="actions">
        <button class="ghost-btn" title="历史记录" @click="showHistory = true">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" />
          </svg>
          历史
        </button>
        <button class="ghost-btn" title="设置" @click="showSettings = true">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          设置
        </button>
      </nav>
    </header>

    <main class="main">
      <TranslateCard />
    </main>

    <footer class="foot">
      <span>Vue 3 · TypeScript · Vite —— 极速翻译由 MyMemory 提供，AI 翻译默认走 Novita AI（OpenAI 兼容）</span>
    </footer>

    <SettingsModal v-if="showSettings" @close="showSettings = false" />
    <HistoryDrawer v-if="showHistory" @close="showHistory = false" />
  </div>
</template>

<style scoped>
.page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 22px 20px 40px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 26px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  box-shadow: 0 6px 16px rgba(79, 93, 237, 0.35);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.brand-text strong {
  font-size: 17px;
}

.brand-text small {
  color: var(--ink-3);
  font-size: 12px;
}

.actions {
  display: flex;
  gap: 8px;
}

.ghost-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--line);
  background: var(--card);
  color: var(--ink-2);
  border-radius: 10px;
  padding: 8px 13px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}

.ghost-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--accent-soft);
}

.main {
  flex: 1;
}

.foot {
  margin-top: 26px;
  text-align: center;
  color: var(--ink-3);
  font-size: 12px;
}
</style>
