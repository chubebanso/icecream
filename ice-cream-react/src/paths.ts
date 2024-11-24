export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/products',
    vouchers: '/dashboard/vouchers',
    carts: '/dashboard/carts',
    reports: '/dashboard/reports',
    customerRevenue: '/dashboard/reports/customerRevenue'
  },
  errors: { notFound: '/errors/not-found' },
} as const;
