import axios from "axios";

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export async function registerApi(data: RegisterRequest): Promise<void> {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/register`,
    data
  );
  return res.data;
}
