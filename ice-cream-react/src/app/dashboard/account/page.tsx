import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import AccountDetailsForm from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';

export const metadata = { title: `Tài khoản` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3} sx={{ padding: 3 }}>
      <Typography 
        variant="h4" 
        sx={{ fontWeight: 'bold', color: 'primary.main' }}
      >
        Tài khoản
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
        <Box 
          sx={{ 
            flex: 1, 
            minWidth: 0, 
            display: 'flex', 
            justifyContent: 'center' 
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              borderRadius: 2,
              backgroundColor: 'background.paper',
              width: '100%', // Đảm bảo nó chiếm toàn bộ không gian
            }}
          >
            <AccountInfo />
          </Paper>
        </Box>
        <Box 
          sx={{ 
            flex: 2, 
            minWidth: 0, 
            display: 'flex', 
            justifyContent: 'center' 
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              borderRadius: 2,
              backgroundColor: 'background.paper',
              width: '100%',
            }}
          >
            <AccountDetailsForm />
          </Paper>
        </Box>
      </Stack>
    </Stack>
  );
}
