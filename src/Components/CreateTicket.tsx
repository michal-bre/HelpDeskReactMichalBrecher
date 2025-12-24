import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { 
    Box, Paper, Typography, TextField, Button, MenuItem, 
    Stack, Avatar, InputAdornment, Container, CircularProgress 
} from "@mui/material";

import { useUserContext } from "../Context/UserContext";
import { useStatusQuery } from "../Query/StatusQuery";      
import { usePriorityQuery } from "../Query/PriorityQuery";   
import { TICKETS_QUERT_KEY } from "../Query/TicketsQuery";         
import { createTicket } from "../Service/Ticket/createTicket";         

import { type TicketToCreate } from "../Types/Ticket";       
import { type StatusOrPriority } from "../Types/StatusPriority"; 

// אייקונים
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SubjectIcon from '@mui/icons-material/Subject';
import DescriptionIcon from '@mui/icons-material/Description';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

const MAIN_GRADIENT = "linear-gradient(135deg, #4facfe 0%, #9c27b0 100%)";

export const CreateTicket: React.FC = () => {
    const queryClient = useQueryClient();
    const { user } = useUserContext();

    const statusesQuery = useStatusQuery();
    const prioritiesQuery = usePriorityQuery();

    const statusArray = (statusesQuery.data ?? []) as StatusOrPriority[];
    const priorityArray = (prioritiesQuery.data ?? []) as StatusOrPriority[];

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TicketToCreate>();

    const onSubmit: SubmitHandler<TicketToCreate> = async (data) => {
        try {
            if (!user?.token) {
                Swal.fire({ icon: "error", title: "Not authenticated", text: "Please log in again." });
                return;
            }

            const openStatusId = statusArray.find((s) => s.name.toLowerCase() === "open")?.id ?? 1;

            const newTicket: TicketToCreate = {
                ...data,
                status_id: openStatusId,
                assigned_to: 2, 
            };

            await createTicket(user.token, newTicket);

            Swal.fire({
                icon: "success",
                title: "Ticket Created!",
                text: "Your ticket has been created successfully.",
                confirmButtonColor: '#4facfe'
            });

            reset();
            queryClient.invalidateQueries({ queryKey: TICKETS_QUERT_KEY });
        } catch (error) {
            console.error("Creating ticket failed", error);
            const msg = axios.isAxiosError(error) ? error.response?.data?.message : "Failed to create ticket.";
            Swal.fire({ icon: "error", title: "Oops...", text: msg });
        }
    };

    if (statusesQuery.isLoading || prioritiesQuery.isLoading) {
        return (
            <Box display="flex" justifyContent="center" py={10}>
                <CircularProgress sx={{ color: '#4facfe' }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper 
                elevation={0} 
                sx={{ 
                    p: { xs: 3, md: 5 }, 
                    borderRadius: 8, 
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05)',
                    bgcolor: 'white'
                }}
            >
                {/* Header */}
                <Stack alignItems="center" spacing={2} sx={{ mb: 5 }}>
                    <Avatar sx={{ 
                        background: MAIN_GRADIENT, 
                        width: 64, height: 64,
                        boxShadow: '0 10px 20px rgba(156, 39, 176, 0.2)'
                    }}>
                        <ConfirmationNumberIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box textAlign="center">
                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-1px' }}>
                            New Support Ticket
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                            Tell us what's happening and we'll help you out
                        </Typography>
                    </Box>
                </Stack>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack spacing={3}>
                        
                        {/* Subject */}
                        <TextField
                            fullWidth
                            label="Subject"
                            placeholder="Briefly describe the issue"
                            {...register("subject", { required: "Subject is required" })}
                            error={!!errors.subject}
                            helperText={errors.subject?.message}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SubjectIcon sx={{ color: '#4facfe' }} /></InputAdornment>,
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />

                        {/* Description */}
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Description"
                            placeholder="Provide more details..."
                            {...register("description", { required: "Description is required" })}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            InputProps={{
                                startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><DescriptionIcon sx={{ color: '#4facfe' }} /></InputAdornment>,
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />

                        {/* Priority Selection */}
                        <TextField
                            select
                            fullWidth
                            label="Priority Level"
                            defaultValue=""
                            {...register("priority_id", { required: "Priority is required" })}
                            error={!!errors.priority_id}
                            helperText={errors.priority_id?.message}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><PriorityHighIcon sx={{ color: '#9c27b0' }} /></InputAdornment>,
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        >
                            {priorityArray.map((p) => (
                                <MenuItem key={p.id} value={p.id}>
                                    {p.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            fullWidth
                            disabled={isSubmitting}
                            variant="contained"
                            sx={{
                                py: 1.8,
                                borderRadius: 3,
                                background: MAIN_GRADIENT,
                                fontWeight: 800,
                                fontSize: '1rem',
                                textTransform: 'none',
                                boxShadow: '0 10px 20px rgba(156, 39, 176, 0.25)',
                                '&:hover': {
                                    background: MAIN_GRADIENT,
                                    opacity: 0.9,
                                    transform: 'translateY(-1px)'
                                },
                                transition: 'all 0.2s'
                            }}
                        >
                            {isSubmitting ? "Creating Ticket..." : "Open Support Ticket"}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

