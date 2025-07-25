# Cloudflare AI LLMs with OpenAI-Compatible API

English | [中文](https://github.com/Drigrow/cloudflare-llm-openai-api/blob/main/README-CN.md)

This project hosts Cloudflare large language models (LLMs) on Cloudflare Workers and exposes an OpenAI-compatible API for easy integration.

## Features

- Serve Cloudflare AI models (e.g., LLaMA) directly through an OpenAI-compatible REST API.
- Support chat completions with parameters such as temperature, max tokens, and model selection.
- Provide a `/v1/models` endpoint listing available Cloudflare models in OpenAI API format.
- Simple API key authorization for controlled access.
- Default model fallback for seamless usage when no model is specified.

## Getting Started

### Deployment

1. Create a Cloudflare Worker with an AI binding named `AI` (this is mandatory to match the Worker code).
2. Replace the `SECRET_KEY` in the Worker code with your own API key (you can set any key you prefer; just remember it).
3. Deploy the Worker on Cloudflare.
4. *(Optional)* Bind a custom domain if your region cannot access `.workers.dev` URLs.

### Example API Requests

- **List available models**

```bash
curl -H "Authorization: Bearer sk-yourPersonalKey123" \
     https://your-worker-domain.workers.dev/v1/models
````

* **Generate chat completions**

```bash
curl -X POST https://your-worker-domain.workers.dev/v1/chat/completions \
  -H "Authorization: Bearer sk-yourPersonalKey123" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "@cf/meta/llama-3.1-8b-instruct",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is the capital of France?"}
    ],
    "temperature": 0.7,
    "max_tokens": 100
  }'
```

## Limitations

* Streaming responses (`stream=true`) are **not supported** and will raise a 501 error.
* Token usage counts in responses are placeholders (always zero) because Cloudflare AI does not provide this data.
* Intended primarily for personal or development use.

## License

MIT License

## Credits

* Powered by Cloudflare Workers and Cloudflare AI.
* API follows the OpenAI Chat Completion specification.
