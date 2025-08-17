import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Tickets from './pages/Tickets';
import Admin from './pages/Admin';
import AuthContextProvider from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SignUp from './pages/SignUp';
import Login from './pages/Login';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
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

          <Route path='/' element={
            <ProtectedRoute isProtected={true}>
              <Tickets />
            </ProtectedRoute>} />
          <Route path='/admin' element={
            <ProtectedRoute isProtected={true}>
              <Admin />
            </ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  </StrictMode >
)
