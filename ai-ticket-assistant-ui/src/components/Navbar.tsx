import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext";
import { useTheme } from "../context/Theme/ThemeContext";

export default function Navbar() {
  const { logout } = useAuth();
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const status = await logout();
    if (status.status === "success") {
      navigate("/login");
    }
  };

  return (
    <div className="navbar bg-white shadow-sm p-4 m-0">
      <div className="flex-1 flex justify-start">
        <Link to="/" className="btn btn-ghost text-xl font-bold text-gray-800 items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8 text-blue-600"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm.53 5.47a.75.75 0 00-1.06 0l-4.5 4.5a.75.75 0 001.06 1.06l3.97-3.97 3.97 3.97a.75.75 0 101.06-1.06l-4.5-4.5z"
              clipRule="evenodd"
            />
          </svg>
          <span className="hidden md:inline-block text-gray-800">TicketFlow</span>
        </Link>
        <button className="hidden md:inline-flex btn bg-white text-black ml-16" onClick={() => navigate("/create-ticket")}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="20px" width="20px" version="1.1" id="Layer_1" viewBox="0 0 512 512">
            <g>
              <g>
                <path d="M256,0C114.844,0,0,114.844,0,256c0,141.156,114.844,256,256,256s256-114.844,256-256C512,114.844,397.156,0,256,0z     M256,490.667C126.604,490.667,21.333,385.397,21.333,256C21.333,126.606,126.604,21.333,256,21.333    c129.396,0,234.667,105.272,234.667,234.667C490.667,385.397,385.396,490.667,256,490.667z" />
              </g>
            </g>
            <g>
              <g>
                <polygon points="265.562,246.05 265.562,96.716 244.229,96.716 244.229,246.05 105.562,246.05 105.562,267.383 244.229,267.383     244.229,416.716 265.562,416.716 265.562,267.383 414.896,267.383 414.896,246.05   " />
              </g>
            </g>
          </svg>
          Create New Ticket
        </button>
        <div className="inline-flex md:hidden">
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
            </button>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content gap-3 left-1 scale-200 font-medium bg-gray-300 w-60 rounded-box z-1 mt-3 p-3 shadow">
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/tickets">Tickets</Link></li>
              <li><Link to="/users">Users</Link></li>
              <li><Link to="/settings">Settings</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex gap-6">
        <label className="swap swap-rotate">
          {/* this hidden checkbox controls the state */}
          <input type="checkbox" />

          {/* sun icon */}
          <svg
            onClick={toggleTheme}
            className="swap-on h-7 w-7 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
              d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>

          {/* moon icon */}
          <svg
            onClick={toggleTheme}
            className="swap-off h-7 w-7 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
              d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
        <div className="form-control">
          <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" className="w-20 lg:w-full bg-transparent text-sm focus:outline-none" placeholder="Search..." />
          </div>
        </div>
      </div>
      <div className="flex-none ml-4">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
  )
}