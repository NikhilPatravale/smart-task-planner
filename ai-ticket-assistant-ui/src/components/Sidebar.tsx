import { Link } from "react-router-dom";
import { useDataContext } from "../context/Data/DataContext";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const { ticketsDataState } = useDataContext();
  const { tickets } = ticketsDataState;
  const [ticketCounts, setTicketCounts] = useState({ open: 0, closed: 0, newToday: 0 });

  const { open: openTicketsCount, closed: closedTicketCount, newToday: newTicketsToday } = ticketCounts;

  useEffect(() => {
    let updateOpenCount = 0;
    let updateClosedCount = 0;
    let updateNewTodayCount = 0;

    tickets.forEach(ticket => {
      const createdAt = new Date(ticket.createdAt || '');
      const today = new Date();
      const isToday = createdAt.toDateString() === today.toDateString();

      if (ticket.status === "COMPLETE") {
        updateClosedCount += 1;
      } else {
        updateOpenCount += 1;
      }

      if (isToday) {
        updateNewTodayCount += 1;
      }
    });

    setTicketCounts(() => ({
      open: updateOpenCount,
      closed: updateClosedCount,
      newToday: updateNewTodayCount,
    }));
  }, [tickets]);

  return (
    <div className="hidden md:flex w-64 bg-gray-100 p-4 shadow-sm  flex-col justify-between border-r-gray-400">
      <ul className="menu text-base font-semibold w-full">
        <li>
          <Link to="/" className="bg-primary text-white">Dashboard</Link>
        </li>
        <li>
          <Link to="/tickets">Tickets</Link>
        </li>
        <li>
          <Link to="">Users</Link>
        </li>
        <li>
          <Link to="">Reports</Link>
        </li>
        <li>
          <Link to="">Settings</Link>
        </li>
      </ul>

      {/* Quick Stats */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h4 className="font-bold mb-2">Quick Stats</h4>
        <div className="text-gray-600 text-sm space-y-2">
          <p>Open Tickets: <span className="font-bold text-primary">{openTicketsCount}</span></p>
          <p>Closed Tickets: <span className="font-bold">{closedTicketCount}</span></p>
          <p>New Tickets Today: <span className="font-bold">{newTicketsToday}</span></p>
        </div>
      </div>
    </div>
  )
}