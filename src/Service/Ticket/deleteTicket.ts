import axios from "axios";

export async function deleteTicket(
  token: string,
  id: number
): Promise<void> {
  await axios.delete(`${import.meta.env.VITE_API_URL}/tickets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
