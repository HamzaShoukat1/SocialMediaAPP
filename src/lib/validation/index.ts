import { z } from 'zod';

export const Signupvalidation = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
    
  username: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters long.' })
    .trim(),

  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' })
    .trim(),

   password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[^A-Za-z0-9]/, {
      message: 'Password must contain at least one special character.',
    }),
});
export const SigninValidation = z.object({

  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' })
    .trim(),

   password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[^A-Za-z0-9]/, {
      message: 'Password must contain at least one special character.',
    }),
});
export const PostValidation = z.object({
  caption: z.string().min(5).max(2200),
  file:z.custom<File[]>(),
  location:z.string().min(2).max(100),
  tags: z.string()

 
});

