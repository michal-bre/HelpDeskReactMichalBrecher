import Swal from "sweetalert2";
import axios from "axios";

export type PriorityOrStatusType = "priorities" | "statuses";

export async function getPriorityOrStatus<T = unknown>(
  type: PriorityOrStatusType,
  token?: string
): Promise<T | null> {
  if (!token) return null;

  try {
    const res = await axios.get<T>(
      `${import.meta.env.VITE_API_URL}/${type}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(`${type} loaded successfully:`);
    return res.data;
  } catch (error) {
    console.error(`Loading ${type} failed`, error);

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text:
        error instanceof Error
          ? error.message
          : `טעינת ה${type} נכשלה! אנא נסה שוב.`,
    });

    return null; 
  }
}
