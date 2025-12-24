import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../Service/User/getAllUsers";
import { useUserContext } from "../Context/UserContext";

export const USERS_QUERY_KEY = ["users"];


export const useUsersQuery = () => {
  const { user } = useUserContext();

  return useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(user?.token),
    staleTime: Infinity,
    enabled: !!user?.token && user.userDetails.role == "admin",
  });
};
