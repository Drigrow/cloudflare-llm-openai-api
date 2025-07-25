# Cloudflare AI 大语言模型及 OpenAI 兼容 API

[English](https://github.com/Drigrow/cloudflare-llm-openai-api/blob/main/README.md) | 中文

本项目基于 Cloudflare Workers 部署 Cloudflare 大语言模型（LLMs），并提供一个 OpenAI 兼容的 API，方便集成使用。

## 功能特点

- 通过 OpenAI 兼容的 API 直接调用 Cloudflare AI 模型（例如 LLaMA）。
- 支持对话补全，支持温度（temperature）、最大令牌数（max tokens）、模型选择等参数。
- 提供 `/v1/models` 接口，返回 Cloudflare 模型列表（不全，仅收录部分模型，可以自行增加），符合 OpenAI API 格式。
- 简单的 API Key 鉴权，方便访问控制。
- 支持默认模型回退，未指定模型时自动使用默认模型。

## 快速开始

### 部署步骤

1. 创建一个绑定了名为 `AI` 的 AI 绑定的 Cloudflare Worker（此绑定名需与代码保持一致）。
2. 将 Worker 代码中的 `SECRET_KEY` 替换为你自己的 API 密钥（密钥值可自定义，请务必牢记）。
3. 将 Worker 部署到 Cloudflare。
4. （可选）如果你所在地区无法访问 `.workers.dev` 域名，可以绑定自定义域名。

### 示例 API 请求

- **查询可用模型**

```bash
curl -H "Authorization: Bearer sk-yourPersonalKey123" \
     https://your-worker-domain.workers.dev/v1/models
````

* **生成 chat completion**

```bash
curl -X POST https://your-worker-domain.workers.dev/v1/chat/completions \
  -H "Authorization: Bearer sk-yourPersonalKey123" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "@cf/meta/llama-3.1-8b-instruct",
    "messages": [
      {"role": "system", "content": "你是一个有帮助的助手。"},
      {"role": "user", "content": "法国的首都是哪里？"}
    ],
    "temperature": 0.7,
    "max_tokens": 100
  }'
```

## 已知限制

* 目前不支持流式响应（`stream=true`），若启用将返回 501 错误。
* 返回的令牌使用统计为占位符（始终为 0），因为 Cloudflare AI 暂未提供相关数据。
* 主要适合个人或开发使用。

## 许可证

MIT 许可证

## 致谢

* 由 Cloudflare Workers 和 Cloudflare AI 提供技术支持。
* API 设计遵循 OpenAI 聊天补全接口规范。
