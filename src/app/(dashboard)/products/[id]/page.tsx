"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  useGetProductByIdQuery,
  useDeleteProductMutation,
} from "@/services/productApi";

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // RTK Query
  const {
    data: product,
    isLoading: loading,
    error,
  } = useGetProductByIdQuery(id, {
    skip: !id,
  });

  const [deleteProduct] = useDeleteProductMutation();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted successfully");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting product");
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <Typography>Loading product details...</Typography>
      </Box>
    );
  }

  // Handle Fetch Error or Missing Product
  if (error || !product) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">
          {"message" in (error || {})
            ? (error as any).message
            : "Product not found or failed to load"}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{ color: "text.secondary" }}
          >
            Back
          </Button>
          <Typography variant="h4" fontWeight="bold">
            Product Details
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            label={product.status?.toUpperCase()}
            color={product.status === "active" ? "success" : "default"}
            variant="outlined"
            sx={{ fontWeight: "bold" }}
          />
          <Link href={`/products/edit/${id}`}>
            <Button variant="outlined" startIcon={<EditIcon />}>
              Edit
            </Button>
          </Link>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </Button>
        </Stack>
      </Box>

      {/* Content */}
      <Grid container spacing={3}>
        {/* Main Info */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
              mb: 3,
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                General Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Product Name
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {product.name}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {product.description || "No description provided."}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1">{product.category}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Media Gallery */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
              mb: 3,
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Media Gallery
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {product.media && product.media.length > 0 ? (
                <Grid container spacing={2}>
                  {product.media.map((item: any, index: number) => (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                      <Box
                        sx={{
                          position: "relative",
                          paddingTop: "100%", // 1:1 Aspect Ratio
                          borderRadius: 2,
                          overflow: "hidden",
                          border: "1px solid #eee",
                          bgcolor: "#fafafa",
                        }}
                      >
                        {item.type === "image" ? (
                          <Image
                            src={item.url}
                            alt={`Product Media ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <video
                            src={item.url}
                            controls
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="text.secondary">
                  No media available.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Side Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Pricing & Inventory
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      SKU
                    </Typography>
                    <Typography variant="body1" fontFamily="monospace">
                      {product.sku}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Price
                    </Typography>
                    <Typography
                      variant="h5"
                      color="primary.main"
                      fontWeight="bold"
                    >
                      {(() => {
                        const c = product.currency || "USD";
                        let symbol = "$";
                        if (c === "INR") symbol = "₹";
                        else if (c === "EUR") symbol = "€";
                        else if (c === "GBP") symbol = "£";
                        else if (c === "JPY") symbol = "¥";
                        else if (c === "CAD") symbol = "$";
                        else if (c === "AUD") symbol = "$";
                        return `${symbol}${product.price}`;
                      })()}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Stock Quantity
                    </Typography>
                    <Typography variant="h6">{product.stock} units</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Specifications
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {product.specifications && product.specifications.length > 0 ? (
                  <Stack spacing={2}>
                    {product.specifications.map((spec: any, index: number) => (
                      <Stack
                        key={index}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body2" color="text.secondary">
                          {spec.key}
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {spec.value}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                ) : (
                  <Typography color="text.secondary">
                    No specifications.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
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
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
