"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Visibility, Edit, Delete, Add as AddIcon } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommonTable, { Column } from "@/components/Table/CommonTable";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/services/productApi";

export default function Dashboard() {
  // RTK Query Hooks
  const { data: products = [], isLoading } = useGetProductsQuery(undefined);
  const [deleteProduct] = useDeleteProductMutation();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Pagination not fully implemented in backend yet

  // Delete Dialog State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);

  const handleDeleteClick = (product: any) => {
    setProductToDelete(product);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete._id).unwrap();
      toast.success("Product deleted");
      setDeleteOpen(false);
      setProductToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  const handleHandleClose = () => {
    setDeleteOpen(false);
    setProductToDelete(null);
  };

  const columns: Column[] = [
    { id: "sku", label: "SKU", minWidth: 100 },
    {
      id: "images",
      label: "Image",
      minWidth: 80,
      render: (row) => (
        <Box
          sx={{
            width: 50,
            height: 50,
            bgcolor: "#f5f5f5",
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {row.media &&
          row.media.length > 0 &&
          row.media[0].type === "image" ? (
            <img
              src={row.media[0].url}
              alt={row.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Typography variant="caption" color="text.secondary">
              No Img
            </Typography>
          )}
        </Box>
      ),
    },
    { id: "name", label: "Product Name", minWidth: 170 },
    { id: "category", label: "Category", minWidth: 100 },
    { id: "stock", label: "Stock", minWidth: 100 },
    {
      id: "price",
      label: "Price",
      minWidth: 100,
      render: (row) => {
        let symbol = "$";
        const c = row.currency || "USD";
        if (c === "INR") symbol = "₹";
        else if (c === "EUR") symbol = "€";
        else if (c === "GBP") symbol = "£";
        else if (c === "JPY") symbol = "¥";
        else if (c === "CAD") symbol = "$";
        else if (c === "AUD") symbol = "$";
        return `${symbol}${row.price}`;
      },
    },
    { id: "status", label: "Status", minWidth: 100 },
    {
      id: "actions",
      label: "Actions",
      minWidth: 100,
      align: "right",
      render: (row) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Link href={`/products/${row._id}`}>
            <IconButton size="small" color="primary">
              <Visibility />
            </IconButton>
          </Link>
          <Link href={`/products/edit/${row._id}`}>
            <IconButton size="small" color="info">
              <Edit />
            </IconButton>
          </Link>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDeleteClick(row)}
          >
            <Delete />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Header Section */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Products
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your product inventory
          </Typography>
        </Box>
        <Link href="/products/add">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              textTransform: "none",
              boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
              borderRadius: 2,
              px: 3,
            }}
          >
            Add Product
          </Button>
        </Link>
      </Stack>

      {/* Filter Section */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
        }}
      >
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#f8f9fa",
                borderRadius: 2,
                px: 2,
                py: 1,
                flexGrow: 1,
                width: "100%",
              }}
            >
              <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
              <input
                type="text"
                placeholder="Search products..."
                style={{
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  width: "100%",
                  fontSize: "1rem",
                }}
              />
            </Box>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              sx={{ borderRadius: 2, textTransform: "none", minWidth: 100 }}
            >
              Filters
            </Button>
            <Button
              variant="outlined"
              startIcon={<MoreVertIcon />}
              sx={{ borderRadius: 2, minWidth: 50 }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 20px rgba(0,0,0,0.05)" }}>
        <CommonTable columns={columns} rows={products} isLoading={isLoading} />
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "flex-end",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Pagination
            count={totalPages}
            color="primary"
            onChange={(e, value) => {
              setPage(value);
              // In a real app, you would fetch products for the new page here
            }}
            shape="rounded"
          />
        </Box>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={handleHandleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Product?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHandleClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
