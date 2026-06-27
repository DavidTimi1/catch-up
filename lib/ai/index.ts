import { GeminiService } from "./gemini";
import { IAIService } from "./interface";

// This acts as a service locator / factory.
// We can easily swap out the GeminiService for an OpenAIService, ClaudeService, etc.
// based on environment variables or configuration without changing the rest of the app.

export const aiService: IAIService = new GeminiService();

export * from "./interface";
