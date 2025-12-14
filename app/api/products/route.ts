import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validations'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const category = searchParams.get('category') || ''
        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')

        const where: any = {}

        if (search) {
            where.name = { contains: search, mode: 'insensitive' }
        }

        if (category) {
            where.categoryId = category
        }

        if (minPrice || maxPrice) {
            where.price = {}
            if (minPrice) where.price.gte = parseFloat(minPrice)
            if (maxPrice) where.price.lte = parseFloat(maxPrice)
        }

        const products = await prisma.product.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(products)
    } catch (error) {
        console.error('Get products error:', error)
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = getUserFromRequest(request)
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
        }

        const body = await request.json()
        const result = productSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            )
        }

        const { name, price, stock, categoryId, image } = result.data

        const product = await prisma.product.create({
            data: { name, price, stock, categoryId, image },
            include: { category: true },
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error('Create product error:', error)
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }
}
