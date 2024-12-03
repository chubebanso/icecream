'use client';

import * as React from 'react';
import { Button, Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Divider, TablePagination, TableFooter } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import { useRef } from "react";
import PrintIcon from "@mui/icons-material/Print";
import { TimesUsedChart, VoucherRevenueChart } from "@/components/dashboard/vouchers/chart";

export default function CartPage(): React.JSX.Element {
  const contentRef = useRef<HTMLTableElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [cartData, setCartData] = React.useState<any[]>([]);
  const [voucherData, setVoucherData] = React.useState<any[]>([]);

  const timesUsedData = voucherData.map(item => ({
    minActivationValue: item.minActivationValue,
    timesUsed: item.timesUsed,
  }));

  // Chuyển đổi dữ liệu cho biểu đồ VoucherRevenueChart
  const voucherRevenueData = voucherData.map(item => ({
    minActivationValue: item.minActivationValue,
    revenue: item.revenue,
  }));

  React.useEffect(() => {
    const fetchCartData = async () => {
      const token = localStorage.getItem('custom-auth-token');
      if (token) {
        try {
          const response = await fetch('http://localhost:8080/voucher-stats/all', {
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

  React.useEffect(() => {
    const fetchVoucherData = async () => {
      const token = localStorage.getItem('custom-auth-token');
      if (token) {
        try {
          const response = await fetch('http://localhost:8080/voucher-values/all', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setVoucherData(data.data);
          } else {
            console.error('Failed to fetch category stats');
          }
        } catch (error) {
          console.error('Error fetching category stats:', error);
        }
      } else {
        console.error('Token is missing');
      }
    };

    fetchVoucherData();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Dữ liệu cứng đã được thêm nhiều giỏ hàng


  const paginatedCarts = cartData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const handlePrintClick = () => {
    reactToPrintFn();
  };

  return (
    <Stack spacing={3}>
      {/* Nút in báo cáo ở trên cùng */}
      <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ marginBottom: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PrintIcon />}
          sx={{
            backgroundColor: "#2196F3",
            "&:hover": {
              backgroundColor: "#1976D2",
            },
            fontWeight: "bold",
            padding: "10px 20px",
          }}
          onClick={handlePrintClick}
        >
          In báo cáo
        </Button>
        <div className="custom-report" ref={contentRef}>
          <div className="report-header">
            <img
              src="https://thuyta.vn/wp-content/uploads/2021/03/Logo-Thuy-Ta-Legend-01.png" /* Thay bằng URL hoặc đường dẫn ảnh thật */
              alt="Nhà hàng Thủy Tạ"
              className="report-logo"
            />
            <div className="report-info" style={{ marginBottom: '20px' }}>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>NHÀ HÀNG THỦY TẠ</h1>
              <p style={{ margin: 0 }}>
                <strong>Địa chỉ:</strong> Nhà hàng Thủy Tạ, 1 P. Lê Thái Tổ, Hàng Trống, Hoàn Kiếm, Hà Nội
              </p>
              <p style={{ margin: 0 }}>
                <strong>Số điện thoại:</strong> 024 3828 8148
              </p>
            </div>
          </div>

          {/* Tiêu đề báo cáo */}
          <center>
            <h2>
              BÁO CÁO DOANH THU THEO SẢN PHẨM
            </h2>
          </center>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ fontWeight: 'bold', border: '1px solid black' }}>
                  Tên voucher
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', border: '1px solid black' }}>
                  Giá trị kích hoạt
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', border: '1px solid black' }}>
                  Phần trăm giảm giá
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', border: '1px solid black' }}>
                  Số lần sử dụng
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', border: '1px solid black' }}>
                  Doanh thu mang lại
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCarts.map((cart) => (
                <TableRow key={cart.id}>
                  <TableCell align="center" style={{ border: '1px solid black' }}>
                    {cart.voucherName}
                  </TableCell>
                  <TableCell align="center" style={{ border: '1px solid black' }}>
                    {cart.minActivationValue.toLocaleString()} VND
                  </TableCell>
                  <TableCell align="center" style={{ border: '1px solid black' }}>
                    {cart.discountAmount}
                  </TableCell>
                  <TableCell align="center" style={{ border: '1px solid black' }}>
                    {cart.timesUsed}
                  </TableCell>
                  <TableCell align="center" style={{ border: '1px solid black' }}>
                    {cart.voucherRevenue.toLocaleString()} VND
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            {/* Dòng TỔNG CỘNG */}
            <TableFooter>
              <TableRow>
                <TableCell
                  align="center"
                  colSpan={3}
                  style={{
                    fontWeight: 'bold',
                    border: '1px solid black',
                    color: 'black', // Đổi màu chữ thành đen
                    fontSize: 'inherit', // Giữ cỡ chữ như các cell phía trên
                  }}
                >
                  TỔNG CỘNG
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    fontWeight: 'bold',
                    border: '1px solid black',
                    color: 'black', // Đổi màu chữ thành đen
                    fontSize: 'inherit', // Giữ cỡ chữ như các cell phía trên
                  }}
                >
                  {paginatedCarts.reduce((total, cart) => total + cart.timesUsed, 0).toLocaleString()}
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    fontWeight: 'bold',
                    border: '1px solid black',
                    color: 'black', // Đổi màu chữ thành đen
                    fontSize: 'inherit', // Giữ cỡ chữ như các cell phía trên
                  }}
                >
                  {paginatedCarts.reduce((total, cart) => total + cart.voucherRevenue, 0).toLocaleString()} VND
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Stack>


      <Stack direction="row" spacing={3} sx={{ marginBottom: 2 }}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4" fontWeight={"bold"} align='center'>DOANH THU THEO CHƯƠNG TRÌNH KHUYẾN MÃI</Typography>
        </Stack>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>Tên voucher</TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>Giá trị kích hoạt</TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>Phần trăm giảm giá</TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>Số lần sử dụng</TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>Doanh thu mang lại</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCarts.map((cart) => (
              <TableRow key={cart.id}>
                <TableCell align="center">{cart.voucherName}</TableCell>
                <TableCell align="center">{cart.minActivationValue.toLocaleString()} VND</TableCell>
                <TableCell align="center">{cart.discountAmount}%</TableCell>
                <TableCell align="center">{cart.timesUsed}</TableCell>
                <TableCell align="center">{cart.voucherRevenue.toLocaleString()} VND</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Divider />
        <TablePagination
          component="div"
          count={cartData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />;
      </TableContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ width: '48%' }}>
          <TimesUsedChart data={timesUsedData} />
        </div>
        <div style={{ width: "48%" }}>
          <VoucherRevenueChart data={voucherRevenueData} />
        </div>
      </div>
    </Stack>
  )
}
