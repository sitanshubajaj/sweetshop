import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { items, totalAmount } = body // items: { productId, quantity, price }[]

        // Transaction to ensure stock is updated and order is created, or neither
        const order = await prisma.$transaction(async (tx: any) => {
            // Create order
            const newOrder = await tx.order.create({
                data: {
                    totalAmount,
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                },
                include: { items: true }
            })

            // Update stock
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                })
            }

            return newOrder
        })

        return NextResponse.json(order)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }
}

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(orders)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }
}
