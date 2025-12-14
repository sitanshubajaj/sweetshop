'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import SweetCard from '@/components/SweetCard'
import { Search, Filter, Loader2, Candy } from 'lucide-react'
import toast from 'react-hot-toast'

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

export default function Dashboard() {
  const { user, token, isLoading: authLoading } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [purchasingId, setPurchasingId] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  // Fetch data
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  async function handlePurchase(productId: string) {
    if (!user) {
      toast.error('Please login to purchase')
      return
    }

    setPurchasingId(productId)
    try {
      const res = await fetch(`/api/products/${productId}/purchase`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      if (res.ok) {
        toast.success('Purchase successful! 🎉')
        setProducts(prev =>
          prev.map(p =>
            p.id === productId ? { ...p, stock: p.stock - 1 } : p
          )
        )
      } else {
        toast.error(data.error || 'Purchase failed')
      }
    } catch (error) {
      toast.error('Failed to process purchase')
    } finally {
      setPurchasingId(null)
    }
  }

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchesCategory = !selectedCategory || product.category.id === selectedCategory
      const matchesMinPrice = !priceRange.min || Number(product.price) >= Number(priceRange.min)
      const matchesMaxPrice = !priceRange.max || Number(product.price) <= Number(priceRange.max)
      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice
    })
  }, [products, debouncedSearch, selectedCategory, priceRange])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
          Sweet Shop
        </h1>
        <p className="text-gray-500">Discover our delicious collection of sweets</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-4 mb-6 shadow-lg border border-pink-100"
      >
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search sweets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-gray-50 border-0"
            />
          </div>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-50 rounded-lg border-0 text-gray-700 min-w-[150px]"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Price range */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <Input
              type="number"
              placeholder="Min $"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-24 bg-gray-50 border-0"
            />
            <span className="text-gray-400">-</span>
            <Input
              type="number"
              placeholder="Max $"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-24 bg-gray-50 border-0"
            />
          </div>
        </div>
      </motion.div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Candy className="w-16 h-16 mx-auto text-pink-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No sweets found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <SweetCard
                  product={product}
                  onPurchase={handlePurchase}
                  isPurchasing={purchasingId === product.id}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
