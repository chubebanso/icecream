'use client';

import * as React from 'react';
import { Stack, Typography, Card, CardContent, CardActionArea, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Person as CustomerIcon, ShoppingCart as ProductIcon, LocalOffer as VoucherIcon } from '@mui/icons-material';

export default function ReportsNavigation(): React.JSX.Element {
  const router = useRouter();

  const reports = [
    {
      key: 'customerRevenue',
      title: 'Thống kê doanh thu theo các khách hàng',
      description: 'Xem chi tiết doanh thu từ từng khách hàng',
      href: '/dashboard/reports/customerRevenue',
      icon: <CustomerIcon fontSize="inherit" color="primary" />,
    },
    {
      key: 'productRevenue',
      title: 'Thống kê doanh thu theo sản phẩm',
      description: 'Xem chi tiết doanh thu tạo ra từ các sản phẩm',
      href: '/dashboard/reports/productRevenue',
      icon: <ProductIcon fontSize="inherit" color="secondary" />,
    },
    {
      key: 'voucherRevenue',
      title: 'Thống kê doanh thu theo các chương trình khuyến mãi',
      description: 'Theo dõi hiệu quả kinh doanh của các chương trình khuyến mãi',
      href: '/dashboard/reports/voucherRevenue',
      icon: <VoucherIcon fontSize="inherit" color="success" />,
    },
  ];

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <Stack spacing={3} padding={3}>
      <Typography variant="h4" textAlign="center" gutterBottom fontWeight="bold">
        THỐNG KÊ DOANH THU
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {/* First row (1 item) */}
        <Grid item xs={12} sm={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Card
            sx={{
              padding: 2,
              minHeight: 250,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: 4,
              '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.3s ease-in-out' },
            }}
          >
            <CardActionArea onClick={() => handleNavigate(reports[0].href)} sx={{ width: '100%', height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Stack alignItems="center" spacing={3}>
                  <div style={{ fontSize: 50 }}>{reports[0].icon}</div>
                  <Typography variant="h5" fontWeight="bold">
                    {reports[0].title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {reports[0].description}
                  </Typography>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Second row (2 items) */}
        <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Card
            sx={{
              padding: 2,
              minHeight: 250,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: 4,
              '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.3s ease-in-out' },
            }}
          >
            <CardActionArea onClick={() => handleNavigate(reports[1].href)} sx={{ width: '100%', height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Stack alignItems="center" spacing={3}>
                  <div style={{ fontSize: 50 }}>{reports[1].icon}</div>
                  <Typography variant="h5" fontWeight="bold">
                    {reports[1].title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {reports[1].description}
                  </Typography>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Third row (3 items) */}
        <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Card
            sx={{
              padding: 2,
              minHeight: 250,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: 4,
              '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.3s ease-in-out' },
            }}
          >
            <CardActionArea onClick={() => handleNavigate(reports[2].href)} sx={{ width: '100%', height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Stack alignItems="center" spacing={3}>
                  <div style={{ fontSize: 50 }}>{reports[2].icon}</div>
                  <Typography variant="h5" fontWeight="bold">
                    {reports[2].title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {reports[2].description}
                  </Typography>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
