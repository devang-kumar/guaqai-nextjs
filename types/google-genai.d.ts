// Type shim for @google/genai until moduleResolution picks it up correctly
declare module '@google/genai' {
  export class GoogleGenAI {
    constructor(options: { apiKey: string });
    models: {
      generateContent(params: {
        model: string;
        config?: { systemInstruction?: string };
        contents: Array<{ role: string; parts: Array<{ text: string }> }>;
      }): Promise<{ text: string }>;
    };
  }
}
