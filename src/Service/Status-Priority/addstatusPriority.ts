import axios from "axios";

export type StatusOrPriorityType = "statuses" | "priorities";

export type StatusOrPriorityFormInput = {
  name: string;
};

export async function addStatusOrPriority(
  token: string,
  type: StatusOrPriorityType,
  data: StatusOrPriorityFormInput
): Promise<void> {
  await axios.post(`${import.meta.env.VITE_API_URL}/${type}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
