import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems: NavItemConfig[] = [
  { key: 'overview', title: 'Tổng quan', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'products', title: 'Sản phẩm', href: paths.dashboard.customers, icon: 'storefront' },
  { key: 'voucher', title: 'Voucher', href: paths.dashboard.vouchers, icon: 'tag' },
  {
    key: 'carts',
    title: 'Trạng thái giỏ hàng',
    href: paths.dashboard.carts,
    icon: 'basket',
  },
  { key: 'reports', title: 'Báo cáo', href: paths.dashboard.reports, icon: 'briefcase',
    children: [
      { key: 'customerRevenue', title: 'Doanh thu theo khách hàng', href: `${paths.dashboard.reports}/customerRevenue`, icon: '' },
      { key: 'productRevenue', title: 'Doanh thu theo sản phẩm', href: `${paths.dashboard.reports}/productRevenue`, icon: '' },
      { key: 'voucherRevenue', title: 'Doanh thu theo voucher', href: `${paths.dashboard.reports}/voucherRevenue`, icon: '' },
    ],
   },
  { key: 'account', title: 'Tài khoản', href: paths.dashboard.account, icon: 'user' },
];
