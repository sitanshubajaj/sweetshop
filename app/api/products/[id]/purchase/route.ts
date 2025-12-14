import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = getUserFromRequest(request)
        if (!user) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
        }

        const { id } = await params

        // Check current stock
        const product = await prisma.product.findUnique({ where: { id } })
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        if (product.stock <= 0) {
            return NextResponse.json({ error: 'Product out of stock' }, { status: 400 })
        }

        // Decrement stock
        const updated = await prisma.product.update({
            where: { id },
            data: { stock: { decrement: 1 } },
            include: { category: true },
        })

        return NextResponse.json({
            message: 'Purchase successful',
            product: updated,
        })
    } catch (error) {
        console.error('Purchase error:', error)
        return NextResponse.json({ error: 'Failed to process purchase' }, { status: 500 })
    }
}
