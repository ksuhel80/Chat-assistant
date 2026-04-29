import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "@/types";

// ✅ Use ONLY supported + safe aliases
const MODELS = [
  "gemini-flash-latest",
  "gemini-1.5-flash-latest",
];

const getModel = (systemInstruction?: string, modelName: string = "gemini-flash-latest") => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.7,
    },
    // ✅ Correct way to pass system instruction
    ...(systemInstruction && {
      systemInstruction: {
        role: "system",
        parts: [{ text: systemInstruction }],
      },
    }),
  });
};

export async function streamChatResponse(
  userMessage: string,
  history: Message[],
  systemPrompt: string
): Promise<ReadableStream> {
  let lastError: any = null;

  for (const modelName of MODELS) {
    try {
      const model = getModel(systemPrompt, modelName);

      const formattedHistory = history.map((msg) => ({
        role: msg.role === "assistant" ? ("model" as const) : ("user" as const),
        parts: [{ text: msg.content }],
      }));

      const chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
        },
      });

      const result = await chat.sendMessageStream(userMessage);

      const encoder = new TextEncoder();

      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const text = chunk.text();
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });
    } catch (error: any) {
      lastError = error;

      if (
        error?.status === 429 ||
        error?.message?.includes("429") ||
        error?.message?.includes("rate")
      ) {
        console.warn(`Model ${modelName} rate limited, trying next...`);
        continue;
      }

      console.error(`Model ${modelName} failed:`, error.message);
      continue;
    }
  }

  throw lastError || new Error("All models failed to respond");
}

export async function generateChatResponse(
  userMessage: string,
  history: Message[],
  systemPrompt: string
): Promise<string> {
  let lastError: any = null;

  for (const modelName of MODELS) {
    try {
      const model = getModel(systemPrompt, modelName);

      const formattedHistory = history.map((msg) => ({
        role: msg.role === "assistant" ? ("model" as const) : ("user" as const),
        parts: [{ text: msg.content }],
      }));

      const chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
        },
      });

      const result = await chat.sendMessage(userMessage);
      return result.response.text();
    } catch (error: any) {
      lastError = error;

      if (
        error?.status === 429 ||
        error?.message?.includes("429") ||
        error?.message?.includes("rate")
      ) {
        console.warn(`Model ${modelName} rate limited, trying next...`);
        continue;
      }

      console.error(`Model ${modelName} failed:`, error.message);
      continue;
    }
  }

  throw lastError || new Error("All models failed to respond");
}

export async function generateTitle(firstMessage: string): Promise<string> {
  const model = getModel();

  const prompt = `Generate a short 4-6 word title for a chat that starts with:
[${firstMessage}]
Return ONLY the title, no quotes, no punctuation at end.`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim().slice(0, 50);
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}