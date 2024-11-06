import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Tổng quan', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'products', title: 'Sản phẩm', href: paths.dashboard.customers, icon: 'users' },
  { key: 'voucher', title: 'Voucher', href: paths.dashboard.vouchers, icon: 'tag' },
  { key: 'settings', title: 'Cài đặt', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Tài khoản', href: paths.dashboard.account, icon: 'user' },
] satisfies NavItemConfig[];
