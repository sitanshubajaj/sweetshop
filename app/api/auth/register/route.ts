import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, signToken } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate input
        const result = registerSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            )
        }

        const { email, password, name } = result.data

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            )
        }

        // Hash password and create user
        const hashedPassword = await hashPassword(password)
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        })

        // Generate token
        const token = signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        })

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        })
    } catch (error) {
        console.error('Register error:', error)
        return NextResponse.json(
            { error: 'Failed to register' },
            { status: 500 }
        )
    }
}
