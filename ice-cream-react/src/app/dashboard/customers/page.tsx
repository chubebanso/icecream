'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { ProductsTable } from '@/components/dashboard/product/product-table';
import type { Product } from '@/components/dashboard/product/product-table';

export default function Page(): React.JSX.Element {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [open, setOpen] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null); // Trạng thái xem trước hình ảnh
  const [newProduct, setNewProduct] = React.useState({
    name: '',
    price: '',
    unit: '',
    category: '',
    image: '',
    availableForOrder: true,
  });

  const page = 0;
  const rowsPerPage = 5;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setImagePreview(null); // Reset ảnh xem trước khi đóng modal
    setNewProduct({
      name: '',
      price: '',
      unit: '',
      category: '',
      image: '',
      availableForOrder: true,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  // Xử lý upload hình ảnh và xem trước
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Xem trước ảnh bằng FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Cập nhật ảnh xem trước
      };
      reader.readAsDataURL(file);

      // Nếu có API upload ảnh, gọi API và lưu URL vào newProduct.image
      // Ví dụ:
      // const formData = new FormData();
      // formData.append('file', file);
      // fetch('YOUR_IMAGE_UPLOAD_API_ENDPOINT', {
      //   method: 'POST',
      //   body: formData,
      // }).then(response => response.json()).then(data => {
      //   setNewProduct((prev) => ({ ...prev, image: data.url }));
      // });
    }
  };

  const handleSubmit = () => {
    const newProductData = {
      id: `${Date.now()}`,
      ...newProduct,
      image: imagePreview || '', // Sử dụng URL ảnh đã upload
      price: parseFloat(newProduct.price),
    };
    setProducts((prevProducts) => [...prevProducts, newProductData]);
    handleClose();
  };

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/product', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}`,
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
    };

    fetchProducts();
  }, []);

  const paginatedProducts = applyPagination(products, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Products</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleOpen}>
            Add
          </Button>
        </div>
      </Stack>
      <ProductsTable
        count={products.length}
        page={page}
        rows={paginatedProducts}
        rowsPerPage={rowsPerPage}
      />

      {/* Modal thêm sản phẩm */}
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
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="unit"
            label="Đơn vị"
            type="text"
            fullWidth
            variant="outlined"
            value={newProduct.unit}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="category"
            label="Danh mục"
            type="text"
            fullWidth
            variant="outlined"
            value={newProduct.category}
            onChange={handleChange}
          />
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="upload-image"
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="upload-image">
            <Button variant="contained" color="primary" component="span">
              Upload Image
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
