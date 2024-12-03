'use client';

import * as React from 'react';
import { Button, Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Divider, TablePagination, Grid } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import { useRef } from "react";
import CategoryPieChart from '@/components/dashboard/overview/category-pie-chart';
import CategoryPieChartMoney from '@/components/dashboard/overview/category-pie-chart-money';
import PrintIcon from "@mui/icons-material/Print";


export default function CartPage(): React.JSX.Element {
  const contentRef = useRef<HTMLTableElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [categoryStats, setCategoryStats] = React.useState<any[]>([]);

  const [cartData, setCartData] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchCategoryStats = async () => {
      const token = localStorage.getItem('custom-auth-token');
      if (token) {
        try {
          const response = await fetch('http://localhost:8080/category/stats/all', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setCategoryStats(data.data);
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

    fetchCategoryStats();
  }, []);

  React.useEffect(() => {
    const fetchCartData = async () => {
      const token = localStorage.getItem('custom-auth-token');
      if (token) {
        try {
          const response = await fetch('http://localhost:8080/product-stats/all', {
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

  // Pagination for first table
  const [page1, setPage1] = React.useState(0);
  const [rowsPerPage1, setRowsPerPage1] = React.useState(5);

  const handleChangePage1 = (event: unknown, newPage: number) => {
    setPage1(newPage);
  };

  const handleChangeRowsPerPage1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage1(parseInt(event.target.value, 10));
    setPage1(0);
  };

  const paginatedCarts1 = cartData.slice(page1 * rowsPerPage1, page1 * rowsPerPage1 + rowsPerPage1);

  // Pagination for second table
  const [page2, setPage2] = React.useState(0);
  const [rowsPerPage2, setRowsPerPage2] = React.useState(5);

  const handleChangePage2 = (event: unknown, newPage: number) => {
    setPage2(newPage);
  };

  const handleChangeRowsPerPage2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage2(parseInt(event.target.value, 10));
    setPage2(0);
  };

  const paginatedCarts2 = categoryStats.slice(page2 * rowsPerPage2, page2 * rowsPerPage2 + rowsPerPage2);

  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  const filterByDate = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!startDate || !endDate) {
      return cartData;
    }

    return cartData.filter(cart => {
      return cart.date >= start && cart.date <= end;
    });
  };

  const filteredCartData = filterByDate();

  // Top 5 carts based on total spent
  const top5Carts = [...cartData].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

  return (
    <Stack spacing={3}>
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


      {/* Input chọn ngày */}
      <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }} justifyContent="center">
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
        <Button onClick={filterByDate}>Lọc</Button>
      </Stack>

      <Grid container spacing={4} justifyContent="center" alignItems={"center"}>
        <Grid item xs={12} sm={6} md={5} alignItems={"center"}>
          <Paper sx={{ padding: 2, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '80%', height: '80%' }}>
              <CategoryPieChart data={paginatedCarts2} />
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={5}>
          <Paper sx={{ padding: 2, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '80%', height: '80%' }}>
              <CategoryPieChartMoney data={paginatedCarts2} />
            </div>
          </Paper>
        </Grid>
      </Grid>


      {/* Bố cục Grid với 2 bảng bên trái (trên dưới) và 1 bảng top 5 bên phải */}
      <Grid container spacing={3}>
        {/* Cột bên trái - 2 bảng theo chiều dọc */}
        <Grid item xs={12} md={8}>
          <Grid container direction="column" spacing={3}>
            {/* Bảng thống kê 1 */}
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                {/* Nút in báo cáo */}
                <Typography variant="h6" align="center" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                  Thống kê doanh thu theo sản phẩm
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>Sản phẩm</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>Doanh số</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>Doanh thu</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedCarts1.map((cart) => (
                      <TableRow key={cart.id}>
                        <TableCell align="center">{cart.name}</TableCell>
                        <TableCell align="center">{cart.productOrderedQuantity}</TableCell>
                        <TableCell align="center">{cart.productRevenue.toLocaleString()} VND</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Divider />
              <TablePagination
                component="div"
                count={cartData.length}
                page={page1}
                onPageChange={handleChangePage1}
                rowsPerPage={rowsPerPage1}
                onRowsPerPageChange={handleChangeRowsPerPage1}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Grid>

            {/* Bảng thống kê 2 */}
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Typography variant="h6" align="center" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                  Thống kê doanh thu theo danh mục
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>Danh mục sản phẩm</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>Doanh số</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>Doanh thu</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedCarts2.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell align="center">{category.productCategory}</TableCell>
                        <TableCell align="center">{category.productCategoryOrderedQuantity}</TableCell>
                        <TableCell align="center">{category.productCategoryRevenue.toLocaleString()} VND</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Divider />
            </Grid>
          </Grid>
        </Grid>

        {/* Cột bên phải - Bảng Top 5 */}
        <Grid item xs={12} md={4}>
          <TableContainer component={Paper}>
            <Typography variant="h6" align="center" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
              Top 5 sản phẩm bán chạy nhất
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>Tên sản phẩm</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>Doanh số</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {top5Carts.map((cart) => (
                  <TableRow key={cart.id}>
                    <TableCell align="center">{cart.name}</TableCell>
                    <TableCell align="center">{cart.productOrderedQuantity}</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Stack>
  );
}
