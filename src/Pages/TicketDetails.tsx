import { useParams } from "react-router-dom";
import { useState } from "react";
import {
    Stack,
    Button,
    Box,
    Alert,
    Container,
    Paper,
    Typography,
    Drawer,
    Divider,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import GetTicketById from "../Components/GetTicketById";
import ShowComments from "../Components/ShowComments";
import AddComment from "../Components/AddComment";
import { UpdateTicket } from "../Components/UpdateTicket";
import { DeleteTicket } from "../Components/DeleteTicket";
import { useUserContext } from "../Context/UserContext";
import { type Ticket } from "../Types/Ticket";

const TicketDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const ticketId = Number(id);

    const [isEditing, setIsEditing] = useState(false);
    const [ticket, setTicket] = useState<Ticket | null>(null);

    const { user } = useUserContext();
    const role = user?.userDetails?.role;
    const isAdmin = role === "admin";
    const isAgent = role === "agent" || isAdmin;

    if (!ticketId) return <Alert severity="error">Ticket not found</Alert>;

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 4 } }}>
            <Stack spacing={2.5}>
                {/* Header / Actions */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, md: 2.5 },
                        borderRadius: 4,
                        border: "1px solid",
                        borderColor: "divider",
                        background:
                            "linear-gradient(180deg, rgba(25,118,210,0.10) 0%, rgba(156,39,176,0.06) 55%, rgba(0,0,0,0) 100%)",
                    }}
                >
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "stretch", md: "center" }}
                        spacing={1.5}
                    >
                        <Box>
                            <Typography
                                variant="h4"
                                sx={{ fontWeight: 900, letterSpacing: -0.5, lineHeight: 1.1 }}
                            >
                                Ticket Details
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6 }}>
                                Ticket #{ticketId} • view details, updates and conversation
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={1.2} justifyContent="flex-start">
                            {isAgent && (
                                <Button
                                    variant={isEditing ? "outlined" : "contained"}
                                    color={isEditing ? "inherit" : "primary"}
                                    onClick={() => setIsEditing((p) => !p)}
                                    disabled={!ticket}
                                    startIcon={isEditing ? <CloseRoundedIcon /> : <EditOutlinedIcon />}
                                    sx={{
                                        borderRadius: 3,
                                        textTransform: "none",
                                        fontWeight: 800,
                                        px: 2,
                                        py: 1,
                                    }}
                                >
                                    {isEditing ? "Close Edit" : "Edit Ticket"}
                                </Button>
                            )}

                            {isAdmin && ticket && (
                                <Box
                                    sx={{
                                        "& button": {
                                            borderRadius: 3,
                                            textTransform: "none",
                                            fontWeight: 800,
                                            px: 2,
                                            py: 1,
                                        },
                                    }}
                                >
                                    <DeleteTicket id={ticketId} />
                                </Box>
                            )}
                        </Stack>
                    </Stack>
                </Paper>

                {/* Ticket Details Card */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, md: 3 },
                        borderRadius: 4,
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    }}
                >
                    <GetTicketById TicketId={ticketId} onLoaded={setTicket} />
                </Paper>

                {/* Chat Section */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: "1px solid",
                        borderColor: "divider",
                        overflow: "hidden",
                    }}
                >

                    <Divider />

                    {/* Comments */}
                    <Box
                        sx={{
                            p: { xs: 2, md: 2.5 },
                            bgcolor: "background.default",
                        }}
                    >
                        <ShowComments id={ticketId} />
                    </Box>

                    <Divider />

                    {/* Add Comment */}
                    <Box
                        sx={{
                            p: { xs: 2, md: 2.5 },
                            bgcolor:
                                "linear-gradient(180deg, rgba(25,118,210,0.06) 0%, rgba(156,39,176,0.04) 100%)",
                        }}
                    >
                        <AddComment ticketId={ticketId} />
                    </Box>
                </Paper>

                {/* EDIT Drawer (top) */}
                <Drawer
                    anchor="top"
                    open={isEditing && isAgent && !!ticket}
                    onClose={() => setIsEditing(false)}
                    PaperProps={{
                        sx: {
                            borderBottomLeftRadius: 24,
                            borderBottomRightRadius: 24,
                            border: "1px solid",
                            borderColor: "divider",
                            maxHeight: "92vh",
                            overflow: "auto",
                        },
                    }}
                >
                    <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 2, md: 3 } }}>
                        <Stack spacing={2}>
                            <Stack
                                direction={{ xs: "column", md: "row" }}
                                justifyContent="space-between"
                                alignItems={{ xs: "stretch", md: "center" }}
                                spacing={1.5}
                            >
                                <Box>
                                    <Typography
                                        variant="h5"
                                        sx={{ fontWeight: 950, letterSpacing: -0.3 }}
                                    >
                                        Edit Ticket
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        Update status, priority and assignment — without leaving the page
                                    </Typography>
                                </Box>

                                <Button
                                    variant="outlined"
                                    onClick={() => setIsEditing(false)}
                                    startIcon={<CloseRoundedIcon />}
                                    sx={{
                                        borderRadius: 3,
                                        textTransform: "none",
                                        fontWeight: 800,
                                        px: 2,
                                        py: 1,
                                        alignSelf: { xs: "flex-start", md: "center" },
                                    }}
                                >
                                    Close
                                </Button>
                            </Stack>

                            <Divider />

                            {ticket ? (
                                <Box sx={{ pb: 1 }}>
                                    <UpdateTicket
                                        id={ticket.id}
                                        status_id={ticket.status_id}
                                        priority_id={ticket.priority_id}
                                        assigned_to={ticket.assigned_to ?? 0}
                                        subject={ticket.subject}
                                    />
                                </Box>
                            ) : (
                                <Alert severity="info">Loading ticket...</Alert>
                            )}
                        </Stack>
                    </Box>
                </Drawer>
            </Stack>
        </Container>
    );
};

export default TicketDetails;
