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
        {/* Tailwind CSS via CDN - compatible with all Node versions */}
        <script src="https://cdn.tailwindcss.com" async></script>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          fontFamily: 'Inter, sans-serif',
          backgroundColor: '#020617',
          color: '#e2e8f0',
          margin: 0,
          padding: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {children}
      </body>
    </html>
  );
}
