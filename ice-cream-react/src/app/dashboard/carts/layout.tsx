// src/app/dashboard/customers/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Thủy Tạ Admin - Giỏ hàng`
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
