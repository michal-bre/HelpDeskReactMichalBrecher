import axios from "axios";
import { type TicketToCreate } from "../../Types/Ticket";

export async function createTicket(
  token: string,
  data: TicketToCreate
): Promise<void> {
  await axios.post(`${import.meta.env.VITE_API_URL}/tickets`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
