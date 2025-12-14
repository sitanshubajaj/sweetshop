'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDeleteModalProps {
    product: { id: string; name: string } | null
    onClose: () => void
    onConfirm: () => void
}

export default function ConfirmDeleteModal({ product, onClose, onConfirm }: ConfirmDeleteModalProps) {
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
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}>
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>

                            <h2 className="text-xl font-bold text-gray-800 mb-2">Delete Sweet?</h2>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete <strong>{product.name}</strong>?
                                <br />
                                <span className="text-sm text-gray-500">This action cannot be undone.</span>
                            </p>

                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-red-600 hover:bg-red-700"
                                    onClick={onConfirm}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
