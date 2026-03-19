/**
 * Client-safe AI service wrapper.
 * In Next.js, actual Gemini calls go through /api/ai/* routes (server-side).
 * This file provides the same interface for components that call the API routes.
 */

import { SimulationStage, DocumentFile, AffiliateContact } from '../types';

export async function generateBotResponse(
  history: string[],
  userMessage: string,
  stage: SimulationStage,
  documents: DocumentFile[],
  affiliates: AffiliateContact[]
): Promise<string> {
  const knowledgeBase = documents.map(d => `[${d.name}]: ${d.description}`).join('\n');
  const affiliateContacts = affiliates.map(a => `${a.label}: ${a.number} (${a.category})`).join('\n');

  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage, stage, hotelName: 'Country Inn & Suites', knowledgeBase, affiliateContacts }),
  });

  if (!res.ok) throw new Error('AI service error');
  const data = await res.json();
  return data.reply;
}

export async function generateReviewReply(
  comment: string,
  rating: number,
  guestName: string,
  signature: string,
  hotelName = 'Country Inn & Suites'
): Promise<string> {
  const res = await fetch('/api/ai/review-reply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ guestName, rating, comment, hotelName, signature }),
  });

  if (!res.ok) throw new Error('AI service error');
  const data = await res.json();
  return data.reply;
}

export async function generateHelpAnswer(question: string): Promise<string> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: question, stage: 'HELP', hotelName: 'GuaqAI Platform', knowledgeBase: '', affiliateContacts: '' }),
  });

  if (!res.ok) throw new Error('AI service error');
  const data = await res.json();
  return data.reply;
}
