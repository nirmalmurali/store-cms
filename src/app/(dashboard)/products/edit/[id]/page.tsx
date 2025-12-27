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
  Alert,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useRouter, useParams } from "next/navigation";
import CommonInput from "@/components/Form/CommonInput";
import toast from "react-hot-toast";

import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/services/productApi";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [error, setError] = useState("");

  const {
    data: product,
    isLoading: loadingProduct,
    error: fetchError,
  } = useGetProductByIdQuery(id, {
    skip: !id,
  });

  const [updateProduct, { isLoading: submitting }] = useUpdateProductMutation();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    currency: "INR",
    stock: "",
    description: "",
    status: "active",
    specifications: [] as { key: string; value: string }[],
  });

  const [existingMedia, setExistingMedia] = useState<
    { type: string; url: string }[]
  >([]);
  const [newMediaFiles, setNewMediaFiles] = useState<File[]>([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        currency: product.currency || "INR",
        stock: product.stock,
        description: product.description || "",
        status: product.status,
        specifications: product.specifications || [],
      });
      setExistingMedia(product.media || []);
    } else if (fetchError) {
      const msg =
        "message" in fetchError
          ? (fetchError as any).message
          : "Failed to fetch product details";
      setError(msg);
      toast.error(msg);
    }
  }, [product, fetchError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("price", formData.price.toString());
      data.append("currency", formData.currency);
      data.append("stock", formData.stock.toString());
      data.append("description", formData.description);
      data.append("status", formData.status);
      data.append("specifications", JSON.stringify(formData.specifications));

      // Send existing media as JSON string
      data.append("existingMedia", JSON.stringify(existingMedia));

      // Append new files
      newMediaFiles.forEach((file) => {
        data.append("mediaFiles", file);
      });

      await updateProduct({ id, body: data }).unwrap();

      toast.success("Product updated successfully");
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.data?.message || err.message || "Failed to update product";
      toast.error(msg);
      setError(msg);
    }
  };

  if (loadingProduct) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Edit Product
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 20px rgba(0,0,0,0.05)" }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <CommonInput
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <CommonInput
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Box sx={{ minWidth: 100 }}>
                  <CommonInput
                    label="Currency"
                    name="currency"
                    select
                    value={formData.currency}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="INR">INR (₹)</MenuItem>
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                    <MenuItem value="GBP">GBP (£)</MenuItem>
                    <MenuItem value="JPY">JPY (¥)</MenuItem>
                    <MenuItem value="CAD">CAD ($)</MenuItem>
                    <MenuItem value="AUD">AUD ($)</MenuItem>
                  </CommonInput>
                </Box>
                <CommonInput
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
                <CommonInput
                  label="Stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </Stack>
              <CommonInput
                label="Status"
                name="status"
                select
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
              </CommonInput>
              <CommonInput
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />

              {/* Media Section */}
              <Typography variant="h6" sx={{ mt: 2 }}>
                Media
              </Typography>

              {/* Existing Media List */}
              {existingMedia.length > 0 && (
                <Stack spacing={2} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Existing Media:
                  </Typography>
                  {existingMedia.map((item, index) => (
                    <Stack
                      key={index}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        p: 1,
                        border: "1px solid #eee",
                        borderRadius: 1,
                        bgcolor: "white",
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        {item.type === "image" ? (
                          <Image
                            src={item.url}
                            alt="product media"
                            width={50}
                            height={50}
                            style={{
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              bgcolor: "#eee",
                              borderRadius: 4,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography variant="caption">Video</Typography>
                          </Box>
                        )}
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ maxWidth: 300 }}
                        >
                          {item.url}
                        </Typography>
                      </Stack>
                      <Button
                        color="error"
                        size="small"
                        onClick={() => {
                          setExistingMedia((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        Remove
                      </Button>
                    </Stack>
                  ))}
                </Stack>
              )}

              {/* New File Upload */}
              <Typography variant="subtitle2" color="text.secondary">
                Add New Media:
              </Typography>
              <Box
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: 2,
                  p: 4,
                  textAlign: "center",
                  cursor: "pointer",
                  bgcolor: "#fafafa",
                  "&:hover": { bgcolor: "#f0f0f0" },
                }}
                onClick={() =>
                  document.getElementById("editFileInput")?.click()
                }
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files);
                  const validFiles = files.filter((file) =>
                    file.type.match(/^(image|video)\//)
                  );

                  if (validFiles.length !== files.length) {
                    toast.error("Only image and video files are allowed.");
                  }

                  if (validFiles.length > 0) {
                    setNewMediaFiles((prev) => [...prev, ...validFiles]);
                  }
                }}
              >
                <input
                  type="file"
                  id="editFileInput"
                  multiple
                  accept="image/*,video/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files) {
                      const files = Array.from(e.target.files);
                      const validFiles = files.filter((file) =>
                        file.type.match(/^(image|video)\//)
                      );

                      if (validFiles.length !== files.length) {
                        toast.error("Only image and video files are allowed.");
                      }

                      if (validFiles.length > 0) {
                        setNewMediaFiles((prev) => [...prev, ...validFiles]);
                      }
                    }
                  }}
                />
                <CloudUploadIcon
                  sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
                />
                <Typography color="text.secondary">
                  Drag & Drop images or videos here, or click to select
                </Typography>
              </Box>

              {/* Preview New Files */}
              {newMediaFiles.length > 0 && (
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    New Uploads:
                  </Typography>
                  {newMediaFiles.map((file, index) => (
                    <Stack
                      key={index}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        p: 1,
                        border: "1px solid #eee",
                        borderRadius: 1,
                        bgcolor: "white",
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        {file.type.startsWith("image") ? (
                          <Image
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            width={50}
                            height={50}
                            unoptimized
                            style={{
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              bgcolor: "#eee",
                              borderRadius: 4,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography variant="caption">Video</Typography>
                          </Box>
                        )}
                        <Box>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 200 }}
                          >
                            {file.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </Typography>
                        </Box>
                      </Stack>
                      <Button
                        color="error"
                        size="small"
                        onClick={() => {
                          setNewMediaFiles((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        Remove
                      </Button>
                    </Stack>
                  ))}
                </Stack>
              )}

              {/* Specifications Section */}
              <Typography variant="h6" sx={{ mt: 2 }}>
                Specifications
              </Typography>
              {formData.specifications.map((spec, index) => (
                <Stack
                  key={index}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="center"
                >
                  <CommonInput
                    label="Key (e.g., Color)"
                    value={spec.key}
                    onChange={(e) => {
                      const newSpecs = [...formData.specifications];
                      newSpecs[index].key = e.target.value;
                      setFormData({ ...formData, specifications: newSpecs });
                    }}
                    required
                  />
                  <CommonInput
                    label="Value (e.g., Red)"
                    value={spec.value}
                    onChange={(e) => {
                      const newSpecs = [...formData.specifications];
                      newSpecs[index].value = e.target.value;
                      setFormData({ ...formData, specifications: newSpecs });
                    }}
                    required
                  />
                  <Button
                    color="error"
                    onClick={() => {
                      const newSpecs = formData.specifications.filter(
                        (_, i) => i !== index
                      );
                      setFormData({ ...formData, specifications: newSpecs });
                    }}
                  >
                    Remove
                  </Button>
                </Stack>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() =>
                  setFormData({
                    ...formData,
                    specifications: [
                      ...formData.specifications,
                      { key: "", value: "" },
                    ],
                  })
                }
                sx={{ alignSelf: "start" }}
              >
                Add Specification
              </Button>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => router.back()}
                  sx={{ textTransform: "none" }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  sx={{ textTransform: "none", px: 4 }}
                >
                  {submitting ? "Updating..." : "Update Product"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
