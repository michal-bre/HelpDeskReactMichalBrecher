import React from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import { useUserContext } from "../Context/UserContext";
import { useStatusQuery } from "../Query/StatusQuery";
import { usePriorityQuery } from "../Query/PriorityQuery";
import { useUsersQuery } from "../Query/UsersQuery";
import { TICKETS_QUERT_KEY } from "../Query/TicketsQuery";

import { updateTicket } from "../Service/Ticket/updateTicket";

import { type TicketToUpdate } from "../Types/Ticket";
import { type StatusOrPriority } from "../Types/StatusPriority";
import { type UserDetails } from "../Types/User";

import {
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  MenuItem,
  Divider,
  Fade,
  Avatar,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

// אייקונים
import EditNoteIcon from '@mui/icons-material/EditNote';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LabelIcon from '@mui/icons-material/Label';
import SpeedIcon from '@mui/icons-material/Speed';
import { useNavigate } from "react-router-dom";

type Props = {
  id: number;
  status_id: number;
  priority_id: number;
  assigned_to: number;
  subject: string;
};

const MAIN_GRADIENT = "linear-gradient(135deg, #4facfe 0%, #9c27b0 100%)";

export const UpdateTicket: React.FC<Props> = ({
  id,
  status_id,
  priority_id,
  assigned_to,
  subject,
}) => {
  const queryClient = useQueryClient();
  const { user } = useUserContext();

  const statusesQuery = useStatusQuery();
  const prioritiesQuery = usePriorityQuery();
  const usersQuery = useUsersQuery();
  const navigate = useNavigate();

  // Casting כדי למנוע שגיאות unknown ב-TypeScript
  const statusArray = (statusesQuery.data ?? []) as StatusOrPriority[];
  const priorityArray = (prioritiesQuery.data ?? []) as StatusOrPriority[];
  const agents = ((usersQuery.data ?? []) as UserDetails[]).filter(
    (u) => u.role === "agent"
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TicketToUpdate>({
    defaultValues: {
      status_id,
      priority_id,
      assigned_to,
    },
    shouldUnregister: false,
  });


  const onSubmit: SubmitHandler<TicketToUpdate> = async (formData) => {
    try {
      if (!user?.token) {
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Please log in again.",
          confirmButtonColor: '#4facfe'
        });
        return;
      }

      await updateTicket(user.token, id, formData);
      await queryClient.invalidateQueries({ queryKey: TICKETS_QUERT_KEY });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "The ticket has been updated.",
        timer: 2000,
        showConfirmButton: false,
      });
      await queryClient.invalidateQueries({ queryKey: TICKETS_QUERT_KEY });
      navigate(-1);
    } catch (error) {
      const msg = axios.isAxiosError(error)
        ? (error.response?.data as any)?.message || error.message
        : "Failed to update.";

      Swal.fire({ icon: "error", title: "Oops...", text: msg });
    }
  };

  if (statusesQuery.isLoading || prioritiesQuery.isLoading || usersQuery.isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: '#4facfe' }} />
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={500}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 8,
          border: '1px solid #f1f5f9',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}
      >
        {/* כותרת מעוצבת עם גרדיאנט עדין ברקע */}
        <Box sx={{ p: 3, background: alpha('#f8fafc', 0.5), borderBottom: '1px solid #f1f5f9' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ background: MAIN_GRADIENT, width: 45, height: 45 }}>
              <EditNoteIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#1e293b' }}>
                Update Ticket
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>
                TICKET #{id} • {subject.toUpperCase()}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={4}>

              {/* שדה עדיפות */}
              <TextField
                select
                label={
                  <Stack direction="row" alignItems="center" gap={1}>
                    <SpeedIcon sx={{ fontSize: 18 }} /> Priority
                  </Stack>
                }
                fullWidth
                error={!!errors.priority_id}
                helperText={errors.priority_id?.message}
                {...register("priority_id", { required: "Required", valueAsNumber: true })}
                sx={textFieldStyle}
              >
                {priorityArray.map((p) => (
                  <MenuItem key={p.id} value={p.id} sx={{ fontWeight: 600 }}>{p.name}</MenuItem>
                ))}
              </TextField>

              {/* שדה סטטוס */}
              <TextField
                select
                label={
                  <Stack direction="row" alignItems="center" gap={1}>
                    <LabelIcon sx={{ fontSize: 18 }} /> Status
                  </Stack>
                }
                fullWidth
                error={!!errors.status_id}
                helperText={errors.status_id?.message}
                {...register("status_id", { required: "Required", valueAsNumber: true })}
                sx={textFieldStyle}
              >
                {statusArray.map((s) => (
                  <MenuItem key={s.id} value={s.id} sx={{ fontWeight: 600 }}>{s.name}</MenuItem>
                ))}
              </TextField>

              {/* שדה סוכן אחראי */}
              <TextField
                select
                defaultValue={assigned_to}
                label={
                  <Stack direction="row" alignItems="center" gap={1}>
                    <AssignmentIndIcon sx={{ fontSize: 18 }} /> Assigned Agent
                  </Stack>
                }
                fullWidth
                error={!!errors.assigned_to}
                helperText={errors.assigned_to?.message}
                {...register("assigned_to", { valueAsNumber: true })}
                sx={textFieldStyle}
              >

                {agents.map((a) => (
                  <MenuItem key={a.id} value={a.id} sx={{ fontWeight: 600 }}>
                    {a.name} (ID: {a.id})
                  </MenuItem>
                ))}
              </TextField>

              <Divider sx={{ my: 1, opacity: 0.5 }} />

              {/* כפתור עדכון */}
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                fullWidth
                sx={{
                  py: 1.8,
                  borderRadius: 4,
                  background: MAIN_GRADIENT,
                  fontWeight: 900,
                  fontSize: '1rem',
                  letterSpacing: '0.5px',
                  boxShadow: '0 8px 20px rgba(79, 172, 254, 0.3)',
                  '&:hover': {
                    opacity: 0.9,
                    boxShadow: '0 12px 25px rgba(79, 172, 254, 0.4)',
                  }
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  "SAVE CHANGES"
                )}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Fade>
  );
};

// עיצוב גלובלי לשדות הטקסט כדי לשמור על קו נקי
const textFieldStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 4,
    fontWeight: 600,
    bgcolor: '#fcfdfe',
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4facfe' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 2, borderColor: '#4facfe' }
  },
  '& .MuiInputLabel-root': { fontWeight: 700, color: '#64748b' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#4facfe' }
};
export default UpdateTicket;