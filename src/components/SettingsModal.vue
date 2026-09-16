<script setup lang="ts">
import { reactive } from 'vue'
import { settings } from '../store'

const emit = defineEmits<{ (e: 'close'): void }>()

const form = reactive({
  novitaKey: settings.novitaKey,
  novitaBaseUrl: settings.novitaBaseUrl,
  novitaModel: settings.novitaModel,
})

function save(): void {
  settings.novitaKey = form.novitaKey.trim()
  settings.novitaBaseUrl = form.novitaBaseUrl.trim() || 'https://api.novita.ai/openai'
  settings.novitaModel = form.novitaModel.trim() || 'deepseek/deepseek-v3-turbo'
  emit('close')
}
</script>

<template>
  <div class="mask" @click.self="emit('close')">
    <div class="modal">
      <header>
        <h3>设置</h3>
        <button class="x" @click="emit('close')">✕</button>
      </header>

      <div class="body">
        <label class="field">
          <span class="label">Novita AI API Key</span>
          <input
            v-model="form.novitaKey"
            type="password"
            placeholder="nai_xxxxxxxx（仅保存在本浏览器）"
            autocomplete="off"
          />
          <small>
            在 <a href="https://novita.ai" target="_blank" rel="noopener">novita.ai</a> 控制台创建。
            Key 只存在浏览器 localStorage，请求由浏览器直连 AI 服务，不经过任何中间服务器。
          </small>
        </label>

        <label class="field">
          <span class="label">Base URL（OpenAI 兼容）</span>
          <input v-model="form.novitaBaseUrl" type="text" placeholder="https://api.novita.ai/openai" />
          <small>默认 Novita AI；可换成任意 OpenAI 兼容服务（如自建网关）</small>
        </label>

        <label class="field">
          <span class="label">模型 ID</span>
          <input v-model="form.novitaModel" type="text" placeholder="deepseek/deepseek-v3-turbo" />
          <small>翻译性价比推荐 deepseek-v3-turbo；更高要求可换 deepseek-v3.1 等</small>
        </label>
      </div>

      <footer>
        <button class="cancel" @click="emit('close')">取消</button>
        <button class="save" @click="save">保存</button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.mask {
  position: fixed;
  inset: 0;
  background: rgba(31, 36, 48, 0.4);
  backdrop-filter: blur(3px);
  display: grid;
  place-items: center;
  z-index: 50;
  padding: 20px;
}

.modal {
  width: min(520px, 100%);
  background: var(--card);
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(31, 36, 48, 0.25);
  overflow: hidden;
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
  font-size: 15.5px;
}

.x {
  border: none;
  background: transparent;
  color: var(--ink-3);
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
}

.x:hover {
  background: var(--bg);
  color: var(--ink);
}

.body {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-2);
}

input {
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13.5px;
  font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
  outline: none;
  transition: border-color 0.15s;
}

input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(79, 93, 237, 0.12);
}

small {
  font-size: 11.5px;
  color: var(--ink-3);
  line-height: 1.6;
}

small a {
  color: var(--accent);
}

footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid var(--line);
  background: var(--bg);
}

.cancel,
.save {
  padding: 9px 20px;
  border-radius: 10px;
  font-size: 13.5px;
  cursor: pointer;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink-2);
}

.save {
  border: none;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(79, 93, 237, 0.3);
}
</style>
