'use client';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';

import { createTheme } from '@mui/material/styles';  // Đảm bảo là từ MUI core

import EmotionCache from './emotion-cache';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {
  // Tạo theme với cấu hình nền trắng
  const theme = createTheme({
    palette: {
      background: {
        default: '#ffffff', // Nền màu trắng
      },
    },
  });

  return (
    <EmotionCache options={{ key: 'mui' }}>
      <CssVarsProvider theme={theme}>
        <CssBaseline />
        {children}
      </CssVarsProvider>
    </EmotionCache>
  );
}
