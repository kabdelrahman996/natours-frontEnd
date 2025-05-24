// user.model.ts

export type UserRole = 'user' | 'guide' | 'lead-guide' | 'admin';

export interface User {
  _id?: string; // MongoDB document ID, optional when creating new users
  name: string;
  email: string;
  photo?: string;
  role: UserRole;
  password?: string; // Usually only used during registration/reset, and not returned by API
  passwordConfirm?: string; // Only used on the client side for registration, not stored in DB
  passwordChangedAt?: Date | string;
  passwordResetToken?: string;
  passwordResetExpires?: Date | string;
  active?: boolean; // May be omitted in regular API responses due to select: false
}
