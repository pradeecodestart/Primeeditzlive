import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['CLIENT', 'CEO', 'PROJECT_MANAGER', 'EDITOR', 'ACCOUNTANT', 'SALES']).default('CLIENT'),
  terms: z.boolean().refine((val) => val === true, 'You must accept terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const createOrderSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  projectName: z.string().min(1, 'Project name is required'),
  serviceType: z.string().min(1, 'Service type is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  deadline: z.string().min(1, 'Deadline is required'),
  description: z.string().optional(),
  customOptions: z.record(z.any()).optional(),
  files: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  service: z.string().min(1, 'Service selection is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
