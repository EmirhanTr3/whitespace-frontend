import { z } from 'zod';

export const CreateGuildFormSchema = z.object({
    name: z
        .string('Guild name is required.')
        .min(1, 'Guild name cannot be empty.' )
        .max(32, 'Maximum 32 characters.')
        .trim()
})

export const CreateChannelFormSchema = z.object({
    name: z
        .string('Channel name is required.')
        .min(1, 'Channel name cannot be empty.' )
        .max(32, 'Maximum 32 characters.')
        .trim()
})

export const LoginFormSchema = z.object({
    email: z
        .email({ message: 'Please enter a valid email.' })
        .trim(),
    password: z
        .string()
        .min(1, { message: 'Please enter a password.' })
        .trim(),
})

export const RegisterFormSchema = z.object({
    name: z
        .string()
        .min(2, 'Minimum 2 characters.')
        .max(32, 'Maximum 32 characters.')
        .regex(/^[a-z0-9._]+$/, 'No uppercase or special characters.')
        .trim(),
    displayname: z
        .string()
        .min(2, 'Minimum 2 characters.')
        .max(32, 'Maximum 32 characters.')
        .trim(),
    email: z
        .email('Please enter a valid email.')
        .trim(),
    password: z
        .string()
        .min(8, 'Minimum 8 characters.')
        .regex(/[a-zA-Z]/, 'Have at least one letter.')
        .regex(/[0-9]/, 'Have at least one number.')
        .regex(/[^a-zA-Z0-9]/, 'Have at least one special character.')
        .trim(),
})