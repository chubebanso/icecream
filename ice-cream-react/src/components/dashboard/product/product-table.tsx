'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';

// Định nghĩa cấu trúc dữ liệu cho sản phẩm
export interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  availableForOrder: boolean;
}

interface ProductsTableProps {
  count: number; // Tổng số sản phẩm
  page: number; // Trang hiện tại
  rows: Product[]; // Danh sách sản phẩm hiển thị
  rowsPerPage: number; // Số hàng mỗi trang
  onPageChange: (newPage: number) => void; // Hàm xử lý thay đổi trang
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Hàm xử lý thay đổi số hàng
}

export function ProductsTable({
  count,
  rows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: ProductsTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => rows.map((product) => product.id), [rows]);

  const token = localStorage.getItem('token'); // Lấy token từ localStorage

  const handleEdit = async (id: string) => {
    const updatedData = {
      // Thêm thông tin cần cập nhật
      name: 'Tên sản phẩm mới',
      price: 100000,
    };

    try {
      const response = await fetch(`http://localhost:8080/update/product/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`Lỗi HTTP! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Cập nhật thành công:', data);
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/delete/product/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi HTTP! status: ${response.status}`);
      }

      console.log(`Xóa thành công sản phẩm với ID: ${id}`);
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
    }
  };

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>

              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Đơn vị</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell><center>Thao tác</center></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow hover key={row.id}>
                  <TableCell>
                    <Avatar src={`/assets/admin/${row.image}`} alt={row.name} />
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.price.toLocaleString()} VND</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>
                    <center>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(row.id)}
                        sx={{ marginRight: 1 }}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(row.id)}
                      >
                        Xóa
                      </Button>
                    </center>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(event, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
