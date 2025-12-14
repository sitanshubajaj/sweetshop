import { z } from 'zod'

export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
})

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
})

export const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.number().positive('Price must be positive'),
    stock: z.number().int().min(0, 'Stock cannot be negative'),
    categoryId: z.string().min(1, 'Category is required'),
    image: z.string().url('Invalid image URL').optional().or(z.literal('')),
})

export const restockSchema = z.object({
    amount: z.number().int().positive('Amount must be a positive integer'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ProductInput = z.infer<typeof productSchema>
export type RestockInput = z.infer<typeof restockSchema>
