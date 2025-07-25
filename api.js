export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const { pathname } = url;
      const auth = request.headers.get("authorization") || "";
      const apiKey = auth.replace(/^Bearer\s*/i, "");

      if (apiKey !== SECRET_KEY) {
        return new Response(
          JSON.stringify({ error: { message: "Unauthorized" } }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (pathname === "/v1/models" && request.method === "GET") {
        return await handleModels(request, env);
      }

      if (pathname === "/v1/chat/completions" && request.method === "POST") {
        return await handleChat(request, env);
      }

      return new Response(
        JSON.stringify({ error: { message: "Not Found" } }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Worker encountered an error:", error);
      return new Response(
        JSON.stringify({ error: { message: "Internal Server Error" } }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
};

const SECRET_KEY = "YOUR-API-KEY"; // Fill in your own api key (not Cloudflare api key but any string you want).
// Below is how `/v1/models` works, you can modify the returned models by editing the models below.
async function handleModels(request, env) {
  const models = [
    { id: "@cf/meta/llama-3.2-3b-instruct", object: "model", created: 0, owned_by: "cloudflare" },
    { id: "@cf/meta/llama-guard-3-8b", object: "model", created: 0, owned_by: "cloudflare" },
    { id: "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b", object: "model", created: 0, owned_by: "cloudflare" },
    { id: "@cf/meta/llama-3.3-70b-instruct-fp8-fast", object: "model", created: 0, owned_by: "cloudflare" },
    { id: "@cf/qwen/qwen2.5-coder-32b-instruct", object: "model", created: 0, owned_by: "cloudflare" },
    { id: "@cf/meta/llama-4-scout-17b-16e-instruct", object: "model", created: 0, owned_by: "cloudflare" },
    { id: "@cf/google/gemma-3-12b-it", object: "model", created: 0, owned_by: "cloudflare" },
    { id: "@cf/meta/llama-3.2-11b-vision-instruct", object: "model", created: 0, owned_by: "cloudflare" },
    { id: "@cf/meta/m2m100-1.2b", object: "model", created: 0, owned_by: "cloudflare" },
    { id: "@cf/meta/llama-3.1-8b-instruct", object: "model", created: 0, owned_by: "cloudflare" }
  ];

  return new Response(JSON.stringify({
    object: "list",
    data: models
  }), {
    headers: { "Content-Type": "application/json" },
    status: 200
  });
}

async function handleChat(req, env) {
  const payload = await req.json();
  const {
    model,
    messages,
    temperature = 1,
    max_tokens = 512,
    stream = false,
    ...rest
  } = payload;

  const usedModel = model && model.trim() !== "" ? model : "@cf/meta/llama-3.1-8b-instruct";

  const aiResponse = await env.AI.run(usedModel, {
    messages,
    temperature,
    max_tokens,
    stream,
    ...rest,
  });

  // Build OpenAI-compatible response
  const openaiResponse = {
    id: "chatcmpl-" + (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)),
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model: usedModel,
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: aiResponse.response || "",
        },
        finish_reason: "stop",
      },
    ],
    usage: {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    },
  };

  const headers = {
    "Content-Type": "application/json",
  };

  if (stream) {
    // Streaming is not implemented here; return error or implement SSE if needed
    return new Response(
      JSON.stringify({ error: { message: "Streaming not supported yet" } }),
      { status: 501, headers }
    );
  }

  return new Response(JSON.stringify(openaiResponse), { headers });
}
