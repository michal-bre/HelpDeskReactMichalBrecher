import { type Action } from "../../Context/UserContext";
import { QueryClient } from "@tanstack/react-query";

export function logout(
  dispatch: React.Dispatch<Action>,
  queryClient: QueryClient
) {
  dispatch({ type: "LOGOUT" });
  queryClient.clear(); 
}
