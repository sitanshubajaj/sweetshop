import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validations'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true },
        })

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        return NextResponse.json(product)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
    }
}

export async function PATCH(
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
        const result = productSchema.partial().safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            )
        }

        const product = await prisma.product.update({
            where: { id },
            data: result.data,
            include: { category: true },
        })

        return NextResponse.json(product)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = getUserFromRequest(request)
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
        }

        const { id } = await params
        await prisma.product.delete({ where: { id } })

        return NextResponse.json({ message: 'Product deleted' })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }
}
