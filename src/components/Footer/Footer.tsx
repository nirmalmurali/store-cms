"use client";

import { Box, Container, Typography, Link, Stack } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";
import "@/styles/utilities.less";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        py: 6,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={4}
          justifyContent="space-between"
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="bold"
              className="font-color-primary"
            >
              Store CMS
            </Typography>
            <Typography variant="body2" className="font-color-secondary">
              Admin panel for managing your store.
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Link href="#" underline="hover" color="text.secondary">
                Dashboard
              </Link>
              <Link href="#" underline="hover" color="text.secondary">
                Products
              </Link>
              <Link href="#" underline="hover" color="text.secondary">
                Orders
              </Link>
              <Link href="#" underline="hover" color="text.secondary">
                Settings
              </Link>
            </Stack>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Support
            </Typography>
            <Stack direction="row" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Contact system admin for support.
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Box sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: "divider" }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Store CMS. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
