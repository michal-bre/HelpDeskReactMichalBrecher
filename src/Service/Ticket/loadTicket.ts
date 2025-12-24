import axios from "axios";
import Swal from "sweetalert2";
import { type Ticket } from "../../Types/Ticket";

export const loadTickets = async (token: string | undefined) => {
  if (!token) {
    return [];
  }

  try {
    const res = await axios.get(
      import.meta.env.VITE_API_URL + "/tickets",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data as Ticket[];
  } catch (error) {
    console.error("Loading tickets failed", error);

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text:
        error instanceof Error
          ? error.message
          : "טעינת הכרטיסים נכשלה! אנא נסה שוב.",
    });

    return [];
  }
};
