import React from "react";
import { Box, Typography, Button, Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const MAIN_GRADIENT = "linear-gradient(135deg, #4facfe 0%, #9c27b0 100%)";

export const Page404: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Stack spacing={3} alignItems="center">
          {/* אייקון גדול עם אפקט שקיפות */}
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(79, 172, 254, 0.1)",
              color: "#4facfe",
              mb: 2,
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 80 }} />
          </Box>

          {/* מספר השגיאה */}
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "5rem", md: "8rem" },
              background: MAIN_GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
            }}
          >
            404
          </Typography>

          {/* טקסט הסבר */}
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b", mb: 1 }}>
              Oops! Page not found
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b", fontWeight: 500, maxWidth: 400 }}>
              The page you are looking for might have been removed or is temporarily unavailable.
            </Typography>
          </Box>

          {/* כפתור חזרה */}
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            sx={{
              mt: 4,
              px: 4,
              py: 1.5,
              borderRadius: 4,
              background: MAIN_GRADIENT,
              fontWeight: 800,
              boxShadow: "0 8px 20px rgba(79, 172, 254, 0.3)",
              "&:hover": {
                opacity: 0.9,
                transform: "translateY(-2px)",
                transition: "all 0.2s ease-in-out",
              },
            }}
          >
            Back to Home
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Page404;
