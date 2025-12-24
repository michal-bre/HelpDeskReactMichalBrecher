import axios from "axios";

export type AddCommentRequest = {
  content: string;
};

export async function addComment(
  token: string,
  ticketId: number,
  data: AddCommentRequest
): Promise<void> {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/tickets/${ticketId}/comments`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}
