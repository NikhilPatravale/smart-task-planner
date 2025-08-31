import AuthService from '../service/AuthService';
import { Navigate } from 'react-router-dom';
import { type PropsWithChildren } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

function ProtectedRoute({ children, isProtected }: PropsWithChildren & { isProtected: boolean }) {
  const accessToken = AuthService.getAuth();

  if (isProtected) {
    return accessToken
      ? (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
          <main className="mx-auto flex-grow flex flex-col space-y-6 w-full">
            <Navbar />
            <div className="flex-1 flex flex-col md:flex-row mb-0">
              <Sidebar />
              {children}
            </div>
            <Footer />
          </main>
        </div>
      )
      : <Navigate to="/login" />
  }

  return accessToken && !location.pathname.includes("/logout") ? <Navigate to="/" /> : children;
}

export default ProtectedRoute;