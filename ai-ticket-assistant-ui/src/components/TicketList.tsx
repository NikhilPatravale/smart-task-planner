import { useNavigate } from "react-router-dom";
import type { Ticket } from "../types/types";
import { useEffect, useState } from "react";

function TicketList() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [tickets, setTickets] = useState<Array<Ticket>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ticket`, {
          credentials: "include",
        });
        if (response.ok) {
          const { tickets } = await response.json();
          setTickets(tickets);
        }
      } catch (error) {
        console.error("❌ Error while fetching tickets", error);
        setError("Some error occurred. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleTicketSelection = (ticketId: string) => {
    navigate(`/ticket/${ticketId}`);
  }

  return (
    <div>
      <p className="mt-4 ml-3 text-2xl font-bold">Ticket List</p>
      {isLoading
        ? <div className="flex flex-col">
          <div className="skeleton h-40  w-full mt-4"></div>
          <div className="skeleton h-40  w-full mt-4"></div>
        </div>
        : <ul className="list ml-1 bg-base-100 rounded-box shadow-xl">
          {tickets.map((ticket) => (
            <li
              key={ticket._id}
              className="list-row"
            >
              <div
                className="link-hover cursor-pointer"
                onClick={() => handleTicketSelection(ticket._id)}
              >
                <div className="text-lg">{ticket.title}</div>
              </div>
              <p
                className="list-col-wrap text-xs"
              >
                {ticket.description}
              </p>
            </li>
          ))}
        </ul>
      }
      {error && <div role="alert" className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>}
    </div>
  );
}

export default TicketList;