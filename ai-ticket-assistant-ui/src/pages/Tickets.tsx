import { useEffect, useState } from "react";

type Ticket = {
  title: string;
  description: string;
}

function Tickets() {
  const [tickets, setTickets] = useState<Array<Ticket>>([]);

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
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="max-w-11/12 mx-auto mt-5">
      <ul className="list bg-base-100 rounded-box shadow-md">
        <li className="p-4 pb-2 text-xl opacity-60 tracking-wide">Ticket List</li>
        {tickets.map((ticket) => (
          <li className="list-row">
            <div>
              <div className="text-lg">{ticket.title}</div>
            </div>
            <p className="list-col-wrap text-xs">
              {ticket.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tickets;