// src/app/dashboard/customers/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Thủy Tạ Admin - Sản phẩm`
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
