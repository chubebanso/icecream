// src/types/nav.ts
export interface NavItemConfig {
  key: string;
  title: string;
  href: string;
  icon: string;
  children?: NavItemConfig[]; // Thêm phần này
  external?: boolean;
  matcher?: string;
  disabled?: boolean;
}
