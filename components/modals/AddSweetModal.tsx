'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Loader2 } from 'lucide-react'

interface AddSweetModalProps {
    isOpen: boolean
    onClose: () => void
    categories: { id: string; name: string }[]
    token: string | null
    onSuccess: (product: any) => void
}

export default function AddSweetModal({
    isOpen,
    onClose,
    categories,
    token,
    onSuccess,
}: AddSweetModalProps) {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [stock, setStock] = useState('')
    const [image, setImage] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
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
                const product = await res.json()
                onSuccess(product)
                resetForm()
                onClose()
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to add sweet')
            }
        } catch (error) {
            alert('Failed to add sweet')
        } finally {
            setIsLoading(false)
        }
    }

    function resetForm() {
        setName('')
        setPrice('')
        setStock('')
        setImage('')
        setCategoryId('')
    }

    return (
        <AnimatePresence>
            {isOpen && (
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
                                <h2 className="text-xl font-bold text-gray-800">Add New Sweet</h2>
                                <Button variant="ghost" size="icon" onClick={onClose}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Chocolate Truffle"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="9.99"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                        <Input
                                            type="number"
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                            placeholder="50"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                                    <Input
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        placeholder="https://example.com/sweet.jpg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                    >
                                        <option value="">Select category</option>
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
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Sweet'}
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
