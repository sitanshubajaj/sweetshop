const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const categoriesData = [
        {
            name: 'Chocolates',
            products: [
                { name: 'Dark Truffle', price: 2.50, stock: 50, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=500' },
                { name: 'Milk Hazelnut', price: 1.80, stock: 45, image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=500' },
                { name: 'White Raspberry', price: 2.00, stock: 30, image: 'https://images.unsplash.com/photo-1549395156-e8c1563d3fb0?auto=format&fit=crop&q=80&w=500' },
            ]
        },
        {
            name: 'Candies',
            products: [
                { name: 'Gummy Bears', price: 3.50, stock: 100, image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=500' },
                { name: 'Sour Worms', price: 3.00, stock: 80, image: 'https://images.unsplash.com/photo-1621235451961-d703126f5550?auto=format&fit=crop&q=80&w=500' },
                { name: 'Hard Boiled Mix', price: 4.00, stock: 60, image: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?auto=format&fit=crop&q=80&w=500' },
            ]
        },
        {
            name: 'Cakes',
            products: [
                { name: 'Red Velvet Slice', price: 5.50, stock: 15, image: 'https://images.unsplash.com/photo-1586788224331-947f68671cf1?auto=format&fit=crop&q=80&w=500' },
                { name: 'Chocolate Fudge', price: 4.50, stock: 20, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=500' },
                { name: 'Carrot Cake', price: 4.00, stock: 12, image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=500' },
            ]
        },
        {
            name: 'Pastries',
            products: [
                { name: 'Croissant', price: 2.50, stock: 25, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=500' },
                { name: 'Danish', price: 2.80, stock: 20, image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&q=80&w=500' },
                { name: 'Cinnamon Roll', price: 3.00, stock: 18, image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&q=80&w=500' },
            ]
        },
        {
            name: 'Drinks',
            products: [
                { name: 'Hot Chocolate', price: 3.50, stock: 50, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=500' },
                { name: 'Milkshake', price: 5.00, stock: 40, image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=500' },
                { name: 'Espresso', price: 2.50, stock: 100, image: 'https://images.unsplash.com/photo-1510591509098-f40962d43898?auto=format&fit=crop&q=80&w=500' },
            ]
        }
    ]

    for (const catData of categoriesData) {
        const category = await prisma.category.upsert({
            where: { name: catData.name },
            update: {},
            create: { name: catData.name }
        })

        console.log(`Processing category: ${category.name}`)

        for (const prod of catData.products) {
            const existing = await prisma.product.findFirst({
                where: {
                    name: prod.name,
                    categoryId: category.id
                }
            })

            const data = {
                name: prod.name,
                price: prod.price,
                stock: prod.stock,
                categoryId: category.id,
                image: prod.image
            }

            if (existing) {
                await prisma.product.update({
                    where: { id: existing.id },
                    data: { image: prod.image } // Update image for existing products
                })
                console.log(`Updated product image: ${prod.name}`)
            } else {
                await prisma.product.create({ data })
                console.log(`Created product: ${prod.name}`)
            }
        }
    }

    console.log('Seeding completed.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
