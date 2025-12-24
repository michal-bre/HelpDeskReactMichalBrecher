import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../Context/UserContext";
import { loginApi, type LoginRequest } from "../Service/Login/login";
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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { theme } from "../theme/theme";

type LoginFormInputs = LoginRequest;

export const LoginForm: React.FC = () => {
	const navigate = useNavigate();
	const { dispatch: userDispatch } = useUserContext();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormInputs>();

	const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
		try {
			const result = await loginApi(data);

			Swal.fire({
				icon: "success",
				title: "Logged in!",
				text: "התחברת בהצלחה.",
				timer: 1500,
				showConfirmButton: false,
			});

			userDispatch({
				type: "LOGIN",
				payload: { token: result.token, userDetails: result.user },
			});

			if (result.user.role === "admin") navigate("/admin/dashboard");
			else if (result.user.role === "agent") navigate("/agent/dashboard");
			else navigate("/customer/dashboard");
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: error instanceof Error ? error.message : "התחברות נכשלה!",
			});
		}
	};

	// Collect field validation alerts (UI-only)
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
									<LockOutlinedIcon />
								</Avatar>
								<Box>
									<Typography variant="h5" sx={{ fontWeight: 700 }}>
										Sign In
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Welcome back! Please enter your details.
									</Typography>
								</Box>
							</Stack>

							{/* validation alerts (UI only) */}
							{validationAlerts.length > 0 && <Box sx={{ mb: 2 }}>{validationAlerts}</Box>}

							<form onSubmit={handleSubmit(onSubmit)} noValidate>
								<Stack spacing={2}>
									<TextField
										label="Email"
										placeholder="Enter your email"
										error={!!errors.email}
										helperText={errors.email ? (errors.email?.message as string) : ""}
										{...register("email", {
											required: "חובה להזין אימייל",
											pattern: {
												value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
												message: "אימייל לא תקין",
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
											required: "חובה להזין סיסמה",
											minLength: { value: 6, message: "לפחות 6 תווים" },
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
										{isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Sign In"}
									</Button>

									<Box sx={{ textAlign: "center", mt: 1 }}>
										<Typography variant="body2">
											Don't have an account? <a href="/register">Sign up</a>
										</Typography>
									</Box>
								</Stack>
							</form>
						</CardContent>
					</Card>

					<Box sx={{ mt: 3, textAlign: "center" }}>
						<Typography variant="h6" sx={{ fontWeight: 700 }}>
							Welcome back!
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Please sign in to your Mi-Client account to manage your business effectively.
						</Typography>
					</Box>
				</Container>
			</Box>
		</ThemeProvider>
	);
};

export default LoginForm;
