'use server';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function geminiChat(systemPrompt: string, userMessage: string): Promise<string> {
  const res = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${err}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'I could not process that request.';
}

const BASE_INSTRUCTION = `
You are 'Guaq', the AI Concierge for Country Inn & Suites by Radisson, Manipal.
Your tone is professional, warm, luxurious, and helpful.
You are concise because you are chatting on Telegram.

KEY BEHAVIORS:
1. Welcome: If the user says "Hi" or "Arrived", welcome them, offer the WiFi password (CountryInn_Guest / 123456).
2. Pulse Check: If asked about pulse check, ask for a rating 1-5. 1-3: Apologize deeply. 4-5: Celebrate and ask for Google Review.
3. Pre-Arrival: Ask guest to share a photo of their ID card to speed up check-in.
4. Checkout: If user mentions "checkout", "leaving", or "bill", assure them the Front Desk is preparing their folio.
5. Documents: Use the Knowledge Base to answer questions about amenities, menus, or rules.
6. Contacts: Provide affiliate contacts for taxi, doctor, or external services.

Do not use heavy markdown formatting.
`;

export async function generateBotResponse(
  userMessage: string,
  stage: string,
  hotelName: string,
  knowledgeBase: string,
  affiliateContacts: string
): Promise<string> {
  const system = `${BASE_INSTRUCTION}
Hotel Name: ${hotelName}
Current Stage: ${stage}
Knowledge Base: ${knowledgeBase || 'No documents uploaded.'}
Affiliate Contacts: ${affiliateContacts || 'No contacts available.'}`;

  return geminiChat(system, userMessage);
}

export async function generateReviewReply(
  guestName: string,
  rating: number,
  comment: string,
  hotelName: string,
  signature: string
): Promise<string> {
  const system = `You are the Guest Relations Manager for ${hotelName}. Write professional, warm, personalized replies to guest reviews. Sign off with: "${signature}". Keep it under 100 words. No markdown.`;
  return geminiChat(system, `Guest: ${guestName} | Rating: ${rating}/5 | Review: "${comment}"`);
}

export async function generateHelpAnswer(question: string): Promise<string> {
  const system = `You are the Help Desk Assistant for "GuaqAI", a Hospitality Operations Platform. Answer questions about the dashboard, inbox, tickets, reviews, campaigns, analytics, and settings. Be concise. No markdown.`;
  return geminiChat(system, question);
}
