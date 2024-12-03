import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems: NavItemConfig[] = [
  { key: 'products', title: 'Sản phẩm', href: paths.dashboard.customers, icon: 'storefront' },
  { key: 'voucher', title: 'Voucher', href: paths.dashboard.vouchers, icon: 'tag' },
  {
    key: 'carts',
    title: 'Trạng thái giỏ hàng',
    href: paths.dashboard.carts,
    icon: 'basket',
  },
  {
    key: 'reports', title: 'Báo cáo/Thống kê', href: paths.dashboard.reports, icon: 'briefcase',
    children: [
      { key: 'customerRevenue', title: 'Doanh thu theo khách hàng', href: `${paths.dashboard.reports}/customerRevenue`, icon: '' },
      { key: 'productRevenue', title: 'Doanh thu theo sản phẩm', href: `${paths.dashboard.reports}/productRevenue`, icon: '' },
      { key: 'voucherRevenue', title: 'Doanh thu theo chương trình khuyến mãi', href: `${paths.dashboard.reports}/voucherRevenue`, icon: '' },
    ],
  },
  { key: 'account', title: 'Tài khoản', href: paths.dashboard.account, icon: 'user' },
];
