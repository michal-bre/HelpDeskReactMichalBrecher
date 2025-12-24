import axios from "axios";
import { type UserToCreate } from "../../Types/User";

export async function createUser(
  token: string,
  data: UserToCreate
): Promise<void> {
  await axios.post(`${import.meta.env.VITE_API_URL}/users`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
