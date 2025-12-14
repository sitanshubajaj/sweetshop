'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Candy, LogOut, User, Shield, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
    const { user, logout, isAdmin, isLoading } = useAuth()
    const pathname = usePathname()

    // Don't show navbar on login/register pages
    if (pathname === '/login' || pathname === '/register') {
        return null
    }

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-pink-100 shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Candy className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                            Sweet Shop
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-4">
                        {isLoading ? (
                            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                        ) : user ? (
                            <>
                                <Link href="/">
                                    <Button variant="ghost" className="gap-2">
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard
                                    </Button>
                                </Link>

                                {isAdmin && (
                                    <Link href="/admin">
                                        <Button variant="ghost" className="gap-2 text-purple-600">
                                            <Shield className="w-4 h-4" />
                                            Admin
                                        </Button>
                                    </Link>
                                )}

                                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="hidden sm:block">
                                            <p className="text-sm font-medium text-gray-700">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.role}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={logout}
                                        className="text-gray-500 hover:text-red-500"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex gap-2">
                                <Link href="/login">
                                    <Button variant="ghost">Sign In</Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    )
}
