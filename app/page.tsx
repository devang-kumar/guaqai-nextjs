'use client';

// This is the main entry point — it renders the full SPA shell
// All state management lives here, same as the original App.tsx
import dynamic from 'next/dynamic';

const AppShell = dynamic(() => import('@/components/AppShell'), { ssr: false });

export default function Home() {
  return <AppShell />;
}
