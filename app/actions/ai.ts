'use server';

import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const BASE_INSTRUCTION = `
You are 'Guaq', the AI Concierge for Country Inn & Suites by Radisson, Manipal.
Your tone is professional, warm, luxurious, and helpful.
You are concise because you are chatting on WhatsApp.

KEY BEHAVIORS:
1. Welcome: If the user says "Hi" or "Arrived", welcome them, offer the WiFi password (CountryInn_Guest / 123456).
2. Pulse Check: If asked about pulse check, ask for a rating 1-5.
   - 1-3: Apologize deeply.
   - 4-5: Celebrate and ask for Google Review.
3. Pre-Arrival: Say "Greetings from Country Inn! We are excited to welcome you tomorrow. To speed up your check-in, could you please share a photo of your ID card?"
4. Checkout: If user mentions "checkout", "leaving", or "bill", acknowledge it and assure them the Front Desk is preparing their folio.
5. Documents: Use the provided Knowledge Base to answer specific questions about amenities, menus, or rules.
6. Contacts: If a guest asks for a taxi, doctor, or external service, provide the contact from the Affiliate Contacts list.

Do not use heavy markdown formatting.
`;

export async function generateBotResponse(
  userMessage: string,
  stage: string,
  hotelName: string,
  knowledgeBase: string,
  affiliateContacts: string
): Promise<string> {
  const systemInstruction = `${BASE_INSTRUCTION}
Hotel Name: ${hotelName}
Current Stage: ${stage}
Knowledge Base: ${knowledgeBase || 'No documents uploaded.'}
Affiliate Contacts: ${affiliateContacts || 'No contacts available.'}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    config: { systemInstruction },
    contents: [{ role: 'user', parts: [{ text: userMessage }] }],
  });

  return response.text ?? 'I apologize, I could not process that request.';
}

export async function generateReviewReply(
  guestName: string,
  rating: number,
  comment: string,
  hotelName: string,
  signature: string
): Promise<string> {
  const prompt = `You are the Guest Relations Manager for ${hotelName}.
Write a professional, warm, and personalized reply to this guest review.
Guest: ${guestName} | Rating: ${rating}/5
Review: "${comment}"
Sign off with: "${signature}"
Keep it under 100 words. Do not use markdown.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  return response.text ?? 'Thank you for your feedback!';
}

export async function generateHelpAnswer(question: string): Promise<string> {
  const systemInstruction = `You are the Help Desk Assistant for "GuaqAI", a Hospitality Operations Platform.
Answer questions about how to use the dashboard, inbox, tickets, reviews, campaigns, analytics, and settings.
Be concise and helpful. Use plain text, no markdown.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    config: { systemInstruction },
    contents: [{ role: 'user', parts: [{ text: question }] }],
  });

  return response.text ?? 'Please contact support for assistance.';
}
