
export const Roles = {
  Admin: 'admin',
  User: 'user',
} as const;

export type Role = typeof Roles[keyof typeof Roles];

export interface IUser {
  id?: number;
  username: string;
  email: string;
  password: string;
  firstname: string; 
  lastname: string;
  phoneNumber: number;
  role?: Role;
  createdAt?: Date;
  updatedAt?: Date;
};

// export type IUserPublic = Omit<IUser, 'password'>;