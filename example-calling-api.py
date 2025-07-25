import openai

client = openai.OpenAI(
    base_url="https://your-worker-domain.workers.dev.workers.dev/v1",
    api_key="sk-yourPersonalKey123"
)

response = client.chat.completions.create(
    model="@cf/meta/llama-3.1-8b-instruct",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is the capital of France?"}
    ],
    temperature=0.8, 
    max_tokens=128, 
    top_p=0.95
)

print(response.choices[0].message.content)
