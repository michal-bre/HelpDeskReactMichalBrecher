import React from "react";
import { useNavigate } from "react-router-dom";
import { useTicketsQuery } from "../Query/TicketsQuery";
import { type Ticket } from "../Types/Ticket";
import {
  Box,
  Card,
  CardContent,
  Button,
  Stack,
  Typography,
  Chip,
  Paper,
  Skeleton,
  Alert,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

const MAIN_GRADIENT =
  "linear-gradient(135deg, rgba(25,118,210,1) 0%, rgba(156,39,176,0.95) 100%)";

const SOFT_GRADIENT =
  "linear-gradient(135deg, rgba(25,118,210,0.14) 0%, rgba(156,39,176,0.12) 100%)";

type Props = {
  TicketId: number;
  onLoaded?: (ticket: Ticket) => void;
};

const InfoCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => (
  <Paper
    elevation={0}
    sx={{
      flex: "1 1 220px",
      p: 2,
      borderRadius: 4,
      border: "1px solid",
      borderColor: "divider",
      backgroundImage: SOFT_GRADIENT,
    }}
  >
    <Stack direction="row" spacing={1.2} alignItems="center">
      <Avatar
        sx={{
          width: 36,
          height: 36,
          backgroundImage: MAIN_GRADIENT,
          color: "#fff",
        }}
      >
        {icon}
      </Avatar>

      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 900 }}>
          {label}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 950, letterSpacing: -0.2 }}
          noWrap
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  </Paper>
);

const GetTicketById: React.FC<Props> = ({ TicketId, onLoaded }) => {
  const navigate = useNavigate();
  const { data: tickets, isLoading, isError } = useTicketsQuery();

  const ticket = (tickets as Ticket[] | undefined)?.find((t) => t.id === TicketId);

  React.useEffect(() => {
    if (ticket) onLoaded?.(ticket);
  }, [ticket, onLoaded]);

  if (isLoading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={70} />
        <Skeleton variant="rounded" height={220} />
        <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" height={86} sx={{ flex: "1 1 220px" }} />
          ))}
        </Stack>
      </Stack>
    );
  }

  if (isError) {
    return <Alert severity="error">Error fetching ticket data.</Alert>;
  }

  if (!ticket) {
    return (
      <Alert severity="warning">
        Ticket #{TicketId} not found.{" "}
        <Button size="small" onClick={() => navigate("/tickets")}>
          Return to list
        </Button>
      </Alert>
    );
  }

  return (
    <Stack spacing={2.2} sx={{ py: 1 }}>
      {/* Back */}
      <Button
        startIcon={<ArrowBackIcon />}
        variant="text"
        onClick={() => navigate(-1)}
        sx={{ alignSelf: "flex-start", fontWeight: 900 }}
      >
        Back
      </Button>

      {/* Main Card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 5,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: -2,
            backgroundImage:
              "linear-gradient(135deg, rgba(25,118,210,0.14), rgba(156,39,176,0.12), rgba(0,0,0,0))",
            filter: "blur(16px)",
            opacity: 0.9,
            zIndex: 0,
          },
        }}
      >
        <CardContent sx={{ position: "relative", zIndex: 1 }}>
          <Stack spacing={2.2}>
            {/* Header */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1.2}
            >
              <Box sx={{ minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      backgroundImage: MAIN_GRADIENT,
                      color: "#fff",
                      fontWeight: 900,
                    }}
                  >
                    <ConfirmationNumberRoundedIcon fontSize="small" />
                  </Avatar>

                  <Typography variant="caption" sx={{ fontWeight: 900, color: "text.secondary" }}>
                    Ticket #{ticket.id}
                  </Typography>
                </Stack>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 950,
                    letterSpacing: -0.4,
                    mt: 0.8,
                    lineHeight: 1.15,
                    wordBreak: "break-word",
                  }}
                >
                  {ticket.subject || "Untitled"}
                </Typography>
              </Box>

              {/* Status chip with gradient (same style language as chat) */}
              <Chip
                label={ticket.status_name || "Unknown"}
                sx={{
                  fontWeight: 950,
                  color: "#fff",
                  px: 1,
                  height: 34,
                  borderRadius: 999,
                  backgroundImage: MAIN_GRADIENT,
                  boxShadow: "0 12px 24px rgba(156,39,176,0.18)",
                  textTransform: "capitalize",
                  alignSelf: { xs: "flex-start", sm: "center" },
                }}
              />
            </Stack>

            {/* Description bubble (chat-like) */}
            <Box
              sx={{
                p: 2.1,
                borderRadius: 4,
                border: "1px solid rgba(25,118,210,0.18)",
                backgroundImage: SOFT_GRADIENT,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 950, mb: 0.8 }}>
                Description
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 750,
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {ticket.description || "No description provided."}
              </Typography>
            </Box>

            {/* Info cards (no Grid) */}
            <Stack
              direction="row"
              spacing={2}
              useFlexGap
              sx={{
                flexWrap: "wrap",
              }}
            >
              <InfoCard
                icon={<FlagRoundedIcon fontSize="small" />}
                label="Priority"
                value={ticket.priority_name || "—"}
              />

              <InfoCard
                icon={<PersonRoundedIcon fontSize="small" />}
                label="Assigned To"
                value={ticket.assigned_to || "—"}
              />

              <InfoCard
                icon={<CalendarMonthRoundedIcon fontSize="small" />}
                label="Created"
                value={ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : "—"}
              />

              <InfoCard
                icon={<PersonRoundedIcon fontSize="small" />}
                label="Created By"
                value={ticket.created_by_name || "—"}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default GetTicketById;
