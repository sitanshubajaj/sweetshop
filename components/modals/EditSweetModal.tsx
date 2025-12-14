'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Loader2 } from 'lucide-react'

interface EditSweetModalProps {
    product: { id: string; name: string; price: number; stock: number; image?: string | null; category: { id: string } } | null
    onClose: () => void
    categories: { id: string; name: string }[]
    token: string | null
    onSuccess: (product: any) => void
}

export default function EditSweetModal({
    product,
    onClose,
    categories,
    token,
    onSuccess,
}: EditSweetModalProps) {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [stock, setStock] = useState('')
    const [image, setImage] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (product) {
            setName(product.name)
            setPrice(String(product.price))
            setStock(String(product.stock))
            setImage(product.image || '')
            setCategoryId(product.category.id)
        }
    }, [product])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!product) return
        setIsLoading(true)

        try {
            const res = await fetch(`/api/products/${product.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    price: parseFloat(price),
                    stock: parseInt(stock),
                    categoryId,
                    image,
                }),
            })

            if (res.ok) {
                const updated = await res.json()
                onSuccess(updated)
                onClose()
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to update')
            }
        } catch (error) {
            alert('Failed to update')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {product && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Edit Sweet</h2>
                                <Button variant="ghost" size="icon" onClick={onClose}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <Input value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                        <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                        <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                                    <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/sweet.jpg" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border rounded-lg"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
