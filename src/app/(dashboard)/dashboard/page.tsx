"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
  TextField,
  MenuItem,
  InputAdornment,
  Grid,
  Menu,
  Slider,
} from "@mui/material";
import {
  Visibility,
  Edit,
  Delete,
  Add as AddIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CommonTable, { Column } from "@/components/Table/CommonTable";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/services/productApi";

export default function Dashboard() {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const filterOpen = Boolean(filterAnchorEl);

  const [filters, setFilters] = useState({
    status: "all",
    priceRange: [0, 10000],
    stockRange: [0, 1000],
  });

  const [appliedFilters, setAppliedFilters] = useState({
    status: "",
    minPrice: "",
    maxPrice: "",
    minStock: "",
    maxStock: "",
  });

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  const [page, setPage] = useState(1);
  const limit = 10;

  // Construct Query Params
  const queryParams = {
    page,
    limit,
    keyword: debouncedKeyword,
    ...(appliedFilters.status !== "all" && { status: appliedFilters.status }),
    ...(appliedFilters.minPrice && { minPrice: appliedFilters.minPrice }),
    ...(appliedFilters.maxPrice && { maxPrice: appliedFilters.maxPrice }),
    ...(appliedFilters.minStock && { minStock: appliedFilters.minStock }),
    ...(appliedFilters.maxStock && { maxStock: appliedFilters.maxStock }),
  };

  // RTK Query Hooks
  const { data, isLoading, error } = useGetProductsQuery(queryParams);

  const products = data?.products || [];
  const totalPages = data?.pages || 1;
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (error) {
      console.error(error);
      const msg =
        "message" in error
          ? (error as any).message
          : "Failed to fetch products";
      toast.error(msg);
    }
  }, [error]);

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

  const handleApplyFilters = () => {
    setAppliedFilters({
      status: filters.status,
      minPrice: filters.priceRange[0].toString(),
      maxPrice: filters.priceRange[1].toString(),
      minStock: filters.stockRange[0].toString(),
      maxStock: filters.stockRange[1].toString(),
    });
    setFilterAnchorEl(null);
  };

  const handleClearFilters = () => {
    setFilters({
      status: "all",
      priceRange: [0, 10000],
      stockRange: [0, 1000],
    });
    setAppliedFilters({
      status: "",
      minPrice: "",
      maxPrice: "",
      minStock: "",
      maxStock: "",
    });
    setFilterAnchorEl(null);
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
            position: "relative",
          }}
        >
          {row.media &&
          row.media.length > 0 &&
          row.media[0].type === "image" ? (
            <Image
              src={row.media[0].url}
              alt={row.name}
              fill
              sizes="50px"
              unoptimized
              style={{ objectFit: "cover" }}
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
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  // Manually trigger debounce update
                  setTimeout(() => setDebouncedKeyword(e.target.value), 500);
                }}
                style={{
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  width: "100%",
                  fontSize: "1rem",
                }}
              />
              {keyword && (
                <IconButton
                  size="small"
                  onClick={() => {
                    setKeyword("");
                    setDebouncedKeyword("");
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={(e) => setFilterAnchorEl(e.currentTarget)}
              sx={{ borderRadius: 2, textTransform: "none", minWidth: 100 }}
              color={
                appliedFilters.status ||
                appliedFilters.minPrice ||
                appliedFilters.minStock
                  ? "primary"
                  : "inherit"
              }
            >
              Filters
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={filterOpen}
        onClose={() => setFilterAnchorEl(null)}
        PaperProps={{
          sx: { width: 320, p: 2, borderRadius: 2, mt: 1 },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Filter Options
        </Typography>

        <Stack spacing={3}>
          <TextField
            select
            label="Status"
            size="small"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            fullWidth
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
          </TextField>

          <Box>
            <Typography gutterBottom variant="body2">
              Price Range ($0 - $10,000)
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={(e, newValue) =>
                setFilters({ ...filters, priceRange: newValue as number[] })
              }
              valueLabelDisplay="auto"
              min={0}
              max={10000}
            />
          </Box>

          <Box>
            <Typography gutterBottom variant="body2">
              Stock Quantity (0 - 1000)
            </Typography>
            <Slider
              value={filters.stockRange}
              onChange={(e, newValue) =>
                setFilters({ ...filters, stockRange: newValue as number[] })
              }
              valueLabelDisplay="auto"
              min={0}
              max={1000}
            />
          </Box>

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button onClick={handleClearFilters} color="inherit">
              Clear
            </Button>
            <Button
              onClick={handleApplyFilters}
              variant="contained"
              size="small"
            >
              Apply
            </Button>
          </Stack>
        </Stack>
      </Menu>

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
