import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../Context/UserContext";
import { loadTickets } from "../Service/Ticket/loadTicket";
import { useStatusQuery } from "../Query/StatusQuery";
import { type Ticket } from "../Types/Ticket";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Skeleton,
  Stack,
  Typography,
  alpha,
} from "@mui/material";

// אייקונים
import AddIcon from "@mui/icons-material/Add";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import BarChartIcon from "@mui/icons-material/BarChart";
import HistoryIcon from "@mui/icons-material/History";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const MAIN_GRADIENT = "linear-gradient(135deg, #4facfe 0%, #9c27b0 100%)";

const CustomerDashboard: React.FC = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { data: statuses } = useStatusQuery();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState<string | null>(null);

  const customerName = user?.userDetails?.name ?? "Customer";

  useEffect(() => {
    const fetchTickets = async () => {
      setTicketsLoading(true);
      setTicketsError(null);
      try {
        const data = await loadTickets(user?.token);
        setTickets(data || []);
      } catch (err) {
        setTicketsError(err instanceof Error ? err.message : "Failed to load tickets");
        setTickets([]);
      } finally {
        setTicketsLoading(false);
      }
    };

    if (user?.token) fetchTickets();
  }, [user?.token]);

  const statusCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    tickets.forEach((t) => {
      counts[t.status_id] = (counts[t.status_id] || 0) + 1;
    });

    const statusList = Array.isArray(statuses) ? statuses : [];
    return statusList.map((status: any) => ({
      id: status.id,
      label: status.name || "Unknown",
      count: counts[status.id] || 0,
    }));
  }, [tickets, statuses]);

  const latestTickets = useMemo(() => {
    return [...tickets]
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, 4);
  }, [tickets]);

  const getStatusName = (id: number) => (statuses as any[])?.find(s => s.id === id)?.name || "Unknown";

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack spacing={4}>
        
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', 
          alignItems: 'center', gap: 3, mb: 2 
        }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-1.5px' }}>
              Welcome back, {customerName}
            </Typography>
            <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 500 }}>
              Need help? Create a ticket and we'll be right with you.
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/ticket/new")}
              sx={{
                background: MAIN_GRADIENT, borderRadius: "14px", px: 3, py: 1.5,
                fontWeight: 800, boxShadow: '0 10px 20px rgba(156, 39, 176, 0.2)'
              }}
            >
              NEW TICKET
            </Button>
            <Button
              variant="outlined"
              startIcon={<ConfirmationNumberIcon />}
              onClick={() => navigate("/tickets")}
              sx={{
                borderRadius: "14px", px: 3, py: 1.5, fontWeight: 800,
                borderColor: '#4facfe', color: '#4facfe', borderWidth: 2,
                '&:hover': { borderWidth: 2, borderColor: '#9c27b0', color: '#9c27b0' }
              }}
            >
              MY TICKETS
            </Button>
          </Stack>
        </Box>

        {ticketsError && <Alert severity="error" sx={{ borderRadius: 4 }}>{ticketsError}</Alert>}

        {/* Dashboard Content */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          
          {/* Status Overview Card */}
          <Paper sx={{ flex: '1 1 500px', p: 4, borderRadius: 7, border: '1px solid #f1f5f9', bgcolor: '#fff' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 4 }}>
              <Avatar sx={{ bgcolor: alpha('#4facfe', 0.1), color: '#4facfe' }}>
                <BarChartIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#334155' }}>
                Ticket Status Overview
              </Typography>
            </Stack>

            <Stack spacing={3}>
              {statusCounts.map((s) => {
                const maxCount = Math.max(...statusCounts.map((i) => i.count), 1);
                const pct = Math.round((s.count / maxCount) * 100);
                return (
                  <Box key={s.id}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{s.label}</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#4facfe' }}>{s.count}</Typography>
                    </Stack>
                    <Box sx={{ height: 12, borderRadius: 10, bgcolor: '#f1f5f9', overflow: 'hidden' }}>
                      <Box sx={{ 
                        height: '100%', width: `${pct}%`, background: MAIN_GRADIENT, 
                        borderRadius: 10, transition: 'width 1s ease-in-out' 
                      }} />
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Paper>

          {/* Recent Activity Card */}
          <Paper sx={{ flex: '1 1 350px', p: 4, borderRadius: 7, border: '1px solid #f1f5f9' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
              <Avatar sx={{ bgcolor: alpha('#9c27b0', 0.1), color: '#9c27b0' }}>
                <HistoryIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#334155' }}>
                Latest Tickets
              </Typography>
            </Stack>

            <Stack spacing={2}>
              {ticketsLoading ? (
                [1, 2, 3].map((i) => <Skeleton key={i} height={70} sx={{ borderRadius: 4 }} />)
              ) : latestTickets.length === 0 ? (
                <Typography variant="body2" sx={{ textAlign: 'center', py: 4, color: '#94a3b8' }}>
                  No tickets found. Need help?
                </Typography>
              ) : (
                latestTickets.map((ticket) => (
                  <Box 
                    key={ticket.id}
                    onClick={() => navigate(`/tickets`)}
                    sx={{ 
                      p: 2, borderRadius: 4, bgcolor: '#f8fafc', border: '1px solid #f1f5f9',
                      cursor: 'pointer', transition: '0.2s', '&:hover': { bgcolor: '#f1f5f9' },
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 800 }} noWrap>
                        {ticket.subject}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        ID: #{ticket.id} • {new Date(ticket.created_at || "").toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip 
                      label={getStatusName(ticket.status_id)} 
                      size="small" 
                      sx={{ 
                        fontWeight: 800, fontSize: '0.65rem',
                        bgcolor: ticket.status_id === 1 ? alpha('#4facfe', 0.1) : alpha('#94a3b8', 0.1),
                        color: ticket.status_id === 1 ? '#4facfe' : '#64748b'
                      }} 
                    />
                  </Box>
                ))
              )}
              
              <Button 
                fullWidth 
                endIcon={<ArrowForwardIosIcon sx={{ fontSize: '10px !important' }} />}
                onClick={() => navigate("/tickets")}
                sx={{ mt: 1, fontWeight: 800, color: '#94a3b8' }}
              >
                VIEW ALL
              </Button>
            </Stack>
          </Paper>

        </Box>
      </Stack>
    </Container>
  );
};

export default CustomerDashboard;