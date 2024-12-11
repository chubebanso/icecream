'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { MenuItem } from '@mui/material';
import { message } from 'antd'; // Import Ant Design message

// Định nghĩa cấu trúc dữ liệu cho sản phẩm
export interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  unit: string;
  category: string;
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
  const [open, setOpen] = React.useState(false); // Trạng thái mở dialog
  const [currentProduct, setCurrentProduct] = React.useState<Product | null>(null); // Sản phẩm hiện tại đang được chỉnh sửa
  const [updatedData, setUpdatedData] = React.useState({
    category: '',
    name: '',
    price: '',
    unit: '',
    image: '',
  }); // Dữ liệu mới sau khi chỉnh sửa

  // Mở dialog và điền thông tin sản phẩm vào form
  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setUpdatedData({
      category: product.category,
      name: product.name,
      price: product.price.toString(),
      unit: product.unit,
      image: product.image,
    });
    setOpen(true);
  };

  // Đóng dialog
  const handleClose = () => {
    setOpen(false);
  };

  const token = localStorage.getItem('custom-auth-token'); // Lấy token từ localStorage

  // Xóa sản phẩm
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/hide-product?product_id=${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi HTTP! status: ${response.status}`);
      }

      console.log(`Xóa thành công sản phẩm với ID: ${id}`);
      message.success('Ẩn sản phẩm thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
    }
  };

  const handleSave = async () => {
    if (currentProduct) {
      try {
        // Gửi dữ liệu cập nhật đến API
        const response = await fetch(`http://localhost:8080/update/product/${currentProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
          body: JSON.stringify({
            ...updatedData,
            price: parseFloat(updatedData.price), // Chuyển giá sang số
          }),
        });

        if (!response.ok) {
          throw new Error(`Lỗi HTTP! status: ${response.status}`);
        }

        const updatedProduct = await response.json();
        console.log('Cập nhật thành công:', updatedProduct);

        // Hiển thị thông báo thành công
        message.success('Đã lưu thông tin!');

        // Cập nhật UI nếu cần (giả lập cập nhật trong bảng)
        const updatedRows = rows.map((row) =>
          row.id === currentProduct.id ? { ...row, ...updatedData } : row
        );
        setCurrentProduct(null);
        setRows(updatedRows);
      } catch (error) {
        console.error('Lỗi khi lưu thông tin:', error);
      }
    }

    setOpen(false); // Đóng dialog
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
                        onClick={() => handleEdit(row)} // Sửa khi bấm nút Sửa
                        sx={{ marginRight: 1 }}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(row.id)} // Xóa khi bấm Xóa
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

      {/* Dialog để sửa sản phẩm */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Sửa sản phẩm</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên sản phẩm"
            fullWidth
            value={updatedData.name}
            onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Giá"
            fullWidth
            value={updatedData.price}
            onChange={(e) => {
              const value = Math.max(1, e.target.value); // Giới hạn giá trị không âm và không bằng 0
              setUpdatedData({ ...updatedData, price: value });
            }}
            margin="normal"
            type="number"
            inputProps={{
              min: "1", // Giá trị không nhỏ hơn 1
              step: "1000", // Mỗi lần thay đổi giá trị là 1000
            }}
          />
          <TextField
            label="Đơn vị"
            fullWidth
            value={updatedData.unit}
            onChange={(e) => setUpdatedData({ ...updatedData, unit: e.target.value })}
            margin="normal"
            select
          >
            {['ly', 'chai', 'chiếc', 'que', 'hộp'].map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Danh mục"
            fullWidth
            value={updatedData.category}
            onChange={(e) => setUpdatedData({ ...updatedData, category: e.target.value })}
            margin="normal"
            select
          >
            {['Bánh trung thu', 'Nước', 'Kem'].map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSave} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

    </Card>
  );
}
