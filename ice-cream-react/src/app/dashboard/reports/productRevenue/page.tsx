'use client';

import * as React from 'react';
import { Button, Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Divider, TablePagination, Grid, TableFooter } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import { useRef } from "react";
import CategoryPieChart from '@/components/dashboard/overview/category-pie-chart';
import CategoryPieChartMoney from '@/components/dashboard/overview/category-pie-chart-money';
import ProductPieChart from '@/components/dashboard/overview/product-pie-chart';
import ProductMoneyPie from '@/components/dashboard/overview/product-money-pie';
import PrintIcon from "@mui/icons-material/Print";
import * as XLSX from 'xlsx';
import { Dropdown, Menu } from "antd";
import { DownOutlined, PrinterOutlined, FileExcelOutlined } from "@ant-design/icons";

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

  // Top 5 carts based on total spent
  const top5Carts = [...cartData].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);


  const handlePrintClick = () => {
    reactToPrintFn();
  };

  const handleMenuClick = ({ key }) => {
    if (key === "print") {
      handlePrintClick();
    } else if (key === "excel") {
      handleExportExcel();
    }
  };

  const menu = (
    <Menu
      onClick={handleMenuClick}
      style={{
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        padding: '5px',
        fontSize: '15px', // Kích thước chữ lớn hơn
      }}
      items={[
        {
          key: "print",
          label: (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 15px',
            }}>
              <PrinterOutlined style={{ fontSize: '18px', color: '#4CAF50' }} />
              <span style={{ fontWeight: 'bold', color: '#333' }}>In báo cáo</span>
            </div>
          ),
        },
        {
          key: "excel",
          label: (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 15px',
            }}>
              <FileExcelOutlined style={{ fontSize: '18px', color: '#0F9D58' }} />
              <span style={{ fontWeight: 'bold', color: '#333' }}>Xuất Excel</span>
            </div>
          ),
        },
      ]}
    />
  );

  const handleExportExcel = () => {
    // Chuẩn bị dữ liệu để xuất
    const excelData1 = cartData.map(cart => ({
      'Số thứ tự': cart.id,
      'Tên sản phẩm': cart.name,
      'Doanh số': cart.productOrderedQuantity,
      'Doanh thu': cart.productRevenue,
    }));

    const excelData2 = categoryStats.map(category => ({
      'Số thứ tự': category.id,
      'Tên sản phẩm': category.productCategory,
      'Doanh số': category.productCategoryOrderedQuantity,
      'Doanh thu': category.productCategoryRevenue,
    }));

    // Tạo sheet từ dữ liệu
    const worksheet1 = XLSX.utils.json_to_sheet(excelData1);
    const worksheet2 = XLSX.utils.json_to_sheet(excelData2);

    // Tạo workbook và thêm sheet vào
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet1, 'ProductStats');
    XLSX.utils.book_append_sheet(workbook, worksheet2, 'CategoryStats');

    // Xuất file Excel
    XLSX.writeFile(workbook, 'DoanhThuSanPhamvaDanhMuc.xlsx');
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ marginBottom: 2 }}>
        <Dropdown
          overlay={menu}
          trigger={['click']}
          overlayStyle={{
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            padding: '5px',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            type="primary"
            startIcon={<PrintIcon />}
            sx={{
              backgroundColor: "#4CAF50", // Màu xanh nhấn mạnh
              color: "#fff",
              borderRadius: "8px", // Bo góc
              textTransform: "none", // Không viết hoa toàn bộ
              fontWeight: "bold",
              fontSize: "16px", // Kích thước chữ lớn hơn
              padding: "10px 24px",
              "&:hover": {
                backgroundColor: "#45A049", // Màu nhấn khi hover
              },
            }}
          >
            Xuất dữ liệu <span style={{ color: '#4CAF50' }}>_</span> <DownOutlined />
          </Button>
        </Dropdown>
        <div className="custom-report" ref={contentRef}>
          <div className="report-header">
            <img
              src="https://thuyta.vn/wp-content/uploads/2021/03/Logo-Thuy-Ta-Legend-01.png" /* Thay bằng URL hoặc đường dẫn ảnh thật */
              alt="Nhà hàng Thủy Tạ"
              className="report-logo"
            />
            <div className="report-info" style={{ marginBottom: '20px' }}>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>NHÀ HÀNG THỦY TẠ</h1>
              <p style={{ margin: 0, fontSize: '14px' }}>
                <strong>Địa chỉ:</strong> Nhà hàng Thủy Tạ, 1 P. Lê Thái Tổ, Hàng Trống, Hoàn Kiếm, Hà Nội
              </p>
              <p style={{ margin: 0, fontSize: '14px' }}>
                <strong>Số điện thoại:</strong> 024 3828 8148
              </p>
            </div>
          </div>

          {/* Tiêu đề báo cáo */}
          <center>
            <p>Từ: ... / ... / ...... <span style={{ color: 'white' }}>aduanhlambeovklbeo</span>Đến: ... / ... / ...... </p>
            <h2>
              BÁO CÁO DOANH THU THEO SẢN PHẨM
            </h2>
          </center>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ fontWeight: 'bold', border: '1px solid black', padding: '8px', width: '50px' }}>
                  STT
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', border: '1px solid black', padding: '8px', width: '150px' }}>
                  Tên sản phẩm
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', border: '1px solid black', padding: '8px', width: '150px' }}>
                  Doanh số
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', border: '1px solid black', padding: '8px', width: '150px' }}>
                  Doanh thu mang lại
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCarts1.map((cart) => (
                <TableRow key={cart.id}>
                  <TableCell align="center" style={{ border: '1px solid black', padding: '8px' }}>
                    {cart.id}
                  </TableCell>
                  <TableCell align="center" style={{ border: '1px solid black', padding: '8px' }}>
                    {cart.name}
                  </TableCell>
                  <TableCell align="center" style={{ border: '1px solid black', padding: '8px' }}>
                    {cart.productOrderedQuantity}
                  </TableCell>
                  <TableCell align="center" style={{ border: '1px solid black', padding: '8px' }}>
                    {cart.productRevenue.toLocaleString()} VND
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            {/* Dòng TỔNG CỘNG */}
            <TableFooter>
              <TableRow>
                <TableCell
                  align="center"
                  colSpan={2}
                  style={{
                    fontWeight: 'bold',
                    border: '1px solid black',
                    color: 'black', // Đổi màu chữ thành đen
                    fontSize: 'inherit', padding: '8px' // Giữ cỡ chữ như các cell phía trên
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
                    fontSize: 'inherit', padding: '8px' // Giữ cỡ chữ như các cell phía trên
                  }}
                >
                  {paginatedCarts1.reduce((total, cart) => total + cart.productOrderedQuantity, 0).toLocaleString()}
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    fontWeight: 'bold',
                    border: '1px solid black',
                    color: 'black', // Đổi màu chữ thành đen
                    fontSize: 'inherit', padding: '8px' // Giữ cỡ chữ như các cell phía trên
                  }}
                >
                  {paginatedCarts1.reduce((total, cart) => total + cart.productRevenue, 0).toLocaleString()} VND
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          {/* Tiêu đề báo cáo */}
          <center>
            <h2>
              BÁO CÁO DOANH THU THEO DANH MỤC
            </h2>
          </center>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ fontWeight: 'bold', border: '1px solid black', padding: '8px', width: '150px' }}>
                  Tên danh mục
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', border: '1px solid black', padding: '8px' }}>
                  Doanh số
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', border: '1px solid black', padding: '8px' }}>
                  Doanh thu mang lại
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCarts2.map((cart) => (
                <TableRow key={cart.id}>
                  <TableCell align="center" style={{ border: '1px solid black', padding: '8px' }}>
                    {cart.productCategory}
                  </TableCell>
                  <TableCell align="center" style={{ border: '1px solid black', padding: '8px' }}>
                    {cart.productCategoryOrderedQuantity}
                  </TableCell>
                  <TableCell align="center" style={{ border: '1px solid black', padding: '8px' }}>
                    {cart.productCategoryRevenue.toLocaleString()} VND
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            {/* Dòng TỔNG CỘNG */}
            <TableFooter>
              <TableRow>
                <TableCell
                  align="center"
                  colSpan={1}
                  style={{
                    fontWeight: 'bold',
                    border: '1px solid black',
                    color: 'black', // Đổi màu chữ thành đen
                    fontSize: 'inherit', padding: '8px' // Giữ cỡ chữ như các cell phía trên
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
                    fontSize: 'inherit', padding: '8px' // Giữ cỡ chữ như các cell phía trên
                  }}
                >
                  {paginatedCarts2.reduce((total, cart) => total + cart.productCategoryOrderedQuantity, 0).toLocaleString()}
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    fontWeight: 'bold',
                    border: '1px solid black',
                    color: 'black', // Đổi màu chữ thành đen
                    fontSize: 'inherit', padding: '8px' // Giữ cỡ chữ như các cell phía trên
                  }}
                >
                  {paginatedCarts2.reduce((total, cart) => total + cart.productCategoryRevenue, 0).toLocaleString()} VND
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          {/* Dòng ghi ngày tháng ở cuối */}
          <div style={{ textAlign: 'right', marginTop: '20px', fontSize: '18px', fontStyle: 'italic' }}>
            Hà Nội, ngày ... tháng ... năm .......
          </div>
          {/* Dòng "Người thực hiện" */}
          <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '18px', fontWeight: 'bold' }}>
            <span style={{ color: 'white' }}>----------------------------------------------------------------------------------------------------------------------------------------------</span>
            Người thực hiện
            <span style={{ color: 'white' }}>-----------------------------------------------------------------------------------------------------------------------------------------------</span>
            (Ký và ghi rõ họ tên)
          </div>
          <span style={{ color: 'white' }}>-------------------------------------------------------------------------------------------------------------------------------------------</span>
          <span style={{ color: 'white' }}>-------------------------------------------------------------------------------------------------------------------------------------------</span>
          <span style={{ color: 'white' }}>-------------------------------------------------------------------------------------------------------------------------------------------</span>
          <span style={{ color: 'white' }}>-------------------------------------------------------------------------------------------------------------------------------------------</span>
          <span style={{ color: 'white' }}>-------------------------------------------------------------------------------------------------------------------------------------------</span>
        </div>
      </Stack>

      <Grid container spacing={4} justifyContent="center" alignItems={"center"}>
        <Grid item xs={12} sm={6} md={5} alignItems={"center"}>
          <Paper sx={{ padding: 2, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '80%', height: '80%' }}>
              <ProductPieChart data={paginatedCarts1} />
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={5}>
          <Paper sx={{ padding: 2, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '80%', height: '80%' }}>
              <ProductMoneyPie data={paginatedCarts1} />
            </div>
          </Paper>
        </Grid>
      </Grid>

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
    </Stack >
  );
}
