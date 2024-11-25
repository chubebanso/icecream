'use client';

import * as React from 'react';
import {
  Button,
  Stack,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  SelectChangeEvent,
} from '@mui/material';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { ProductsTable } from '@/components/dashboard/product/product-table';
import type { Product } from '@/components/dashboard/product/product-table';

export default function Page(): React.JSX.Element {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [open, setOpen] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [newProduct, setNewProduct] = React.useState({
    name: '',
    price: '',
    unit: '',
    category: '',
    image: '',
    availableForOrder: true,
  });

  // Dummy data for unit and category options
  const unitOptions = ['ly', 'chai', 'chiếc', 'que', 'hộp']; // Bạn có thể thay đổi giá trị này tùy ý
  const categoryOptions = ['Bánh trung thu', 'Nước', 'Kem']; // Thay đổi theo yêu cầu của bạn

  const page = 0;
  const rowsPerPage = 5;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setImagePreview(null);
    setNewProduct({
      name: '',
      price: '',
      unit: '',
      category: '',
      image: '',
      availableForOrder: true,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const token = localStorage.getItem('custom-auth-token');

    if (file && token) {
      // Xem trước ảnh bằng FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);

      const folder = 'admin';
      const uploadUrl = `http://localhost:8080/files?folder=${folder}`;

      try {
        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        const data = await response.json();
        if (response.ok) {
          setNewProduct((prev) => ({ ...prev, image: data.data.fileName }));
        } else {
          console.error('File upload failed:', data.message);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      console.error('No file selected or token missing');
    }
  };

  const handleSubmit = async () => {
    const newProductData = {
      ...newProduct,
      price: parseFloat(newProduct.price),
    };
    const token = localStorage.getItem('custom-auth-token');

    if (token) {
      try {
        const response = await fetch('http://localhost:8080/create/product', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newProductData),
        });
        const data = await response.json();
        if (response.ok) {
          setProducts((prevProducts) => [...prevProducts, data.data]);
          handleClose();
        } else {
          console.error('Product creation failed:', data.message);
        }
      } catch (error) {
        console.error('Error creating product:', error);
      }
    } else {
      console.error('Token is missing');
    }
  };

  React.useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('custom-auth-token');
      if (token) {
        try {
          const response = await fetch('http://localhost:8080/product', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setProducts(data.data);
          } else {
            console.error('Failed to fetch products');
          }
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      } else {
        console.error('Token is missing');
      }
    };

    fetchProducts();
  }, []);

  const paginatedProducts = applyPagination(products, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Sản phẩm</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleOpen}>
            Thêm mới
          </Button>
        </div>
      </Stack>
      <ProductsTable
        count={products.length}
        page={page}
        rows={paginatedProducts}
        rowsPerPage={rowsPerPage}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Thêm sản phẩm mới</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Tên sản phẩm"
            type="text"
            fullWidth
            variant="outlined"
            value={newProduct.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="price"
            label="Giá"
            type="number"
            fullWidth
            variant="outlined"
            value={newProduct.price}
            onChange={(e) => {
              const value = Math.max(0, parseInt(e.target.value)); // Không cho phép giá trị nhỏ hơn 0
              setNewProduct({
                ...newProduct,
                price: isNaN(value) ? '' : value.toString(), // Xử lý khi input không phải số
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

          {/* Dropdown for Unit */}
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel id="unit-label">Đơn vị</InputLabel>
            <Select
              labelId="unit-label"
              name="unit"
              value={newProduct.unit}
              onChange={handleSelectChange}
              label="Đơn vị"
            >
              {unitOptions.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Dropdown for Category */}
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel id="category-label">Danh mục</InputLabel>
            <Select
              labelId="category-label"
              name="category"
              value={newProduct.category}
              onChange={handleSelectChange}
              label="Danh mục"
            >
              {categoryOptions.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="upload-image"
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="upload-image">
            <Button variant="contained" color="primary" component="span">
              Tải ảnh lên
            </Button>
          </label>
          {imagePreview && (
            <img src={imagePreview} alt="Image Preview" style={{ width: '100%', marginTop: '10px' }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Huỷ</Button>
          <Button onClick={handleSubmit} variant="contained">
            Thêm sản phẩm
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

function applyPagination(rows: Product[], page: number, rowsPerPage: number): Product[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
