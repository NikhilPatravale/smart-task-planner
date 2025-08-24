import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-type': 'application/json',
        }
      });

      navigate("/login", { replace: true });
    };

    logout();
  }, [navigate]);

  return null

}

export default Logout