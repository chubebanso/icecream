'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { paths } from '@/paths';
import { DynamicLogo } from '@/components/core/logo';

export interface LayoutProps {
  children: React.ReactNode;
  welcomeMessage?: string;
  subMessage?: string;
}

export function Layout({ children, welcomeMessage, subMessage }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box
            component={RouterLink}
            href={paths.home}
            sx={{
              display: 'inline-block',
              fontSize: 0,
              '&:hover': {
                transform: 'scale(1.1)',
                transition: 'transform 0.3s ease',
              },
            }}
          >
            <DynamicLogo colorDark="light" colorLight="dark" height={32} width={122} />
          </Box>
        </Box>

        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flex: '1 1 auto',
            justifyContent: 'center',
            p: 3,
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box sx={{ maxWidth: '450px', width: '100%' }}>{children}</Box>
        </Box>
      </Box>

      {/* Phần Chào mừng */}
      <Box
        sx={{
          alignItems: 'center',
          background: 'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
          color: 'var(--mui-palette-common-white)',
          display: 'flex',
          justifyContent: 'center',
          p: 3,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          borderTop: '1px solid #333',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Làm mờ phần nền phía sau để văn bản nổi bật */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '8px',
          }}
        />

        <Stack spacing={3} sx={{ textAlign: 'center', zIndex: 1 }}>
          <Stack spacing={1}>
            <Typography
              color="inherit"
              sx={{
                fontSize: '28px',
                lineHeight: '40px',
                fontWeight: 'bold',
                opacity: 1,
                display: 'inline-block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                animation: 'typing 4s steps(40) 1s forwards, blink 0.75s step-end infinite', // Thêm hiệu ứng gõ chữ
              }}
              variant="h1"
            >
              
              <Box component="span" sx={{ color: '#15b79e' }}>
                Chào mừng tới website quản lý của nhà hàng Thủy Tạ
              </Box>
              <Box sx={{ color: 'white' }}>{subMessage || 'Chúc bạn có một ngày làm việc hiệu quả!'}</Box>
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <style jsx>{`
        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes blink {
          50% {
            border-color: transparent;
          }
        }
      `}</style>
    </Box>
  );
}
