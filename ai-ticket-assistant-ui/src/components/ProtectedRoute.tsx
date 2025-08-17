import { Link, Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useEffect, useState, type PropsWithChildren } from 'react';

function ProtectedRoute({ children, isProtected }: PropsWithChildren & { isProtected: boolean }) {
  const token = Cookies.get("taskToken");
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(token !== undefined);

  useEffect(() => {
    setLoggedIn(token !== undefined);
  }, [token, location.pathname]);

  if (isProtected) {
    return loggedIn
      ? (
        <div>
          <div className="navbar bg-base-100 shadow-sm block">
            <div className="flex justify-between max-w-11/12 mx-auto">
              <div className="flex gap-3 items-center">
                <div className="flex-none">
                  <button className="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
                  </button>
                </div>
                <Link to="/" className="btn btn-ghost text-xl">
                  Dashboard
                </Link>
                <Link to="/admin" className="btn btn-ghost text-xl">
                  Admin
                </Link>
                <button className="btn btn-sm btn-secondary">Create New Ticket</button>
              </div>
              <div className="w-12 avatar avatar-placeholder">
                <div className="w-full bg-neutral text-neutral-content w-8 rounded-full">
                  <span className="text-xl">D</span>
                </div>
              </div>
            </div>
          </div>
          {children}
        </div>
      )
      : <Navigate to="/login" />
  }

  return loggedIn ? <Navigate to="/" /> : children;
}

export default ProtectedRoute;