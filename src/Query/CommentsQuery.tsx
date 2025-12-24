import { useQuery } from "@tanstack/react-query";
import { getComments } from "../Service/Comment/getComments";
import { useUserContext } from "../Context/UserContext";

export const COMMENTS_QUERY_KEY = ["comments"];

export const useCommentsQuery = (ticketId: number) => {
    const { user } = useUserContext();

    return useQuery({
        queryKey: [...COMMENTS_QUERY_KEY, ticketId],
        queryFn: () => getComments(ticketId, user?.token),
        staleTime: Infinity,
        enabled: !!user?.token,
    });
}
