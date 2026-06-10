/// <reference types="vite/client" />
export const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export interface OpenRouterOptions {
  model?: string;
  systemPrompt?: string;
  responseFormat?: 'text' | 'json';
  base64Image?: string;
  mimeType?: string;
}

export async function generateTextWithOpenRouter(prompt: string, options: OpenRouterOptions = {}) {
  const model = options.model || 'openai/gpt-4o-mini';
  
  if (!OPENROUTER_API_KEY) {
    throw new Error('VITE_OPENROUTER_API_KEY is not set in the environment variables.');
  }

  const messages: any[] = [];
  if (options.systemPrompt) {
    messages.push({ role: 'system', content: options.systemPrompt });
  }

  let userContent: any = prompt;
  
  if (options.base64Image) {
    userContent = [
      { type: "text", text: prompt },
      { type: "image_url", image_url: { url: `data:${options.mimeType || 'image/jpeg'};base64,${options.base64Image}` } }
    ];
  }

  messages.push({ role: 'user', content: userContent });

  const payload: any = {
    model: model,
    messages: messages,
  };

  if (options.responseFormat === 'json') {
     payload.response_format = { type: "json_object" };
     if (!prompt.toLowerCase().includes("json")) {
         // Some models require the word JSON in the prompt
         messages[messages.length - 1].content += "\n\nRespond with ONLY valid JSON.";
     }
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin, 
      'X-Title': 'CG Waste Data Platform',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText} (${await response.text()})`);
  }

  const data = await response.json();
  const textContent = data.choices[0].message.content;

  if (options.responseFormat === 'json') {
      try {
          return JSON.parse(textContent);
      } catch (e) {
          console.error("OpenRouter JSON parsing failed", textContent);
          throw new Error("Failed to parse JSON response from OpenRouter");
      }
  }

  return textContent;
}
