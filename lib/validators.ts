import { z } from 'zod';

export const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  userType: z.enum(['individual', 'company', 'admin']),
  name: z.string().min(1),
  lastname: z.string().min(1),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
});

export const jobCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  jobTypes: z.string(), // JSON array string
  minSalary: z.number().int().min(0).optional(),
  maxSalary: z.number().int().min(0).optional(),
  advantages: z.string().optional(),
  company: z.string().min(1),
  location: z.string().min(1),
  positionLocation: z.enum(['On-Site', 'Semi-Remote', 'Full-Remote']),
});

export const applicationCreateSchema = z.object({
  ad_id: z.number().int(),
  company_name: z.string().min(1),
  name: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  motivations: z.string().min(1),
  website: z.string().url().optional().or(z.literal('')),
  cv: z.string().optional(),
});

export const companyCreateSchema = z.object({
  name: z.string().min(1),
  emails: z.string(), // JSON array string
});
