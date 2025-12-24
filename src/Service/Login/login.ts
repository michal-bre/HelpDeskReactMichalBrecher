import axios from "axios";

export type UserRole = "admin" | "agent" | "customer";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
};

export async function loginApi(data: LoginRequest): Promise<LoginResponse> {
  const res = await axios.post<LoginResponse>(
    `${import.meta.env.VITE_API_URL}/auth/login`,
    data
  );
  return res.data;
}
