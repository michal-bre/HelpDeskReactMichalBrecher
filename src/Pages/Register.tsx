import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { registerApi, type RegisterRequest } from "../Service/Login/register";
import { useUserContext } from "../Context/UserContext";
import { loginApi } from "../Service/Login/login";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
    Container,
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Stack,
    Alert,
    Avatar,
    InputAdornment,
    CircularProgress,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { theme } from "../theme/theme";

type RegisterFormInputs = RegisterRequest & {
    confirmPassword: string;
};

const RegisterForm: React.FC = () => {
    // ...existing code...
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormInputs>();

    const { dispatch: userDispatch } = useUserContext();
    const navigate = useNavigate();
    const password = watch("password");
    const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
        try {
            const { confirmPassword, ...dataToSend } = data;

            await registerApi(dataToSend);

            const loginResult = await loginApi({
                email: dataToSend.email,
                password: dataToSend.password,
            });

            userDispatch({
                type: "LOGIN",
                payload: {
                    token: loginResult.token,
                    userDetails: loginResult.user,
                },
            });

            Swal.fire({
                icon: "success",
                title: "Welcome!",
                text: "נרשמת והתחברת בהצלחה 🎉",
                timer: 1500,
                showConfirmButton: false,
            });

            if (loginResult.user.role === "admin") {
                navigate("/admin/dashboard");
            } else if (loginResult.user.role === "agent") {
                navigate("/agent/dashboard");
            } else {
                navigate("/customer/dashboard");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error instanceof Error ? error.message : "הרישום נכשל",
            });
        }
    };

    const validationAlerts = Object.values(errors).map((err, idx) => (
        <Alert key={idx} severity="error" sx={{ mb: 1 }}>
            {(err as any).message}
        </Alert>
    ));

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
                <Container maxWidth="sm">
                    <Card>
                        <CardContent sx={{ p: { xs: 3, md: 6 } }}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                                    <PersonAddIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                        Create an Account
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Please enter your details to register.
                                    </Typography>
                                </Box>
                            </Stack>

                            {/* validation alerts (UI only) */}
                            {validationAlerts.length > 0 && <Box sx={{ mb: 2 }}>{validationAlerts}</Box>}

                            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                                <Stack spacing={2}>
                                    <TextField
                                        label="Full Name"
                                        placeholder="Enter your full name"
                                        error={!!errors.name}
                                        helperText={errors.name ? (errors.name?.message as string) : ""}
                                        {...register("name", { required: "Name is required" })}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccountCircleIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        label="Email"
                                        type="email"
                                        placeholder="Enter your email"
                                        error={!!errors.email}
                                        helperText={errors.email ? (errors.email?.message as string) : ""}
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Invalid email address",
                                            },
                                        })}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailOutlinedIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        label="Password"
                                        type="password"
                                        placeholder="••••••••"
                                        error={!!errors.password}
                                        helperText={errors.password ? (errors.password?.message as string) : ""}
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: { value: 6, message: "At least 6 characters" },
                                        })}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOutlinedIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        label="Confirm Password"
                                        type="password"
                                        placeholder="••••••••"
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword ? (errors.confirmPassword?.message as string) : ""}
                                        {...register("confirmPassword", {
                                            required: "Please confirm your password",
                                            validate: (value) => value === password || "Passwords do not match",
                                        })}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOutlinedIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} sx={{ py: 1.25 }}>
                                        {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Sign Up"}
                                    </Button>

                                    <Box sx={{ textAlign: "center", mt: 1 }}>
                                        <Typography variant="body2">
                                            Already have an account? <Link to="/login">Log in</Link>
                                        </Typography>
                                    </Box>
                                </Stack>
                            </form>
                        </CardContent>
                    </Card>

                    <Box sx={{ mt: 3, textAlign: "center" }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Join Us!
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Start managing your business effectively with Mi-Client.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default RegisterForm;
