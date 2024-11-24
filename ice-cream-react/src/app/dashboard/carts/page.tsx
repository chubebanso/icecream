'use client';

import * as React from 'react';
import { Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { styled } from '@mui/system';

const statusMap = {
  pending: { label: 'Đang chờ', color: '#FFAA00' }, // màu vàng nhạt
  delivered: { label: 'Đã thanh toán', color: '#4CAF50' }, // màu xanh lá
  refunded: { label: 'Hủy đơn', color: '#F44336' }, // màu đỏ
} as const;

type StatusKey = keyof typeof statusMap; // Định nghĩa kiểu hợp lệ cho status

interface Voucher {
  name: string; // Đảm bảo voucher có thuộc tính `name`
}

interface Order {
  id: number;
  phonenum: string;
  sum: number;
  voucher?: Voucher | null; // Sửa đổi kiểu để voucher là object chứa `name`
  status: StatusKey; // Sử dụng kiểu `StatusKey` cho status
  createdAt: Date;
  total: number; // Giả sử có thuộc tính `total`
  newTotal: number; // Giả sử có thuộc tính `newTotal`
}

export default function CartPage(): React.JSX.Element {
  const [cartData, setCartData] = React.useState<Order[]>([]); // Định nghĩa rõ kiểu dữ liệu giỏ hàng
  const [selectedStatus, setSelectedStatus] = React.useState<{ [key: number]: StatusKey }>({}); // Quản lý trạng thái cho mỗi đơn hàng

  const handleStatusChange = (event: SelectChangeEvent, orderId: number) => {
    const newStatus = event.target.value as StatusKey;
    setCartData((prevData) =>
      prevData.map((cart) =>
        cart.id === orderId ? { ...cart, status: newStatus } : cart
      )
    );
    setSelectedStatus((prevSelected) => ({
      ...prevSelected,
      [orderId]: newStatus,
    }));
  };

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
          <Typography variant="h4">QUẢN LÝ TRẠNG THÁI GIỎ HÀNG</Typography>
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
                <TableCell align="center">Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartData.map((cart) => (
                <TableRow key={cart.id}>
                  <TableCell align="center">{cart.id}</TableCell>
                  <TableCell align="center">{cart.phonenum}</TableCell>
                  <TableCell align="center">{cart.total} VNĐ</TableCell>
                  <TableCell align="center">{cart.voucher ? cart.voucher.name : 'Không có'}</TableCell>
                  <TableCell align="center">{cart.newTotal} VNĐ</TableCell>
                  <TableCell align="center">
                    <Select
                      value={selectedStatus[cart.id] || cart.status}
                      onChange={(e) => handleStatusChange(e, cart.id)}
                      sx={{
                        minWidth: '150px',
                        color: statusMap[selectedStatus[cart.id] || cart.status]?.color || 'black',
                        textTransform: 'none',
                      }}
                    >
                      {Object.entries(statusMap).map(([key, { label, color }]) => (
                        <MenuItem
                          key={key}
                          value={key}
                          sx={{
                            color: color,
                            textTransform: 'none',
                          }}
                        >
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </center>
    </Stack>
  );
}
