export type Role = "admin" | "agent" | "customer";

export interface UserDetails {
    id: number;
    name: string;
    email: string;
    role: Role;
}

export interface UserToCreate {
  name: string;
  email: string;
  password: string;
  role: Role;
}