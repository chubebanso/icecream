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
    const [open, setOpen] = React.useState(false); // Trạng thái mở dialog
    const [currentProduct, setCurrentProduct] = React.useState<Product | null>(null); // Sản phẩm hiện tại đang được chỉnh sửa
    const [updatedData, setUpdatedData] = React.useState({
      category: '',
      name: '',
      price: '',
      unit: '',
      image: '',
      availableForOrder: false,
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
        availableForOrder: product.availableForOrder,
      });
      setOpen(true);
    };

    // Đóng dialog
    const handleClose = () => {
      setOpen(false);
    };

    // Lưu lại dữ liệu sau khi chỉnh sửa (giả sử chỉ thay đổi trong UI)
    const handleSave = () => {
      if (currentProduct) {
        // Thực hiện cập nhật UI hoặc gửi tới API nếu cần
        console.log('Cập nhật sản phẩm:', updatedData);
      }
      setOpen(false);
    };

    const token = localStorage.getItem('custom-auth-token'); // Lấy token từ localStorage

    // Xóa sản phẩm
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
              onChange={(e) => setUpdatedData({ ...updatedData, price: e.target.value })}
              margin="normal"
              type="number"
            />
            <TextField
              label="Đơn vị"
              fullWidth
              value={updatedData.unit}
              onChange={(e) => setUpdatedData({ ...updatedData, unit: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Danh mục"
              fullWidth
              value={updatedData.category}
              onChange={(e) => setUpdatedData({ ...updatedData, category: e.target.value })}
              margin="normal"
            />
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
