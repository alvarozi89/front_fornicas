
export interface AuthUser {
  id: number;
  email: string;
  role: 'WOMAN' | 'ADMIN';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
}
