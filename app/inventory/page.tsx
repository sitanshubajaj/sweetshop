'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus } from 'lucide-react'

export default function Inventory() {
    const [products, setProducts] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Form state
    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', categoryId: '' })

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
        } finally {
            setLoading(false)
        }
    }

    async function handleAddProduct(e: React.FormEvent) {
        e.preventDefault()
        if (!newProduct.categoryId && categories.length > 0) {
            // Default to first category if not selected
            newProduct.categoryId = categories[0].id
        }

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newProduct,
                    price: parseFloat(newProduct.price),
                    stock: parseInt(newProduct.stock),
                })
            })
            if (res.ok) {
                setNewProduct({ name: '', price: '', stock: '', categoryId: '' })
                fetchData()
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
                <h3 className="text-lg font-semibold">Add New Sweet</h3>
                <form onSubmit={handleAddProduct} className="flex gap-4 items-end flex-wrap">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            value={newProduct.name}
                            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                            placeholder="Dark Chocolate"
                            required
                        />
                    </div>
                    <div className="space-y-2 w-24">
                        <label className="text-sm font-medium">Price</label>
                        <Input
                            type="number"
                            step="0.01"
                            value={newProduct.price}
                            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                            placeholder="0.00"
                            required
                        />
                    </div>
                    <div className="space-y-2 w-24">
                        <label className="text-sm font-medium">Stock</label>
                        <Input
                            type="number"
                            value={newProduct.stock}
                            onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                            placeholder="0"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <select
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={newProduct.categoryId}
                            onChange={e => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                            required
                        >
                            <option value="" disabled>Select Category</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <Button type="submit">
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                </form>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">Loading...</TableCell>
                            </TableRow>
                        ) : products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.category?.name}</TableCell>
                                <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
