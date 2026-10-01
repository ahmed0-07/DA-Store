import { UserRole } from "@prisma/client";

export interface IUser {
  id: string,
  email: string,
  googleId: string,
  avatarUrl: string,
  role: UserRole
  createdAt: Date
}

export interface IAddressBody {
  city: string,
  state: string,
  country: string,
  isDefault: boolean,
  streetAddress: string
}