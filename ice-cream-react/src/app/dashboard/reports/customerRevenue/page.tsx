'use client';

import * as React from 'react';
import { Button, Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Divider, TablePagination } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import { useRef } from "react";
import PrintIcon from "@mui/icons-material/Print";


export default function CartPage(): React.JSX.Element {
  const contentRef = useRef<HTMLTableElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [cartData, setCartData] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchCartData = async () => {
      const token = localStorage.getItem('custom-auth-token');
      if (token) {
        try {
          const response = await fetch('http://localhost:8080/stats/customer-stats/all', {
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Dữ liệu cứng đã được thêm nhiều giỏ hàng


  const paginatedCarts = cartData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // State để lưu trữ giá trị ngày bắt đầu và kết thúc lọc
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  // Hàm lọc theo ngày
  const filterByDate = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!startDate || !endDate) {
      return cartData; // Nếu không có giá trị lọc, trả về tất cả dữ liệu
    }

    return cartData.filter(cart => {
      return cart.date >= start && cart.date <= end;
    });
  };


  const filteredCartData = filterByDate();

  return (
    <Stack spacing={3}>
      {/* Nút in báo cáo ở trên cùng */}
      <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ marginBottom: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PrintIcon />}
          sx={{
            backgroundColor: "#4CAF50",
            "&:hover": {
              backgroundColor: "#45a049",
            },
            textTransform: "capitalize",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
          onClick={() => reactToPrintFn("day")}
        >
          In báo cáo ngày
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PrintIcon />}
          sx={{
            backgroundColor: "#2196F3",
            "&:hover": {
              backgroundColor: "#1976D2",
            },
            textTransform: "capitalize",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
          onClick={() => reactToPrintFn("week")}
        >
          In báo cáo tuần
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PrintIcon />}
          sx={{
            backgroundColor: "#FF5722",
            "&:hover": {
              backgroundColor: "#E64A19",
            },
            textTransform: "capitalize",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
          onClick={() => reactToPrintFn("month")}
        >
          In báo cáo tháng
        </Button>
      </Stack>

      <Stack direction="row" spacing={3} sx={{ marginBottom: 2 }}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4" fontWeight={"bold"} align='center'>DOANH THU THEO KHÁCH HÀNG</Typography>
        </Stack>
      </Stack>

      {/* Input chọn ngày */}
      <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }} alignContent={'center'} alignSelf={'center'}>
        <TextField
          label="Ngày bắt đầu"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Ngày kết thúc"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button>
          Lọc
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table ref={contentRef}>
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>SĐT</TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>Tổng chi</TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>Số lượng đơn</TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>Số lượng sản phẩm đã mua</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCarts.map((cart) => (
              <TableRow key={cart.id}>
                <TableCell align="center">{cart.phonenum}</TableCell>
                <TableCell align="center">{cart.totalSpent.toLocaleString()} VND</TableCell>
                <TableCell align="center">{cart.totalOrders}</TableCell>
                <TableCell align="center">{cart.amountOrdered}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
    </Stack>
  )
}
