declare class AuthService {
  accessToken: string | null;
  setAuth(accessToken: string): void;
  getAuth(): string | null;
  clearAuth(): void;
}

declare const instance: AuthService;