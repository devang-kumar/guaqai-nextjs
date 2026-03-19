import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GuaqAI - Hospitality Operations Platform',
  description: 'AI-driven hospitality management dashboard. Automate guest requests, manage tickets, and boost reputation.',
  openGraph: {
    title: 'GuaqAI - Hospitality Operations Platform',
    description: 'Streamline hotel operations with AI. Chatbots, Ticket Management, and Analytics.',
    url: 'https://hospitality.guaqai.me/',
    images: [{ url: 'https://guaq.framer.ai/images/meta-hospitality.png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-slate-950 text-slate-200 antialiased"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
