'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

export function UpdatePasswordForm(): React.JSX.Element {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Card>
        <CardHeader subheader="Cập nhật mật khẩu mới" title="Mật khẩu" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
            <FormControl fullWidth>
              <InputLabel>Nhập mật khẩu mới</InputLabel>
              <OutlinedInput label="Nhập mật khẩu mới" name="Nhập mật khẩu mới" type="Nhập mật khẩu mới" />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Xác nhận mật khẩu mới</InputLabel>
              <OutlinedInput label="Xác nhận mật khẩu mới" name="Xác nhận mật khẩu mới" type="Xác nhận mật khẩu mới" />
            </FormControl>
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">Cập nhật</Button>
        </CardActions>
      </Card>
    </form>
  );
}
