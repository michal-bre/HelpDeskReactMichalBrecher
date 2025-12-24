import React, { useMemo } from "react";
import { 
    Box, Typography, Paper, Stack, Container, 
    Avatar, Button, alpha, CircularProgress 
} from "@mui/material";
import { 
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "../Context/UserContext";
import { useTicketsQuery } from "../Query/TicketsQuery";
import { getPriorityOrStatus } from "../Service/Status-Priority/getPriorityOrStatus"; // וודא שהנתיב תקין

// אייקונים
import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const MAIN_GRADIENT = "linear-gradient(135deg, #4facfe 0%, #9c27b0 100%)";

const AgentDashboard: React.FC = () => {
    const { user } = useUserContext();
    const token = user?.token;
    const navigate = useNavigate();
    
    // שליפת נתונים
    const { data: ticketsData, isLoading: ticketsLoading } = useTicketsQuery();
    const { data: statusesData, isLoading: statusesLoading } = useQuery({
        queryKey: ['statuses'],
        queryFn: () => getPriorityOrStatus<any[]>("statuses", token),
        enabled: !!token
    });

    const agentName = user?.userDetails?.name ?? "Agent";
    const agentId = user?.userDetails?.id;

    const stats = useMemo(() => {
        const allTickets = (ticketsData ?? []) as any[];
        const allStatuses = (statusesData ?? []) as any[];
        const myTickets = allTickets.filter(t => t.assigned_to === agentId);

        // יצירת נתונים לגרף על בסיס כל הסטטוסים מה-API
        const chartData = allStatuses.map(status => ({
            name: status.name,
            value: myTickets.filter(t => t.status_id === status.id).length
        }));

        const pending = myTickets.filter(t => t.status_id === 1).length;
        const completed = myTickets.filter(t => t.status_id === 2).length;

        return { 
            total: myTickets.length, 
            pending, 
            completed, 
            chartData, 
            recentTickets: myTickets.slice(0, 4) 
        };
    }, [ticketsData, statusesData, agentId]);

    if (ticketsLoading || statusesLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress sx={{ color: '#4facfe' }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ 
                mb: 6, display: 'flex', flexWrap: 'wrap', 
                justifyContent: 'space-between', alignItems: 'center', gap: 2 
            }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-1.5px' }}>
                        Hello, {agentName}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                        You have <span style={{ color: '#9c27b0', fontWeight: 800 }}>{stats.pending}</span> tickets waiting for you.
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    onClick={() => navigate("/tickets")}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ 
                        background: MAIN_GRADIENT, borderRadius: "14px", px: 4, py: 1.5, 
                        fontWeight: 800, fontSize: '1rem', boxShadow: '0 10px 20px rgba(156, 39, 176, 0.2)'
                    }}
                >
                    MY TICKETS
                </Button>
            </Box>

            {/* KPI Section */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
                {[
                    { label: "Assigned To Me", value: stats.total, icon: <AssignmentIcon />, color: '#4facfe' },
                    { label: "Pending Tasks", value: stats.pending, icon: <PendingActionsIcon />, color: '#9c27b0' },
                    { label: "Completed", value: stats.completed, icon: <CheckCircleOutlineIcon />, color: '#3e32e5ff' },
                ].map((item, index) => (
                    <Paper key={index} elevation={0} sx={{ 
                        flex: '1 1 300px', p: 3, borderRadius: 6, border: '1px solid #f1f5f9',
                        transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar sx={{ bgcolor: alpha(item.color, 0.1), color: item.color, borderRadius: 3 }}>
                                {item.icon}
                            </Avatar>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 900 }}>{item.value}</Typography>
                                <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 700 }}>{item.label}</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                ))}
            </Box>

            {/* Content Section */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                <Paper sx={{ flex: '1 1 500px', p: 4, borderRadius: 7, border: '1px solid #f1f5f9' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, color: '#334155' }}>Status Load</Typography>
                    <Box sx={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={stats.chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4facfe" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#4facfe" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}}
                                    interval={0}
                                />
                                <YAxis hide domain={[0, (dataMax) => dataMax + 2]} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#4facfe" 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#colorValue)"
                                    dot={{ r: 4, fill: '#4facfe', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>

                {/* Recent Feed */}
                <Paper sx={{ flex: '1 1 350px', p: 4, borderRadius: 7, border: '1px solid #f1f5f9' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Recent Assignments</Typography>
                    <Stack spacing={2.5}>
                        {stats.recentTickets.map((ticket: any) => (
                            <Box key={ticket.id} sx={{ 
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                p: 2, borderRadius: 4, bgcolor: '#fcfdfe', border: '1px solid #f1f5f9'
                            }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ 
                                        width: 38, height: 38, background: MAIN_GRADIENT, 
                                        fontSize: '0.9rem', fontWeight: 700 
                                    }}>
                                        {ticket.subject?.[0].toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                            {ticket.subject.length > 20 ? ticket.subject.substring(0, 20) + '...' : ticket.subject}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>ID: #{ticket.id}</Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        ))}
                        {stats.recentTickets.length === 0 && (
                            <Typography variant="body2" sx={{ textAlign: 'center', color: '#94a3b8', py: 4 }}>
                                All caught up! No active tickets.
                            </Typography>
                        )}
                    </Stack>
                </Paper>
            </Box>
        </Container>
    );
};

export default AgentDashboard;