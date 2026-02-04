export interface UpdateProfileInput {
  name?: string;
  profilePicture?: string;
}
export interface SearchUserInput {
  phone: string;
}

export interface PublicUser {
  id: string;
  name: string;
  phone: string;
  profilePicture: string;
}
