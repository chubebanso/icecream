import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Coins as IconDoanhThu } from '@phosphor-icons/react/dist/ssr/Coins';

export interface BudgetProps {
  sx?: SxProps;
}

export function Budget({ sx }: BudgetProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Doanh thu trong tháng
              </Typography>
              <Typography variant="h4">{'240256378'}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'yellow', height: '56px', width: '56px' }}>
              <IconDoanhThu fontSize="var(--icon-fontSize-lg)" style={{ color: 'green' }} />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
