'use client';

import { useState, useEffect } from "react";
import * as React from 'react';
import { Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, SelectChangeEvent, Button, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

const statusMap = {
  delivered: { label: 'Đã thanh toán', color: '#4CAF50' }, // green
  refunded: { label: 'Hủy đơn', color: '#F44336' }, // red
} as const;

type StatusKey = keyof typeof statusMap;

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  availableForOrder: boolean;
}

interface Voucher {
  id: number;
  voucherType: string;
  voucherName: string;
  discountAmount: number;
  minActivationValue: number;
  createdDate: string;
  expiredDate: string;
}

interface OrderItem {
  id: number;
  product: Product;
  productQuantity: number;
  subTotal: number;
}

interface Order {
  id: number;
  phonenum: string;
  sum: number;
  voucher?: Voucher | null;
  status: StatusKey;
  createdAt: string;
  total: number;
  newTotal: number;
  items: OrderItem[];
}

export default function CartPage(): React.JSX.Element {
  const [cartData, setCartData] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<{ [key: number]: StatusKey }>({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([]); // Store selected order items
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);  // To store selected order for invoice details
  const contentRef = useRef<HTMLTableElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handlePrintClick = () => {
    reactToPrintFn();
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleStatusChange = (event: SelectChangeEvent, orderId: number) => {
    const newStatus = event.target.value as StatusKey;
    setSelectedStatus((prevSelected) => ({
      ...prevSelected,
      [orderId]: newStatus,
    }));
  };

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
          // Sắp xếp mảng cartData theo id giảm dần
          const sortedData = data.data.sort((a: Order, b: Order) => b.id - a.id);
          setCartData(sortedData);
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

  useEffect(() => {
    fetchCartData();
  }, []);

  const saveCart = async (cartId: number, status: StatusKey) => {
    const token = localStorage.getItem('custom-auth-token');
    if (token) {
      try {
        const statusMapToString: { [key in StatusKey]: string } = {
          delivered: 'delivered',
          refunded: 'refunded',
        };

        const statusParam = statusMapToString[status];  // Convert status to string

        const response = await fetch(`http://localhost:8080/admin/pay-cart?cart_id=${cartId}&status=${statusParam}`, {
          method: 'POST',  // You can change it to PUT if required by your API
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          console.log('Cart updated successfully');
          setCartData((prevData) =>
            prevData.map((cart) =>
              cart.id === cartId ? { ...cart, status: status } : cart
            )
          );
        } else {
          console.error('Failed to update cart');
        }
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    } else {
      console.error('Token is missing');
    }
  };

  const handleOpen = (orderId: number) => {
    const order = cartData.find((cart) => cart.id === orderId);
    if (order) {
      setSelectedOrderItems(order.items); // Set the items of the selected order
      setSelectedOrder(order); // Store the full order for invoice data
      setOpen(true);
    }
  };

  const handleSaveStatus = (cartId: number) => {
    const status = selectedStatus[cartId] || null; // Default to 'pending' if not selected
    saveCart(cartId, status);
  };

  const paginatedCarts = cartData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">QUẢN LÝ TRẠNG THÁI GIỎ HÀNG</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">SĐT</TableCell>
              <TableCell align="center">Thành tiền</TableCell>
              <TableCell align="center">Phải trả</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCarts.map((cart) => (
              <TableRow key={cart.id}>
                <TableCell align="center">{cart.id}</TableCell>
                <TableCell align="center">{cart.phonenum}</TableCell>
                <TableCell align="center">{cart.total.toLocaleString()} VND</TableCell>
                <TableCell align="center">{cart.newTotal.toLocaleString()} VND</TableCell>
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
                <TableCell>
                  <center>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleSaveStatus(cart.id)}
                    >
                      Lưu
                    </Button>
                    <span> </span>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpen(cart.id)}
                    >
                      Hóa đơn
                    </Button>
                  </center>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={cartData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Chi tiết giỏ hàng</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ fontWeight: 'bold', }}>Tên sản phẩm</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold', }}>Số lượng</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold', }}>Thành tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedOrderItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell align="center">{item.product.name}</TableCell>
                    <TableCell align="center">{item.productQuantity}</TableCell>
                    <TableCell align="center">{item.subTotal.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Huỷ</Button>
          <Button variant="contained" onClick={handlePrintClick}>In hóa đơn</Button>
          <div className="printable-content" ref={contentRef}>
            <div className="header">
              <h1>Nhà hàng Thủy Tạ</h1>
              <p>Địa chỉ: 1 P. Lê Thái Tổ, Hàng Trống, Hoàn Kiếm, Hà Nội</p>
              <p>Điện thoại: 024 3828 8148</p>
              <p>-------------------------------------------------------</p>
              <h2>HÓA ĐƠN</h2>
              <p>Hóa đơn ngày: {selectedOrder?.createdAt}</p>
              <p>Số điện thoại khách hàng: {selectedOrder?.phonenum}</p>
            </div>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow style={{
                    border: '2px solid black', // Thêm border dưới hàng đầu tiên
                  }}>
                    <TableCell style={{ fontWeight: 'bold' }}>Tên sản phẩm</TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>SL</TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Đơn giá</TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedOrderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell align="center">{item.productQuantity}</TableCell>
                      <TableCell align="center">{item.product.price.toLocaleString()}</TableCell>
                      <TableCell align="center">{item.subTotal.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}

                  <TableRow>
                    <TableCell colSpan={3} align="right" style={{ fontWeight: 'bold' }}>
                      Tổng thanh toán:
                    </TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>
                      {selectedOrderItems.reduce((total, item) => total + item.subTotal, 0).toLocaleString()} VND
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right" style={{ fontWeight: 'bold' }}>
                      Chiết khẩu:
                    </TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>
                      {selectedOrder?.voucher?.discountAmount
                        ? `${selectedOrder.voucher.discountAmount}%`
                        : 'Không sử dụng'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right" style={{ fontWeight: 'bold' }}>
                      Thành tiền:
                    </TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>
                      {selectedOrder?.newTotal.toLocaleString()} VND
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="footer">
                <p>-------------------------------------------------------</p>
                <h3>Cảm ơn quý khách và hẹn gặp lại!</h3>
              </div>
            </TableContainer>

          </div>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
