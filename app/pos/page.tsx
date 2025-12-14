'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Trash2, CreditCard } from 'lucide-react'

export default function POS() {
    const [products, setProducts] = useState<any[]>([])
    const [cart, setCart] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [selectedCategory, setSelectedCategory] = useState('All')

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            const [pRes, cRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/categories')
            ])
            setProducts(await pRes.json())
            setCategories(await cRes.json())
        } catch (e) {
            console.error(e)
        }
    }

    function addToCart(product: any) {
        setCart(current => {
            const existing = current.find(item => item.productId === product.id)
            if (existing) {
                return current.map(item =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...current, {
                productId: product.id,
                name: product.name,
                price: Number(product.price),
                quantity: 1
            }]
        })
    }

    function removeFromCart(productId: string) {
        setCart(current => current.filter(item => item.productId !== productId))
    }

    async function handleCheckout() {
        if (cart.length === 0) return

        const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    totalAmount
                })
            })
            if (res.ok) {
                alert('Order processed successfully!')
                setCart([])
                // Refresh products to update stock
                const pRes = await fetch('/api/products')
                setProducts(await pRes.json())
            } else {
                alert('Checkout failed')
            }
        } catch (e) {
            console.error(e)
            alert('Error processing order')
        }
    }

    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(p => p.category?.id === selectedCategory)

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
            {/* Product Grid */}
            <div className="md:col-span-2 space-y-6 flex flex-col h-full">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Point of Sale</h2>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <Button
                            variant={selectedCategory === 'All' ? 'default' : 'outline'}
                            onClick={() => setSelectedCategory('All')}
                        >
                            All
                        </Button>
                        {categories.map(c => (
                            <Button
                                key={c.id}
                                variant={selectedCategory === c.id ? 'default' : 'outline'}
                                onClick={() => setSelectedCategory(c.id)}
                            >
                                {c.name}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-4">
                    {filteredProducts.map(product => (
                        <Card
                            key={product.id}
                            className="cursor-pointer hover:border-pink-500 transition-colors"
                            onClick={() => addToCart(product)}
                        >
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-base truncate">{product.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <div className="flex justify-between items-end">
                                    <span className="font-bold">${Number(product.price).toFixed(2)}</span>
                                    <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Cart Source */}
            <Card className="flex flex-col h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Current Order
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                        {cart.length === 0 && (
                            <div className="text-center text-muted-foreground py-10">
                                Cart is empty
                            </div>
                        )}
                        {cart.map(item => (
                            <div key={item.productId} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                <div>
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        ${item.price.toFixed(2)} x {item.quantity}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => removeFromCart(item.productId)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4 space-y-4 mt-auto">
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <Button className="w-full h-12 text-lg" disabled={cart.length === 0} onClick={handleCheckout}>
                            <CreditCard className="mr-2 h-5 w-5" />
                            Process Payment
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
