import axios from "axios";
import { type TicketToUpdate } from "../../Types/Ticket";

export async function updateTicket(
  token: string,
  id: number,
  data: Partial<TicketToUpdate>
): Promise<void> {
  await axios.patch(`${import.meta.env.VITE_API_URL}/tickets/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
