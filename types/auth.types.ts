export interface SignupInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginInput {
  phone: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePicture: string;
  createdAt: Date;
}
