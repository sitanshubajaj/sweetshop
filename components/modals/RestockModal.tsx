'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Loader2, Package } from 'lucide-react'

interface RestockModalProps {
    product: { id: string; name: string; stock: number } | null
    onClose: () => void
    token: string | null
    onSuccess: (product: any) => void
}

export default function RestockModal({ product, onClose, token, onSuccess }: RestockModalProps) {
    const [amount, setAmount] = useState('10')
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!product) return
        setIsLoading(true)

        try {
            const res = await fetch(`/api/products/${product.id}/restock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ amount: parseInt(amount) }),
            })

            if (res.ok) {
                const data = await res.json()
                onSuccess(data.product)
                onClose()
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to restock')
            }
        } catch (error) {
            alert('Failed to restock')
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
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Package className="w-5 h-5 text-green-600" />
                                    <h2 className="text-xl font-bold text-gray-800">Restock</h2>
                                </div>
                                <Button variant="ghost" size="icon" onClick={onClose}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <p className="text-gray-600 mb-4">
                                Add stock to <strong>{product.name}</strong>
                                <br />
                                <span className="text-sm text-gray-500">Current stock: {product.stock}</span>
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount to add</label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Stock'}
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
