import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, signToken } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate input
        const result = loginSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            )
        }

        const { email, password } = result.data

        // Find user
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Verify password
        const isValid = await comparePassword(password, user.password)
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

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
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Failed to login' },
            { status: 500 }
        )
    }
}
