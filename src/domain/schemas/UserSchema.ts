import { z } from 'zod';

export const userSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  id: z.string().optional(),
});

export const createUserSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createdUserSchema = z.object({
  id: z.string().regex(objectIdRegex, 'Invalid ObjectId format for id'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
});

export type UserInput = z.infer<typeof userSchema>;

export type CreateUserDTO = z.infer<typeof createUserSchema>;

export type CreatedUserDTO = z.infer<typeof createdUserSchema>;
