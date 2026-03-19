'use server';

const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';
const MODEL = 'grok-3-mini';

async function grokChat(systemPrompt: string, userMessage: string): Promise<string> {
  const res = await fetch(XAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Grok API error: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? 'I could not process that request.';
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

  return grokChat(system, userMessage);
}

export async function generateReviewReply(
  guestName: string,
  rating: number,
  comment: string,
  hotelName: string,
  signature: string
): Promise<string> {
  const system = `You are the Guest Relations Manager for ${hotelName}. Write professional, warm, personalized replies to guest reviews. Sign off with: "${signature}". Keep it under 100 words. No markdown.`;
  const user = `Guest: ${guestName} | Rating: ${rating}/5 | Review: "${comment}"`;
  return grokChat(system, user);
}

export async function generateHelpAnswer(question: string): Promise<string> {
  const system = `You are the Help Desk Assistant for "GuaqAI", a Hospitality Operations Platform. Answer questions about the dashboard, inbox, tickets, reviews, campaigns, analytics, and settings. Be concise. No markdown.`;
  return grokChat(system, question);
}
