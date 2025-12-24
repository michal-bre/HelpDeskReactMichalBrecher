import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  Divider,
  CircularProgress,
  Container,
  Fade,
  Chip,
  Button,
} from "@mui/material";

// אייקונים
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import { useUsersQuery } from "../Query/UsersQuery";
import { type UserDetails } from "../Types/User";

const MAIN_GRADIENT = "linear-gradient(135deg, #4facfe 0%, #9c27b0 100%)";

const GetUserById: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // שליפת ה-ID מה-URL
  const navigate = useNavigate();
  const userId = Number(id);

  const { data: users, isLoading, isError } = useUsersQuery();

  // טיפול במצבי טעינה ושגיאה
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress sx={{ color: '#4facfe' }} />
      </Box>
    );
  }

  if (isError || !users) {
    return (
      <Box textAlign="center" py={10}>
        <Typography color="error" variant="h6">Error loading user data</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Go Back</Button>
      </Box>
    );
  }

  // Casting ל-UserDetails כדי למנוע את שגיאת ה-unknown שצילמת
  const user = (users as UserDetails[]).find((u) => u.id === userId);

  if (!user) {
    return (
      <Box textAlign="center" py={10}>
        <Typography variant="h5" color="text.secondary">User Not Found</Typography>
        <Button onClick={() => navigate('/users')} sx={{ mt: 2 }}>Back to List</Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="xs" sx={{ py: 6 }}>
      {/* כפתור חזרה עדין */}
      <Button
        startIcon={<ArrowBackIosNewIcon sx={{ fontSize: '14px !important' }} />}
        onClick={() => navigate(-1)}
        sx={{
          mb: 3,
          color: '#94a3b8',
          fontWeight: 800,
          fontSize: '0.85rem',
          '&:hover': { color: '#4facfe', bgcolor: 'transparent' }
        }}
      >
        BACK TO MEMBERS
      </Button>

      <Fade in={true} timeout={600}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid #f1f5f9',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)',
            bgcolor: 'white',
          }}
        >
          {/* Header Banner - עיצוב תואם לדאשבורד */}
          <Box sx={{ height: 120, background: MAIN_GRADIENT, position: 'relative' }} />

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: -7, mb: 2 }}>
            <Avatar
              sx={{
                width: 110,
                height: 110,
                border: '6px solid white',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                background: '#f8fafc',
                color: '#4facfe',
                fontSize: '2.8rem',
                fontWeight: 900
              }}
            >
              {user.name?.[0].toUpperCase()}
            </Avatar>
          </Box>

          {/* User Information */}
          <Box sx={{ p: 4, pt: 1, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-1px' }}>
              {user.name}
            </Typography>

            <Chip
              icon={<AdminPanelSettingsIcon style={{ color: 'inherit', fontSize: 16 }} />}
              label={user.role.toUpperCase()}
              size="small"
              sx={{
                bgcolor: '#f0f9ff',
                color: '#4facfe',
                fontWeight: 800,
                px: 1.5,
                mt: 1.5,
                mb: 4,
                letterSpacing: '0.5px'
              }}
            />

            <Stack spacing={3} sx={{ textAlign: 'left' }}>
              <Divider sx={{ opacity: 0.5 }} />

              {/* ID Section */}
              <Stack direction="row" spacing={2.5} alignItems="center">
                <Box sx={{ p: 1.2, bgcolor: '#f8fafc', borderRadius: 3, color: '#94a3b8' }}>
                  <FingerprintIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, display: 'block' }}>
                    UNIQUE IDENTIFIER
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: '#334155' }}>
                    #{user.id}
                  </Typography>
                </Box>
              </Stack>

              {/* Email Section */}
              <Stack direction="row" spacing={2.5} alignItems="center">
                <Box sx={{ p: 1.2, bgcolor: '#f0f9ff', borderRadius: 3, color: '#4facfe' }}>
                  <EmailOutlinedIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, display: 'block' }}>
                    EMAIL ADDRESS
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: '#334155' }}>
                    {user.email}
                  </Typography>
                </Box>
              </Stack>

              {/* Role Section */}
              <Stack direction="row" spacing={2.5} alignItems="center">
                <Box sx={{ p: 1.2, bgcolor: '#faf5ff', borderRadius: 3, color: '#9c27b0' }}>
                  <BadgeOutlinedIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, display: 'block' }}>
                    ACCOUNT TYPE
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: '#334155', textTransform: 'capitalize' }}>
                    {user.role} Member
                  </Typography>
                </Box>
              </Stack>
            </Stack>


          </Box>

          <Box sx={{ p: 2, bgcolor: '#f8fafc', textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
            <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 800, letterSpacing: 1.5 }}>
              S Y S T E M • V E R I F I E D
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default GetUserById;