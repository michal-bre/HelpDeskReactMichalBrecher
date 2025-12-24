import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import {
  Paper,
  Stack,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  Avatar,
  InputAdornment,
  Container
} from "@mui/material";

// אייקונים
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import LabelImportantOutlinedIcon from '@mui/icons-material/LabelImportantOutlined';

import { useUserContext } from "../Context/UserContext";
import {
  addStatusOrPriority,
  type StatusOrPriorityType,
  type StatusOrPriorityFormInput,
} from "../Service/Status-Priority/addstatusPriority";

import { PRIORITIES_QUERY_KEY } from "../Query/PriorityQuery";
import { STATUSES_QUERY_KEY } from "../Query/StatusQuery";

const MAIN_GRADIENT = "linear-gradient(135deg, #4facfe 0%, #9c27b0 100%)";

type Props = {
  type: StatusOrPriorityType;
};

export const AddStatusOrPriorityForm: React.FC<Props> = ({ type }) => {
  const queryClient = useQueryClient();
  const { user } = useUserContext();

  const isPriority = type === "priorities";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StatusOrPriorityFormInput>();

  const onSubmit = async (data: StatusOrPriorityFormInput) => {
    try {
      if (!user?.token) {
        Swal.fire({ 
            icon: "error", 
            title: "Authentication Error", 
            text: "Please log in again." 
        });
        return;
      }

      await addStatusOrPriority(user.token, type, data);

      const queryKey = isPriority ? PRIORITIES_QUERY_KEY : STATUSES_QUERY_KEY;
      await queryClient.invalidateQueries({ queryKey });

      Swal.fire({
        icon: "success",
        title: "Added Successfully!",
        text: `The new ${isPriority ? "priority" : "status"} is now live.`,
        confirmButtonColor: "#4facfe",
      });

      reset();
    } catch (error) {
      Swal.fire({ 
          icon: "error", 
          title: "Oops...", 
          text: "Failed to save. Please try again." 
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 8,
          border: '1px solid #f1f5f9',
          boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
          bgcolor: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* אלמנט עיצובי בפינה */}
        <Box sx={{ 
          position: 'absolute', top: 0, right: 0, 
          width: '100px', height: '100px', 
          background: MAIN_GRADIENT, opacity: 0.05,
          borderRadius: '0 0 0 100%' 
        }} />

        <Stack alignItems="center" spacing={2} sx={{ mb: 5 }}>
          <Avatar sx={{ 
            background: MAIN_GRADIENT, 
            width: 60, height: 60,
            boxShadow: '0 10px 20px rgba(79, 172, 254, 0.2)' 
          }}>
            <AddCircleOutlineRoundedIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box textAlign="center">
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-1px' }}>
              Create {isPriority ? "Priority" : "Status"}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500 }}>
              Add custom labels to organize your workflow
            </Typography>
          </Box>
        </Stack>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={4}>
            {/* שדה שם בלבד */}
            <TextField
              fullWidth
              label="Display Name"
              placeholder={isPriority ? "e.g. Critical" : "e.g. Under Review"}
              {...register("name", { required: "Name is required" })}
              error={!!errors.name}
              helperText={errors.name?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LabelImportantOutlinedIcon sx={{ color: '#4facfe' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: '#fcfdfe' } }}
            />

            {/* כפתור הגשה */}
            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting}
              variant="contained"
              sx={{
                py: 2,
                borderRadius: 4,
                background: MAIN_GRADIENT,
                fontWeight: 800,
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: '0 12px 24px rgba(79, 172, 254, 0.3)',
                '&:hover': {
                  background: MAIN_GRADIENT,
                  opacity: 0.9,
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s'
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                `Confirm & Add ${isPriority ? "Priority" : "Status"}`
              )}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};