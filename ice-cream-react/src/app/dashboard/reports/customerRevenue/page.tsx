'use client';

import * as React from 'react';
import { Button, Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider, TablePagination, TableFooter } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import { useRef } from "react";
import PrintIcon from "@mui/icons-material/Print";
import * as XLSX from 'xlsx';
import { Dropdown, Menu } from "antd";
import { DownOutlined, PrinterOutlined, FileExcelOutlined } from "@ant-design/icons";

export default function CartPage(): React.JSX.Element {
  const contentRef = useRef<HTMLTableElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [cartData, setCartData] = React.useState<any[]>([]);

  const handlePrintClick = () => {
    reactToPrintFn();
  };

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

  const paginatedCarts = cartData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
    const excelData = cartData.map(cart => ({
      'STT': cart.id,
      'SĐT': cart.phonenum,
      'Tổng chi': cart.totalSpent,
      'Số lượng đơn': cart.totalOrders,
      'Số lượng sản phẩm đã mua': cart.amountOrdered,
    }));

    // Tạo sheet từ dữ liệu
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Tạo workbook và thêm sheet vào
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'CustomerStats');

    // Xuất file Excel
    XLSX.writeFile(workbook, 'DoanhThuKhachHang.xlsx');
  };

  return (
    <Stack spacing={3}>

      {/* Nút in báo cáo ở trên cùng */}
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
            <h2>
              BÁO CÁO DOANH THU THEO KHÁCH HÀNG
            </h2>
            <p>Từ: ... / ... / ...... <span style={{ color: 'white' }}>aduanhlambeovklbeo</span>Đến: ... / ... / ...... </p>
          </center>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ fontWeight: 'bold', border: '1px solid black', padding: '8px' }}>
                  STT
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', border: '1px solid black', padding: '8px' }}>
                  SĐT
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', border: '1px solid black', padding: '8px' }}>
                  Tổng chi
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', border: '1px solid black', padding: '8px' }}>
                  Số lượng đơn
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', border: '1px solid black', padding: '8px' }}>
                  Số lượng sản phẩm đã mua
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCarts.map((cart) => (
                <TableRow key={cart.id}>
                  <TableCell align="center" style={{ border: '1px solid black', padding: '8px' }}>
                    {cart.id}
                  </TableCell>
                  <TableCell align="center" style={{ border: '1px solid black', padding: '8px' }}>
                    {cart.phonenum}
                  </TableCell>
                  <TableCell align="center" style={{ border: '1px solid black', padding: '8px' }}>
                    {cart.totalSpent.toLocaleString()} VND
                  </TableCell>
                  <TableCell align="center" style={{ border: '1px solid black', padding: '8px' }}>
                    {cart.totalOrders}
                  </TableCell>
                  <TableCell align="center" style={{ border: '1px solid black', padding: '8px' }}>
                    {cart.amountOrdered}
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
                  {paginatedCarts.reduce((total, cart) => total + cart.totalSpent, 0).toLocaleString()} VND
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
                  {paginatedCarts.reduce((total, cart) => total + cart.totalOrders, 0).toLocaleString()}
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
                  {paginatedCarts.reduce((total, cart) => total + cart.amountOrdered, 0).toLocaleString()}
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
            <span style={{ color: 'white' }}>------------------------------------------------------------------------------------------------------------------------------------------</span>
            Người thực hiện
            <span style={{ color: 'white' }}>------------------------------------------------------------------------------------------------------------------------------------------------------</span>
            (Ký và ghi rõ họ tên)
            <span style={{ color: 'white' }}>-------------------------------------------------------------------------------------------------------------------------------------------</span>
            <span style={{ color: 'white' }}>-------------------------------------------------------------------------------------------------------------------------------------------</span>
            <span style={{ color: 'white' }}>-------------------------------------------------------------------------------------------------------------------------------------------</span>
            <span style={{ color: 'white' }}>-------------------------------------------------------------------------------------------------------------------------------------------</span>
            <span style={{ color: 'white' }}>-------------------------------------------------------------------------------------------------------------------------------------------</span>
            <span style={{ color: 'white' }}>-------------------------------------------------------------------------------------------------------------------------------------------</span>
            <span style={{ color: 'white' }}>-------------------------------------------------------------------------------------------------------------------------------------------</span>
            <span style={{ color: 'white' }}>-------------------------------------------------------------------------------------------------------------------------------------------</span>
            <span style={{ color: 'white' }}>-------------------------------------------------------------------------------------------------------------------------------------------</span>
            <span style={{ color: 'white' }}>-------------------------------------------------------------------------------------------------------------------------------------------</span>

          </div>
        </div>
      </Stack>

      <Stack direction="row" spacing={3} sx={{ marginBottom: 2 }}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4" fontWeight={"bold"} align='center'>DOANH THU THEO KHÁCH HÀNG</Typography>
        </Stack>
      </Stack>


      <TableContainer component={Paper}>
        <Table>
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
