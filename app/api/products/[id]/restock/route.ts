import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { restockSchema } from '@/lib/validations'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = getUserFromRequest(request)
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
        }

        const { id } = await params
        const body = await request.json()

        const result = restockSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            )
        }

        const { amount } = result.data

        const product = await prisma.product.update({
            where: { id },
            data: { stock: { increment: amount } },
            include: { category: true },
        })

        return NextResponse.json({
            message: `Added ${amount} units to stock`,
            product,
        })
    } catch (error) {
        console.error('Restock error:', error)
        return NextResponse.json({ error: 'Failed to restock' }, { status: 500 })
    }
}
