import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import {
    Alert,
    Box,
    CircularProgress,
    IconButton,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";

import { useUserContext } from "../Context/UserContext";
import { addComment, type AddCommentRequest } from "../Service/Comment/addComment";
import { COMMENTS_QUERY_KEY } from "../Query/CommentsQuery";

type Props = { ticketId: number };

export const AddComment: React.FC<Props> = ({ ticketId }) => {
    const queryClient = useQueryClient();
    const { user } = useUserContext();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AddCommentRequest>();

    const onSubmit = async (data: AddCommentRequest) => {
        try {
            if (!user?.token) {
                Swal.fire({
                    icon: "error",
                    title: "Not authenticated",
                    text: "Please log in again.",
                });
                return;
            }

            await addComment(user.token, ticketId, data);

            await queryClient.invalidateQueries({ queryKey: [...COMMENTS_QUERY_KEY, ticketId] });

            Swal.fire({
                icon: "success",
                title: "Comment Added!",
                text: "Your comment was added successfully.",
            });

            reset();
        } catch (error) {
            console.error("Adding comment failed", error);

            const msg =
                axios.isAxiosError(error)
                    ? (error.response?.data as any)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : "Failed to add comment. Please try again.";

            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: msg,
            });
        }
    };

    return (
        <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.2 }}>
                <ChatRoundedIcon fontSize="small" />
                <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 900, letterSpacing: -0.2 }}
                >
                    Write a reply
                </Typography>
            </Stack>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Paper
                    elevation={0}
                    sx={{
                        p: 1.2,
                        borderRadius: 999,
                        border: "1px solid",
                        borderColor: errors.content ? "error.main" : "divider",
                        background:
                            "linear-gradient(135deg, rgba(25,118,210,0.06) 0%, rgba(156,39,176,0.05) 100%)",
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <TextField
                            placeholder="Type your message…"
                            fullWidth
                            multiline
                            minRows={1}
                            maxRows={4}
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                                sx: {
                                    px: 1.5,
                                    py: 0.6,
                                    fontWeight: 700,
                                    letterSpacing: -0.1,
                                },
                            }}
                            {...register("content", { required: "Comment content is required" })}
                        />

                        <Tooltip title={isSubmitting ? "Sending…" : "Send"}>
                            <span>
                                <IconButton
                                    type="submit"
                                    disabled={isSubmitting}
                                    sx={{
                                        width: 46,
                                        height: 46,
                                        borderRadius: "50%",
                                        color: "#fff",
                                        background:
                                            "linear-gradient(135deg, rgba(25,118,210,1) 0%, rgba(156,39,176,0.95) 100%)",
                                        boxShadow: "0 10px 26px rgba(25,118,210,0.22)",
                                        "&:hover": {
                                            background:
                                                "linear-gradient(135deg, rgba(25,118,210,0.95) 0%, rgba(156,39,176,0.9) 100%)",
                                        },
                                    }}
                                >
                                    {isSubmitting ? (
                                        <CircularProgress size={22} />
                                    ) : (
                                        <SendRoundedIcon />
                                    )}
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Stack>
                </Paper>

                {/* Validation error (UI only) */}
                {errors.content?.message ? (
                    <Alert
                        severity="error"
                        sx={{ mt: 1.2, borderRadius: 3, fontWeight: 700 }}
                    >
                        {errors.content.message}
                    </Alert>
                ) : (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 1, px: 1.2 }}
                    >
                    </Typography>
                )}


            </form>
        </Box>
    );
};

export default AddComment;
