import React, { createContext, useContext, useReducer } from "react";
import { type UserDetails } from "../Types/User";

interface User {
  token: string;
  userDetails: UserDetails;
}

export type Action =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" };

interface UserContextType {
  user: User | null;
  dispatch: React.Dispatch<Action>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const initUser = (): User | null => {
  const token = localStorage.getItem("token");
  const userDetails = localStorage.getItem("userDetails");

  if (!token || !userDetails) return null;

  return {
    token,
    userDetails: JSON.parse(userDetails),
  };
};

function userReducer(state: User | null, action: Action): User | null {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem(
        "userDetails",
        JSON.stringify(action.payload.userDetails)
      );
      return action.payload;

    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("userDetails");
      return null;

    default:
      return state;
  }
}

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, dispatch] = useReducer(userReducer, null, initUser);

  return (
    <UserContext.Provider value={{ user, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUserContext must be used inside UserProvider");
  }
  return ctx;
};
