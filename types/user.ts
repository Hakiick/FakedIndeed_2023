export interface User {
  id: number;
  email: string;
  password: string;
  userType: 'individual' | 'company' | 'admin';
  name: string;
  lastname: string;
  phone: string;
  website: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserCreate = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UserUpdate = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;
export type UserPublic = Omit<User, 'password'>;
