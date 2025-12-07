"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  Link as MuiLink,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // In a production app, use HTTP-only cookies
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        router.push("/"); // Redirect to dashboard
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        fontWeight="600"
        align="center"
      >
        Welcome Back
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mb: 4 }}
      >
        Please sign in to your admin account
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, width: "100%" }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
        <TextField
          margin="normal"
          fullWidth
          label="Email Address"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ mb: 3 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Link href="/forgot-password" passHref legacyBehavior>
            <MuiLink
              variant="body2"
              color="text.secondary"
              underline="hover"
              sx={{ cursor: "pointer" }}
            >
              Forgot Password?
            </MuiLink>
          </Link>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={!loading && <LoginIcon />}
          sx={{
            mt: 1,
            mb: 3,
            py: 1.5,
            fontWeight: "bold",
            fontSize: "1rem",
            textTransform: "none",
            borderRadius: 2,
            boxShadow: "0 4px 14px 0 rgba(25, 118, 210, 0.39)",
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{" "}
            <Link href="/register" passHref legacyBehavior>
              <MuiLink
                underline="hover"
                sx={{
                  fontWeight: "600",
                  cursor: "pointer",
                  color: "primary.main",
                }}
              >
                Create Account
              </MuiLink>
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
}
