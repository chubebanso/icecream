'use client';

import * as React from 'react';
import { Button, Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Basket as BasketIcon } from '@phosphor-icons/react/dist/ssr/Basket'; // Chú ý: thay CartIcon bằng BasketIcon

export default function CartPage(): React.JSX.Element {
  const [cartData, setCartData] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchCartData = async () => {
      const token = localStorage.getItem('custom-auth-token');
      if (token) {
        try {
          const response = await fetch('http://localhost:8080/cart', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setCartData(data.data);
          } else {
            console.error('Failed to fetch cart data');
          }
        } catch (error) {
          console.error('Error fetching cart data:', error);
        }
      } else {
        console.error('Token is missing');
      }
    };

    fetchCartData();
  }, []);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Quản lý giỏ hàng</Typography>
        </Stack>
      </Stack>

      <center>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">SĐT</TableCell>
                <TableCell align="center">Thành tiền</TableCell>
                <TableCell align="center">Voucher</TableCell>
                <TableCell align="center">Phải trả</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartData.map((cart) => (
                <TableRow key={cart.id}>
                  <TableCell align="center">{cart.id}</TableCell>
                  <TableCell align="center">{cart.phonenum}</TableCell>
                  <TableCell align="center">{cart.total} VND</TableCell>
                  <TableCell align="center">{cart.voucher ? cart.voucher.code : 'Không có'}</TableCell>
                  <TableCell align="center">{cart.newTotal} VND</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </center>

    </Stack>
  );
}
