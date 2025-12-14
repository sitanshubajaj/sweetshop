'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Plus, Edit, Trash2, Package, Loader2, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import AddSweetModal from '@/components/modals/AddSweetModal'
import EditSweetModal from '@/components/modals/EditSweetModal'
import RestockModal from '@/components/modals/RestockModal'
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal'

interface Product {
    id: string
    name: string
    price: number
    stock: number
    image?: string | null
    category: { id: string; name: string }
}

interface Category {
    id: string
    name: string
}

export default function AdminPage() {
    const { user, token, isAdmin, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false)
    const [editProduct, setEditProduct] = useState<Product | null>(null)
    const [restockProduct, setRestockProduct] = useState<Product | null>(null)
    const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)

    useEffect(() => {
        if (!authLoading && !isAdmin) {
            router.push('/')
            toast.error('Admin access required')
        }
    }, [authLoading, isAdmin, router])

    useEffect(() => {
        if (isAdmin) {
            fetchData()
        }
    }, [isAdmin])

    async function fetchData() {
        try {
            const [pRes, cRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/categories'),
            ])
            if (pRes.ok) setProducts(await pRes.json())
            if (cRes.ok) setCategories(await cRes.json())
        } catch (error) {
            console.error('Failed to fetch data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleDelete(id: string) {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })

            if (res.ok) {
                toast.success('Product deleted')
                setProducts(prev => prev.filter(p => p.id !== id))
                setDeleteProduct(null)
            } else {
                toast.error('Failed to delete')
            }
        } catch (error) {
            toast.error('Failed to delete')
        }
    }

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            </div>
        )
    }

    if (!isAdmin) {
        return null
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
            >
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-6 h-6 text-purple-600" />
                        <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
                    </div>
                    <p className="text-gray-500">Manage your sweet shop inventory</p>
                </div>

                <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Sweet
                </Button>
            </motion.div>

            {/* Products Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden"
            >
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gradient-to-r from-pink-50 to-orange-50">
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence>
                            {products.map((product, index) => (
                                <motion.tr
                                    key={product.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="hover:bg-pink-50/50 transition-colors"
                                >
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 bg-pink-100 text-pink-600 rounded-full text-xs">
                                            {product.category?.name}
                                        </span>
                                    </TableCell>
                                    <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${product.stock <= 0
                                            ? 'bg-red-100 text-red-600'
                                            : product.stock < 10
                                                ? 'bg-yellow-100 text-yellow-600'
                                                : 'bg-green-100 text-green-600'
                                            }`}>
                                            {product.stock}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setRestockProduct(product)}
                                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                            >
                                                <Package className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setEditProduct(product)}
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setDeleteProduct(product)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </motion.div>

            {/* Modals */}
            <AddSweetModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                categories={categories}
                token={token}
                onSuccess={(newProduct) => {
                    setProducts(prev => [newProduct, ...prev])
                    toast.success('Sweet added successfully!')
                }}
            />

            <EditSweetModal
                product={editProduct}
                onClose={() => setEditProduct(null)}
                categories={categories}
                token={token}
                onSuccess={(updated) => {
                    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p))
                    toast.success('Sweet updated!')
                }}
            />

            <RestockModal
                product={restockProduct}
                onClose={() => setRestockProduct(null)}
                token={token}
                onSuccess={(updated) => {
                    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p))
                    toast.success('Stock updated!')
                }}
            />

            <ConfirmDeleteModal
                product={deleteProduct}
                onClose={() => setDeleteProduct(null)}
                onConfirm={() => deleteProduct && handleDelete(deleteProduct.id)}
            />
        </div>
    )
}
