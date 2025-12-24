import axios from "axios";
import Swal from "sweetalert2";

export const getComments = async (ticketId: number, token: string | undefined) => {
  if (!token) return [];

  try {
    const res = await axios.get(
      import.meta.env.VITE_API_URL + `/tickets/${ticketId}/comments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Loading comments failed", error);

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text:
        error instanceof Error
          ? error.message
          : "טעינת התגובות נכשלה! אנא נסה שוב.",
    });

    return [];
  }
};
