class AuthService {
  private static instance: AuthService;
  private accessToken: string | null = null;
  private constructor() { }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  setAuth(accessToken: string): void {
    this.accessToken = accessToken ?? null;

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
  }

  getAuth(): string | null {
    return this.accessToken || localStorage.getItem('accessToken');
  }

  clearAuth(): void {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
  }
}

const instance = AuthService.getInstance();

export default instance;