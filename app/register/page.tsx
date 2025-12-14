'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Candy, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { register } = useAuth()
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)

        try {
            await register(name, email, password)
            toast.success('Account created successfully!')
            router.push('/')
        } catch (error: any) {
            toast.error(error.message || 'Registration failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-orange-100 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl mb-4">
                            <Candy className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                            Join Sweet Shop
                        </h1>
                        <p className="text-gray-500 mt-2">Create your account</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <Input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                                className="bg-white/50"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="bg-white/50"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="bg-white/50"
                            />
                            <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </motion.div>
                    </form>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-center mt-6 text-gray-600"
                    >
                        Already have an account?{' '}
                        <Link href="/login" className="text-pink-600 hover:text-pink-700 font-semibold">
                            Sign in
                        </Link>
                    </motion.p>
                </div>
            </motion.div>
        </div>
    )
}
