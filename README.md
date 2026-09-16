# 译 · Translate Studio

**多模式翻译工作台** —— 一个翻译框，两种引擎：免 Key 的极速翻译 + 可调语气的 AI 翻译（流式输出）。

**在线使用**：<https://jabo2017.github.io/translate-project/>

> 这是 2018 年那个 Vue 2.5 + webpack 3 练习项目的重写：当年练的是 axios 全局挂载和 form-urlencoded，现在练的是 Vue 3 Composition API、TypeScript、SSE 流式渲染和 LLM 工程。

## 两种引擎

| | ⚡ 极速模式 | ✨ AI 模式 |
|---|---|---|
| 引擎 | MyMemory 翻译 API | 任意 OpenAI 兼容 LLM（默认 Novita AI） |
| 需要配置 | 无，即开即用 | 设置里填 API Key（存本机 localStorage） |
| 语气/风格 | — | 自然 / 正式 / 口语 / 商务 / 文学 |
| 输出方式 | 整段返回 | **流式打字机输出**，可中途停止 |
| 单次上限 | 450 字符（免费接口限额） | 2048 token |

AI 模式的 Base URL 和模型 ID 都可配置——默认 `https://api.novita.ai/openai` + `deepseek/deepseek-v3-turbo`，换成任何 OpenAI 兼容服务（自建网关、OpenRouter 等）只需要改两个输入框。

## 功能

- 双栏对照 + 语言互换（内容跟着一起换）
- AI 模式五种语气预设，prompt 系统化构建、有单元测试
- 流式输出带光标动画，Ctrl/⌘ + Enter 快速翻译
- 最近 50 条历史记录，仅存浏览器 localStorage，不上传
- 响应式布局，移动端可用

## Key 安全说明

API Key 只保存在**你自己的浏览器** localStorage 里，请求由浏览器直连 AI 服务方，本项目是纯静态站、没有后端、没有任何数据上报。若在公共电脑使用，用完请在设置里清空 Key。

## 开发

```bash
npm install
npm run dev        # 本地开发
npm test           # vitest 单元测试（prompt 构建 + SSE 解析）
npm run typecheck  # vue-tsc 类型检查
npm run build      # 产物输出 dist/
```

推送到 `master` 后 GitHub Actions 自动构建并部署到 Pages。

## 技术栈

Vue 3.5（Composition API）· TypeScript · Vite · Vitest · GitHub Actions

## Roadmap

- [ ] 双引擎结果对照视图
- [ ] AI 术语表（自定义专名强制保留）
- [ ] PWA 离线壳

## License

[MIT](./LICENSE)
