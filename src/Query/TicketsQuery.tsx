import { useQuery } from "@tanstack/react-query";
import { loadTickets } from "../Service/Ticket/loadTicket";
import { useUserContext } from "../Context/UserContext";

export const TICKETS_QUERT_KEY = ["tickets"];

export const useTicketsQuery = () => {
    const { user } = useUserContext();

    return useQuery({
        queryKey: TICKETS_QUERT_KEY,
        queryFn: () => loadTickets(user?.token),
        staleTime: Infinity,
        enabled: !!user?.token,
    });
}