"use client";

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const statusMap = {
  pending: { label: 'Đang chờ', color: 'warning' },
  delivered: { label: 'Đã thanh toán', color: 'success' },
  refunded: { label: 'Hủy đơn', color: 'error' },
} as const;

interface Order {
  id: number;
  phonenum: string;
  sum: number;
  total: number; // Tổng tiền
  status: 'pending' | 'delivered' | 'refunded';
  createdAt: Date;
}

export function LatestOrders({ sx }: { sx?: any }): React.JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Lấy token từ Local Storage
    const token = localStorage.getItem('custom-auth-token');

    // Gọi API với token trong header
    fetch('http://localhost:8080/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Lỗi khi gọi API');
        }
        return response.json();
      })
      .then((data) => {
        const carts = data.data;

        // Chuyển đổi dữ liệu API thành định dạng cần thiết
        const formattedOrders: Order[] = carts.map((cart: any) => ({
          id: cart.id,
          phonenum: cart.phonenum,
          sum: cart.sum,
          total: cart.total, // Lấy tổng tiền từ API
          status: cart.submit ? 'delivered' : 'pending',
          createdAt: new Date(),
        }));

        setOrders(formattedOrders); // Cập nhật state
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API:', error);
      });
  }, []);

  return (
    <Card sx={sx}>
      <CardHeader title="Đơn hàng gần đây" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Tổng sản phẩm</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => {
              const { label, color } = statusMap[order.status] ?? { label: 'Unknown', color: 'default' };

              return (
                <TableRow hover key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.phonenum}</TableCell>
                  <TableCell>{order.sum}</TableCell>
                  <TableCell>{order.total.toLocaleString()} VND</TableCell>
                  <TableCell>
                    <Chip color={color} label={label} size="small" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="inherit" size="small" variant="text">
          Xem tất cả
        </Button>
      </CardActions>
    </Card>
  );
}
