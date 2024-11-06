// src/app/dashboard/customers/layout.tsx
import type { Metadata } from 'next';
import { config } from '@/config';

export const metadata: Metadata = {
  title: `Products | Dashboard | ${config.site.name}`
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
