import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Invoice as InvoiceIcon } from '@phosphor-icons/react/dist/ssr/Invoice';

export interface TasksProgressProps {
  sx?: SxProps;
}

export function TasksProgress({ sx }: TasksProgressProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" gutterBottom variant="overline">
                Tổng đơn tháng
              </Typography>
              <Typography variant="h4">4000</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'black', height: '56px', width: '56px' }}>
              <InvoiceIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
