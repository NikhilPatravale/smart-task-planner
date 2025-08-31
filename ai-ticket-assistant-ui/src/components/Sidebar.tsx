import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-100 p-4 shadow-sm flex flex-col justify-between border-r-gray-400">
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
        <h4 className="font-bold text-sm mb-2">Quick Stats</h4>
        <div className="text-gray-600 space-y-2">
          <p>Open Tickets: <span className="font-bold text-primary">45</span></p>
          <p>Closed Tickets: <span className="font-bold">120</span></p>
          <p>New Tickets Today: <span className="font-bold">5</span></p>
        </div>
      </div>
    </div>
  )
}