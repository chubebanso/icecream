'use client';

import * as React from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Divider,
  InputAdornment,
} from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';


// Định nghĩa kiểu dữ liệu cho voucher
interface Voucher {
  id: number;
  voucherType: string;
  voucherName: string;
  discountAmount: number;
  minActivationValue: number;
  createdDate: string;
  expiredDate: string;
}

export default function VoucherPage(): React.JSX.Element {
  const [vouchers, setVouchers] = React.useState<Voucher[]>([]); // Xác định rõ kiểu dữ liệu là Voucher[]
  const [open, setOpen] = React.useState(false);
  const [newVoucher, setNewVoucher] = React.useState<Voucher>({
    id: 0,
    voucherType: '',
    voucherName: '',
    discountAmount: 0,
    minActivationValue: 0,
    createdDate: new Date().toISOString().split('T')[0], // Mặc định là ngày hiện tại
    expiredDate: '',
  });

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Các lựa chọn cho loại voucher
  const voucherTypeOptions = [
    'Khuyến mãi hàng tháng',
    'Sinh nhật nhà hàng',
    'Trung thu',
    'Tết Âm Lịch',
    'Quốc Khánh',
    '30/4 - 1/5',
    'Khác',
  ];

  // Fetch danh sách voucher khi trang được load
  React.useEffect(() => {
    const fetchVouchers = async () => {
      const token = localStorage.getItem('custom-auth-token');
      if (token) {
        try {
          const response = await fetch('http://localhost:8080/voucher', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setVouchers(data.data);
          } else {
            console.error('Failed to fetch vouchers:', data.message);
          }
        } catch (error) {
          console.error('Error fetching vouchers:', error);
        }
      } else {
        console.error('Token is missing');
      }
    };

    fetchVouchers();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewVoucher({
      id: 0,
      voucherType: '',
      voucherName: '',
      discountAmount: 0,
      minActivationValue: 0,
      createdDate: new Date().toISOString().split('T')[0],
      expiredDate: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setNewVoucher((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setNewVoucher({
      ...newVoucher,
      voucherType: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('custom-auth-token');

    if (token) {
      try {
        const response = await fetch('http://localhost:8080/create/voucher', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...newVoucher,
            discountAmount: parseFloat(newVoucher.discountAmount.toString()),
            minActivationValue: parseFloat(newVoucher.minActivationValue.toString()),
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setVouchers((prevVouchers) => [...prevVouchers, data.data]);
          handleClose();
        } else {
          console.error('Voucher creation failed:', data.message);
        }
      } catch (error) {
        console.error('Error creating voucher:', error);
      }
    } else {
      console.error('Token is missing');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedVouchers = vouchers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Voucher</Typography>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleOpen}>
            Thêm mới Voucher
          </Button>
        </div>
      </Stack>

      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Loại Voucher</TableCell>
                  <TableCell><center>Tên Voucher</center></TableCell>
                  <TableCell><center>Tỷ lệ giảm</center></TableCell>
                  <TableCell><center>Giá trị đơn hàng tối thiểu</center></TableCell>
                  <TableCell><center>Ngày tạo</center></TableCell>
                  <TableCell><center>Ngày hết hạn</center></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedVouchers.map((voucher) => (
                  <TableRow hover key={voucher.id}>
                    <TableCell>{voucher.id}</TableCell>
                    <TableCell>{voucher.voucherType}</TableCell>
                    <TableCell><center>{voucher.voucherName}</center></TableCell>
                    <TableCell><center>{voucher.discountAmount.toLocaleString()} %</center></TableCell>
                    <TableCell><center>{voucher.minActivationValue.toLocaleString()} </center></TableCell>
                    <TableCell><center>{voucher.createdDate}</center></TableCell>
                    <TableCell><center>{voucher.expiredDate}</center></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Divider />
        <TablePagination
          component="div"
          count={vouchers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Thêm Voucher mới</DialogTitle>
        <DialogContent>
          <input
            type="hidden"
            name="voucherName"
            value={newVoucher.voucherName}
            onChange={(e) =>
              setNewVoucher({ ...newVoucher, voucherName: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Loại Voucher</InputLabel>
            <Select
              name="voucherType"
              value={newVoucher.voucherType}
              onChange={handleSelectChange}
              label="Loại Voucher"
            >
              {voucherTypeOptions.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="discountAmount"
            label="% giảm giá"
            type="number"
            fullWidth
            variant="outlined"
            value={newVoucher.discountAmount}
            onChange={(e) => {
              const value = Math.max(0, parseInt(e.target.value)); // Không cho phép giá trị nhỏ hơn 0
              setNewVoucher({
                ...newVoucher,
                discountAmount: isNaN(value) ? 0 : value, // Xử lý khi input không phải số
              });
            }}
          />
          <TextField
            margin="dense"
            name="minActivationValue"
            label="Giá trị kích hoạt tối thiểu"
            type="number"
            fullWidth
            variant="outlined"
            value={newVoucher.minActivationValue}
            onChange={(e) => {
              const value = Math.max(0, parseInt(e.target.value)); // Không cho phép giá trị nhỏ hơn 0
              setNewVoucher({
                ...newVoucher,
                minActivationValue: isNaN(value) ? 0 : value, // Xử lý khi input không phải số
              });
            }}
            InputProps={{
              inputProps: {
                step: 1000, // Bước nhảy là 1,000
                min: 0, // Giá trị nhỏ nhất là 0
              },
              endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>, // Hiển thị VNĐ
            }}

          />
          <TextField
            margin="dense"
            name="expiredDate"
            label="Ngày hết hạn"
            type="date"
            fullWidth
            variant="outlined"
            value={newVoucher.expiredDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Huỷ</Button>
          <Button onClick={handleSubmit} variant="contained">
            Thêm Voucher
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}