'use client';

import { useState, useEffect } from "react";
import * as React from 'react';
import { Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, SelectChangeEvent, Button, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';
import { useReactToPrint } from "react-to-print";
import { message } from 'antd';
import { useRef } from "react";
import { DatePicker } from 'antd';  // Import DatePicker from Ant Design


const { RangePicker } = DatePicker;  // For selecting a range of dates


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
  const [filteredCartData, setFilteredCartData] = useState<Order[]>([]);  // Store filtered cart data
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
          setFilteredCartData(sortedData); // Initially, show all carts
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
    message.success('Lưu trạng thái mới thành công');
  };

  // Function to handle date range filter
  const handleDateFilter = (dates: any) => {
    if (!dates || dates.length === 0) {
      setFilteredCartData(cartData); // Reset filter
      return;
    }
    const [startDate, endDate] = dates;
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);  // Set to the last millisecond of the day
    const filtered = cartData.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });
    setFilteredCartData(filtered);
  };

  const paginatedCarts = filteredCartData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const [showRangePicker, setShowRangePicker] = useState(false);
  const toggleRangePicker = () => {
    setShowRangePicker(!showRangePicker);
  };

  const [selectedCarts, setSelectedCarts] = useState<number[]>([]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const displayedIds = paginatedCarts.map((cart) => cart.id); // Chỉ chọn các giỏ hàng đang hiển thị
      setSelectedCarts(displayedIds);
    } else {
      setSelectedCarts([]); // Bỏ chọn tất cả
    }
  };

  const handleSelectCart = (cartId: number) => {
    setSelectedCarts((prevSelected) =>
      prevSelected.includes(cartId)
        ? prevSelected.filter((id) => id !== cartId) // Bỏ chọn nếu đã được chọn
        : [...prevSelected, cartId] // Thêm vào danh sách nếu chưa được chọn
    );
  };

  const handleBulkStatusChange = (status: StatusKey) => {
    setSelectedStatus((prevSelected) => {
      const updatedStatus = { ...prevSelected };
      selectedCarts.forEach((cartId) => {
        updatedStatus[cartId] = status; // Gán trạng thái mới cho tất cả các giỏ hàng được chọn
      });
      return updatedStatus;
    });
  };

  const applyBulkStatusChange = async () => {
    // Lặp qua từng giỏ hàng để gọi API cập nhật trạng thái
    await Promise.all(
      selectedCarts.map((cartId) =>
        saveCart(cartId, selectedStatus[cartId] || 'delivered') // Gọi hàm đã có để lưu trạng thái
      )
    );

    message.success('Thay đổi trạng thái thành công!');
    // Xóa danh sách giỏ hàng đã chọn sau khi hoàn thành
    setSelectedCarts([]);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" align="center" fontWeight={"bold"}>QUẢN LÝ TRẠNG THÁI GIỎ HÀNG</Typography>

      <div>
        {/* Nút "Thay đổi trạng thái" hiển thị khi có ít nhất một giỏ hàng được chọn */}
        {selectedCarts.length > 0 && (
          <Box display="flex" justifyContent="flex-end" marginBottom="20px">
            <Select
              value={selectedStatus[selectedCarts[0]] || ''} // Giá trị mặc định
              onChange={(e) => handleBulkStatusChange(e.target.value as StatusKey)}
              displayEmpty
              sx={{
                minWidth: '200px',
                marginRight: '10px',
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
            <Button
              variant="contained"
              color="primary"
              onClick={applyBulkStatusChange}
            >
              Thay đổi trạng thái
            </Button>
          </Box>
        )}
        {/* Container cho nút và RangePicker */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          width="100%"
          marginBottom="20px"
          position="relative"
        >
          {/* Nút Lọc */}
          <Button
            onClick={toggleRangePicker}
            type="primary"
            style={{
              backgroundColor: "#1890ff",
              borderRadius: "25px",
              padding: "12px 30px",
              color: "#fff",
              fontWeight: "600",
              fontSize: "16px",
              transition: "all 0.3s ease",
              boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#40a9ff";
              e.target.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#1890ff";
              e.target.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.15)";
              e.target.style.transform = "scale(1)";
            }}
          >
            Lọc
          </Button>

          {/* RangePicker */}
          <div
            style={{
              position: "absolute",
              left: showRangePicker ? "150px" : "100px", // Di chuyển sang phải khi bật
              opacity: showRangePicker ? 1 : 0, // Hiệu ứng mờ dần
              visibility: showRangePicker ? "visible" : "hidden", // Ẩn khi không hiện
              transition: "all 0.3s ease",
            }}
          >
            <RangePicker
              style={{
                width: "300px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                padding: "10px",
                fontSize: "14px",
                border: "1px solid #d9d9d9",
                transition: "all 0.3s ease",
              }}
              onChange={handleDateFilter}
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
              format="DD/MM/YYYY"
              allowClear
            />
          </div>
        </Box>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <input
                  type="checkbox"
                  checked={
                    paginatedCarts.every((cart) => selectedCarts.includes(cart.id)) &&
                    paginatedCarts.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">SĐT</TableCell>
              <TableCell align="center">Thành tiền</TableCell>
              <TableCell align="center">Phải trả</TableCell>
              <TableCell align="center">Ngày tạo</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCarts.map((cart) => (
              <TableRow key={cart.id}>
                <TableCell align="center">
                  <input
                    type="checkbox"
                    checked={selectedCarts.includes(cart.id)}
                    onChange={() => handleSelectCart(cart.id)}
                  />
                </TableCell>
                <TableCell align="center">{cart.id}</TableCell>
                <TableCell align="center">{cart.phonenum}</TableCell>
                <TableCell align="center">{cart.total.toLocaleString()} VND</TableCell>
                <TableCell align="center">{cart.newTotal.toLocaleString()} VND</TableCell>
                <TableCell align="center">{new Date(cart.createdAt).toLocaleDateString('vi-VN')}</TableCell>
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
              <p>Hóa đơn ngày: {new Date(selectedOrder?.createdAt).toLocaleDateString("vi-vn")}</p>
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
    </Stack >
  );
}
