import AuthService from '../service/AuthService';

const refreshToken = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
      credentials: "include"
    });

    if (response.ok) {
      const data = await response.json();
      AuthService.setAuth(data.accessToken);
      return data.accessToken;
    }
    AuthService.clearAuth();
    return null;
  } catch (error) {
    console.log(error);
    AuthService.clearAuth();
    return null;
  }
}

export default async function fetchWithAuth(url: string, opts: RequestInit = {}): Promise<Response> {
  let response = await fetch(url, opts);

  if (response.status === 401) {
    const newToken = await refreshToken();
    if (!newToken) {
      throw new Error("Not authenticated");
    }
    response = await fetch(url, opts);
  }

  return response;
}