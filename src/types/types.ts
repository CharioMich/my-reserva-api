
export const Roles = {
  Admin: 'admin',
  User: 'user',
} as const;

export type Role = typeof Roles[keyof typeof Roles];

export interface IUser {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstname: string; 
  lastname: string;
  phoneNumber: string;
  role?: Role;
  createdAt?: Date;
  updatedAt?: Date;
};

// export type IUserPublic = Omit<IUser, 'password'>;