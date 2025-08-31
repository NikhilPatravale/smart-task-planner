import TicketList from "../components/TicketList";

function Tickets() {

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6">
      <TicketList />
    </div>
  );
}

export default Tickets;