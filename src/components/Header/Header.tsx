"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { ShoppingCart, Menu as MenuIcon } from "@mui/icons-material";

export default function Header() {
  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold" }}
        >
          Store CMS
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button color="inherit">Dashboard</Button>
          <Button color="inherit">Products</Button>
          <Button color="inherit">Orders</Button>
          <Button color="inherit">Settings</Button>

          <IconButton color="inherit" aria-label="shopping cart">
            <ShoppingCart />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
