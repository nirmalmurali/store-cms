"use client";

import { Box, Container, Paper, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background:
            "radial-gradient(circle, rgba(25,118,210,0.1) 0%, rgba(255,255,255,0) 70%)",
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
            animation: `${float} 3s ease-in-out infinite`,
          }}
        >
          <AutoAwesomeIcon
            sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
          />
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            color="primary"
          >
            Store CMS
          </Typography>
        </Box>
        <Paper
          elevation={6}
          sx={{
            p: 5,
            display: "flex",
            flexDirection: "column",
            borderRadius: 4,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          {children}
        </Paper>
      </Container>
    </Box>
  );
}
