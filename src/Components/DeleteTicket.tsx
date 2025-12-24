import React from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

import { useUserContext } from "../Context/UserContext";
import { deleteTicket } from "../Service/Ticket/deleteTicket";
import { TICKETS_QUERT_KEY } from "../Query/TicketsQuery";
import { useNavigate } from "react-router-dom";

type Props = {
  id: number;
  onDeleted?: () => void;
};

export const DeleteTicket: React.FC<Props> = ({ id, onDeleted }) => {
  const { user } = useUserContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Ticket?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      if (!user?.token) {
        Swal.fire("Not authenticated", "Please log in again.", "error");
        return;
      }

      await deleteTicket(user.token, id);

      await queryClient.invalidateQueries({ queryKey: TICKETS_QUERT_KEY });

      Swal.fire("Deleted!", "The ticket has been deleted.", "success");

      onDeleted?.();
      navigate("/tickets");
    } catch (error) {
      console.error("Deleting ticket failed", error);

      const msg =
        axios.isAxiosError(error)
          ? (error.response?.data as any)?.message || error.message
          : error instanceof Error
          ? error.message
          : "Failed to delete the ticket.";

      Swal.fire("Oops...", msg, "error");
    }
  };

  return (
    <button onClick={handleDelete} className="btn btn--danger">
      Delete Ticket
    </button>
  );
};
