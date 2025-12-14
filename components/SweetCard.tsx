'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Package } from 'lucide-react'

interface SweetCardProps {
    product: {
        id: string
        name: string
        price: number
        stock: number
        category: { name: string }
        image?: string | null
    }
    onPurchase: (id: string) => void
    isPurchasing: boolean
}

export default function SweetCard({ product, onPurchase, isPurchasing }: SweetCardProps) {
    const isOutOfStock = product.stock <= 0

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-2xl overflow-hidden border border-pink-100 shadow-lg"
        >
            {/* Image with gradient fallback */}
            <div className="h-48 bg-gradient-to-br from-pink-50 via-white to-orange-50 relative overflow-hidden group">
                {product.image ? (
                    <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        whileHover={{ scale: 1.1 }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                            className="text-6xl"
                        >
                            🍬
                        </motion.div>
                    </div>
                )}

                {/* Category badge */}
                <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-pink-600 shadow-sm">
                    {product.category.name}
                </span>
                {/* Stock indicator */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${isOutOfStock
                    ? 'bg-red-100 text-red-600'
                    : product.stock < 10
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-green-100 text-green-600'
                    }`}>
                    <Package className="w-3 h-3" />
                    {product.stock}
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">{product.name}</h3>

                <div className="flex items-center justify-between mt-4">
                    <div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                            ${Number(product.price).toFixed(2)}
                        </span>
                    </div>

                    <Button
                        onClick={() => onPurchase(product.id)}
                        disabled={isOutOfStock || isPurchasing}
                        className={`gap-2 ${isOutOfStock
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white'
                            }`}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {isOutOfStock ? 'Sold Out' : 'Buy'}
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
