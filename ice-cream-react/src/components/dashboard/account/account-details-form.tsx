'use client';

import React, { useState } from 'react';
import { Card, CardHeader, Divider, CardContent, Stack, FormControl, InputLabel, OutlinedInput, CardActions, Button } from '@mui/material';

const UserProfile = () => {
  const [firstName, setFirstName] = useState('Chó');
  const [lastName, setLastName] = useState('Long Biên');
  const [email, setEmail] = useState('cholongbien99zzvippro@gmail.com');
  const [phone, setPhone] = useState('');

  const handleSave = () => {
    // Xử lý khi nhấn lưu thông tin
    const userInfo = { firstName, lastName, email, phone };
    console.log('Thông tin người dùng:', userInfo);
    // Bạn có thể gọi API để lưu thông tin này vào backend ở đây
  };

  return (
    <Card>
      <CardHeader title="Thông tin đăng nhập" />
      <Divider />
      <CardContent>
        <Stack spacing={3}>
          <FormControl fullWidth required>
            <InputLabel>Họ</InputLabel>
            <OutlinedInput 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              label="First name" 
              name="firstName" 
            />
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel>Tên</InputLabel>
            <OutlinedInput 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              label="Last name" 
              name="lastName" 
            />
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel>Địa chỉ email</InputLabel>
            <OutlinedInput 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              label="Email address" 
              name="email" 
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Số điện thoại</InputLabel>
            <OutlinedInput 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              label="Phone number" 
              name="phone" 
              type="tel" 
            />
          </FormControl>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleSave}>Lưu thông tin</Button>
      </CardActions>
    </Card>
  );
};

export default UserProfile;
