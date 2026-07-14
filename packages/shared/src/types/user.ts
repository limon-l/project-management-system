export interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export interface PublicUserResponse {
  id: string;
  name: string;
  avatarUrl: string | null;
}
