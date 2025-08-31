import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Tickets from './pages/Tickets';
import Admin from './pages/Admin';
import AuthContextProvider from './context/Auth/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import TicketDetails from './pages/TicketDetails';
import TicketForm from './components/TicketForm';
import Logout from './pages/Logout';
import ThemeContextProvider from './context/Theme/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <ThemeContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={
              <ProtectedRoute isProtected={false}>
                <Login />
              </ProtectedRoute>
            } />
            <Route path='/signup' element={
              <ProtectedRoute isProtected={false}>
                <SignUp />
              </ProtectedRoute>
            } />
            <Route path='/logout' element={
              <ProtectedRoute isProtected={false}>
                <Logout />
              </ProtectedRoute>
            } />

            <Route path='/' element={
              <ProtectedRoute isProtected={true}>
                <Tickets />
              </ProtectedRoute>} />
            <Route path='/ticket/:id' element={
              <ProtectedRoute isProtected={true}>
                <TicketDetails />
              </ProtectedRoute>} />
            <Route path='/create-ticket' element={
              <ProtectedRoute isProtected={true}>
                <TicketForm />
              </ProtectedRoute>} />
            <Route path='/admin' element={
              <ProtectedRoute isProtected={true}>
                <Admin />
              </ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </ThemeContextProvider>
    </AuthContextProvider>
  </StrictMode >
)
