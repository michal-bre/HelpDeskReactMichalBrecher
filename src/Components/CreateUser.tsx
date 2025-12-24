import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { 
    Box, Paper, Typography, TextField, Button, MenuItem, 
    Stack, Avatar, InputAdornment, Container 
} from "@mui/material";

import { USERS_QUERY_KEY } from "../Query/UsersQuery";
import { type UserToCreate } from "../Types/User"; 
import { createUser } from "../Service/User/createUser";
import { useUserContext } from "../Context/UserContext";

// אייקונים
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

const MAIN_GRADIENT = "linear-gradient(135deg, #4facfe 0%, #9c27b0 100%)";

export const CreateUser: React.FC = () => {
    const queryClient = useQueryClient();
    const { user } = useUserContext();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UserToCreate>();

    const onSubmit = async (data: UserToCreate) => {
        try {
            if (!user?.token) {
                Swal.fire({ icon: "error", title: "Not authenticated", text: "Please log in again." });
                return;
            }

            await createUser(user.token, data);

            Swal.fire({
                icon: "success",
                title: "User Created!",
                text: "The user was created successfully.",
                confirmButtonColor: '#4facfe'
            });

            reset(); // איפוס הטופס אחרי הצלחה
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        } catch (error) {
            console.error("Creating user failed", error);
            const msg = axios.isAxiosError(error) 
                ? error.response?.data?.message || error.message 
                : "Failed to create user.";
            Swal.fire({ icon: "error", title: "Oops...", text: msg });
        }
    };

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
                {/* Header הטופס */}
                <Stack alignItems="center" spacing={2} sx={{ mb: 5 }}>
                    <Avatar sx={{ 
                        background: MAIN_GRADIENT, 
                        width: 64, height: 64,
                        boxShadow: '0 10px 20px rgba(79, 172, 254, 0.2)'
                    }}>
                        <PersonAddAlt1RoundedIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box textAlign="center">
                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-1px' }}>
                            New User
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                            Fill in the details to create a new team member
                        </Typography>
                    </Box>
                </Stack>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack spacing={3}>
                        
                        {/* Full Name */}
                        <TextField
                            fullWidth
                            label="Full Name"
                            placeholder="e.g. John Doe"
                            {...register("name", { required: "Full name is required" })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><BadgeOutlinedIcon sx={{ color: '#4facfe' }} /></InputAdornment>,
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />

                        {/* Email */}
                        <TextField
                            fullWidth
                            type="email"
                            label="Email Address"
                            placeholder="john@example.com"
                            {...register("email", {
                                required: "Email is required",
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" }
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ color: '#4facfe' }} /></InputAdornment>,
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />

                        {/* Password */}
                        <TextField
                            fullWidth
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "At least 6 characters" }
                            })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: '#4facfe' }} /></InputAdornment>,
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />

                        {/* Role Selection */}
                        <TextField
                            select
                            fullWidth
                            label="Role"
                            defaultValue=""
                            {...register("role", { required: "Role is required" })}
                            error={!!errors.role}
                            helperText={errors.role?.message}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        >
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="agent">Agent</MenuItem>
                            <MenuItem value="customer">Customer</MenuItem>
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
                                boxShadow: '0 10px 20px rgba(79, 172, 254, 0.3)',
                                '&:hover': {
                                    background: MAIN_GRADIENT,
                                    opacity: 0.9,
                                    boxShadow: '0 15px 25px rgba(79, 172, 254, 0.4)',
                                }
                            }}
                        >
                            {isSubmitting ? "Creating..." : "Create User Account"}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};