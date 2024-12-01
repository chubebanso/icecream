'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { AuthGuard } from '@/components/auth/auth-guard';
import { MainNav } from '@/components/dashboard/layout/main-nav';
import { SideNav } from '@/components/dashboard/layout/side-nav';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  // Cấu hình theme
  const theme = createTheme({
    palette: {
      mode: 'light', // Thay đổi thành 'dark' nếu muốn chế độ tối
      background: {
        default: '#f4f4f4', // Thay đổi màu nền chính
      },
    },
    components: {
      // Có thể thêm cấu hình các thành phần như button, typography...
    },
  });

  return (
    <AuthGuard>
      <ThemeProvider theme={theme}>
        <GlobalStyles
          styles={{
            body: {
              '--MainNav-height': '54px',
              '--MainNav-zIndex': 1000,
              '--SideNav-width': '350px',
              '--SideNav-zIndex': 1100,
              '--MobileNav-width': '320px',
              '--MobileNav-zIndex': 1100,
            },
          }}
        />
        <Box
          sx={{
            bgcolor: 'var(--mui-palette-background-default)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            minHeight: '100%',
          }}
        >
          <SideNav />
          <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', pl: { lg: 'var(--SideNav-width)' } }}>
            <MainNav />
            <main>
              <Container maxWidth="xl" sx={{ py: '64px' }}>
                {children}
              </Container>
            </main>
          </Box>
        </Box>
      </ThemeProvider>
    </AuthGuard>
  );
}
