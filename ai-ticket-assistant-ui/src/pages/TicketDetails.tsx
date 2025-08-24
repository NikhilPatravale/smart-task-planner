import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Ticket } from "../types/types";

function TicketDetails() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [ticket, setTicket] = useState<Ticket>({
    _id: "",
    title: "",
    description: "",
    status: "TODO",
    createdBy: "",
    assignedTo: null,
    createdAt: null,
    deadline: "",
    helpfulNotes: "",
    priority: "",
    relatedSkills: [""],
  });
  const { id: ticketId } = useParams();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ticket/${ticketId}`, {
          credentials: "include",
        });
        if (response.ok) {
          const { ticket } = await response.json();
          setTicket(ticket);
        }
      } catch (error) {
        console.error("❌ Error while fetching tickets", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  const {
    title,
    description,
    helpfulNotes,
    relatedSkills = [],
    status,
    createdBy,
    assignedTo,
    priority,
    deadline
  } = ticket;

  return (
    <div className="max-w-11/12 mx-auto p-2">
      {isLoading
        ? <div>
          <div className="skeleton h-10  w-full my-4" />
          <div className="border-b-2" />
          <div className="skeleton h-60  w-full my-4" />
        </div>
        : <div className="card w-full bg-base-100 card-xl shadow-xl">
          <div className="card-body p-2 mt-2">
            <h2 className="card-title text-2xl pb-2 border-b-2 ">{title}</h2>
            <p className="font-bold mt-2">Description</p>
            <p>{description}</p>
            <p className="font-bold mt-2">Helpful Notes</p>
            <p>{helpfulNotes || "Not Assigned"}</p>
            <p className="font-bold mt-2">Related Skills: <span className="font-medium">{relatedSkills.map(s => s + " | ")}</span></p>
            <p className="font-bold mt-2">Status: <span className="ml-1 text-warning border-1 rounded-md p-0.5">{status}</span></p>
            <p className="font-bold mt-2">Created By: <span className="font-medium">{createdBy || ''}</span></p>
            <p className="font-bold mt-2">Assigned To: <span className="font-medium">{assignedTo?.email || 'Not Assigned'}</span></p>
            <p className="font-bold mt-2">Priority: <span className="font-medium">{priority || 'Not Assigned'}</span></p>
            <p className="font-bold mt-2">Deadline: <span className="font-medium">{deadline || 'Not Assigned'}</span></p>
          </div>
        </div>}
    </div>
  );
}

export default TicketDetails;