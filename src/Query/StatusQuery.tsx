import { useQuery } from "@tanstack/react-query";
import {getPriorityOrStatus} from "../Service/Status-Priority/getPriorityOrStatus";
import { useUserContext } from "../Context/UserContext";

export const STATUSES_QUERY_KEY = ["statuses"];

export const useStatusQuery = () => { 
    const { user } = useUserContext();
    
    return useQuery({
        queryKey: STATUSES_QUERY_KEY,
        queryFn: () => getPriorityOrStatus('statuses', user?.token),
        staleTime: Infinity,
        enabled: !!user?.token,
    });
}
