'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';

import { NoSsr } from '@/components/core/no-ssr';

const HEIGHT = 60;
const WIDTH = 60;

type Color = 'dark' | 'light';

export interface LogoProps {
  color?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function Logo({ color = 'dark', emblem, height = HEIGHT, width = WIDTH }: LogoProps): React.JSX.Element {
  let url: string;

  if (emblem) {
    url = color === 'light' ? '/assets/images/thuytalogokhongbede.png' : '/assets/images/thuytalogokhongbede.png';
  } else {
    url = color === 'light' ? '/assets/images/thuytalogokhongbede.png' : '/assets/images/thuytalogokhongbede.png';
  }

  return (
    <Box
      sx={{
        backgroundColor: 'white', // Nền trắng cho logo
        padding: '8px', // Khoảng cách giữa logo và nền trắng
        borderRadius: '8px', // Có thể thêm bo góc nếu cần
        display: 'flex', // Sử dụng flex để căn giữa
        justifyContent: 'center', // Căn giữa theo chiều ngang
        alignItems: 'center', // Căn giữa theo chiều dọc
        minHeight: `${height + 16}px`, // Chiều cao tối thiểu của phần tử bao quanh logo
        minWidth: `${width + 16}px`, // Chiều rộng tối thiểu của phần tử bao quanh logo
      }}
    >
      <Box 
        component="img" 
        src={url} 
        alt="logo" 
        height={height} 
        width={width} 
        sx={{
          objectFit: 'contain', // Giữ tỷ lệ ảnh không bị méo
          objectPosition: 'center', // Căn giữa ảnh trong container
        }}
      />
    </Box>
  );
}

export interface DynamicLogoProps {
  colorDark?: Color;
  colorLight?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function DynamicLogo({
  colorDark = 'light',
  colorLight = 'dark',
  height = HEIGHT,
  width = WIDTH,
  ...props
}: DynamicLogoProps): React.JSX.Element {
  const { colorScheme } = useColorScheme();
  const color = colorScheme === 'dark' ? colorDark : colorLight;

  return (
    <NoSsr fallback={<Box sx={{ height: `${height}px`, width: `${width}px` }} />} >
      <Logo color={color} height={height} width={width} {...props} />
    </NoSsr>
  );
}
