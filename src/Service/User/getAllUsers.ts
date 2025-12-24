import axios from "axios";
import Swal from "sweetalert2";

export const getAllUsers = async (token: string | undefined) => {
  if (!token) {
    return [];
  }

  try {
    const res = await axios.get(
      import.meta.env.VITE_API_URL + "/users",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Loading users failed", error);

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text:
        error instanceof Error
          ? error.message
          : "טעינת המשתמשים נכשלה! אנא נסה שוב.",
    });

    return [];
  }
};
