import { useQuery } from "@tanstack/react-query";
import { getPriorityOrStatus } from "../Service/Status-Priority/getPriorityOrStatus";
import { useUserContext } from "../Context/UserContext";

export const PRIORITIES_QUERY_KEY = ["priorities"];

export const usePriorityQuery = () => { 
    const { user } = useUserContext();

    return useQuery({
        queryKey: PRIORITIES_QUERY_KEY,
        queryFn: () => getPriorityOrStatus('priorities', user?.token),
        staleTime: Infinity,
        enabled: !!user?.token,
    });
}
