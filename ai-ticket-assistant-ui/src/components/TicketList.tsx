import { useNavigate } from "react-router-dom";
import type { Ticket } from "../types/types";
import { useEffect, useState } from "react";
import fetchWithAuth from "../utils/fetchWithAuth";

function TicketList() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [tickets, setTickets] = useState<Array<Ticket>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/ticket`, {
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
    <div className="flex-1 px-6">
      {/* <p className="mt-4 ml-3 text-2xl font-bold">Ticket List</p> */}
      {isLoading
        ? <div className="flex flex-col">
          <div className="skeleton h-40  w-full mt-4"></div>
          <div className="skeleton h-40  w-full mt-4"></div>
        </div>
        : <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div className="card w-full bg-base-100 mt-6 shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="card-body p-4">
                <div className="flex justify-between items-start">
                  <h2
                    className="min-h-[3rem] card-title text-base line-clamp-2 link-hover cursor-pointer"
                    onClick={() => handleTicketSelection(ticket._id)}
                  >
                    {ticket.title}
                  </h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="min-w-[2rem] h-5 text-gray-400 cursor-pointer"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex items-start gap-2 text-xs font-semibold mt-2">
                  <div className="flex items-center gap-1">
                    <span className={`h-2 w-2 rounded-full bg-green-500`}></span>
                    <span>{ticket.status}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`h-2 w-2 rounded-full bg-gray-500`}></span>
                    <span>{ticket.priority}</span>
                  </div>
                </div>
              </div>
            </div>
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