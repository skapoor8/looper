export interface IUser {
  id: string;
  uid: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  countryCode?: string;
  role: UserRole;
  email: string;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
