'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck, Flame, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import useStore from '@/lib/store';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useStore();
    const total = cartTotal();
    const count = cartCount();
    const deliveryFee = total > 300 ? 0 : 40;
    const finalTotal = total + deliveryFee;

    return (
        <div className="bg-white min-h-screen text-black flex flex-col justify-between">
            <div>
                <Navbar />

                {/* Header Banner */}
                <section className="relative pt-32 pb-16 border-b border-gray-100 overflow-hidden bg-gray-50">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=1920&q=80"
                            alt="Cart Background"
                            fill
                            className="object-cover opacity-5 filter grayscale"
                        />
                    </div>
                    <div className="relative z-10 max-w-7xl mx-auto px-6">
                        <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                            <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
                            <span>/</span>
                            <Link href="/menu" className="hover:text-red-600 transition-colors">Menu</Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">Shopping Cart</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter" style={{ fontFamily: 'var(--font-outfit)' }}>
                            YOUR <span className="text-red-600">BAG</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-2">
                            {count === 0 ? 'No items added yet' : `You have ${count} dynamic flavors ready for carving`}
                        </p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 py-12">
                    <AnimatePresence mode="wait">
                        {cart.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center py-24 border border-dashed border-gray-200 rounded-[40px] bg-gray-50/50"
                            >
                                <ShoppingBag className="mx-auto text-gray-300 mb-6 animate-bounce" size={72} strokeWidth={1} />
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
                                    Your cart is empty
                                </h2>
                                <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8">
                                    Looks like you haven't added any of our signature charcoal-grilled wraps yet.
                                </p>
                                <Link href="/menu">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-5 rounded-full text-xs tracking-[0.2em] uppercase shadow-lg shadow-red-900/10"
                                    >
                                        Browse Our Menu
                                    </motion.button>
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 lg:grid-cols-3 gap-12"
                            >
                                {/* Left Column: Items List */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                        <h3 className="text-lg font-bold text-gray-800">Cart Items ({cart.length})</h3>
                                        <Link href="/menu" className="text-red-600 hover:text-red-700 text-xs font-black tracking-widest uppercase flex items-center gap-1 group">
                                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> ADD MORE ITEMS
                                        </Link>
                                    </div>

                                    <div className="space-y-4">
                                        <AnimatePresence>
                                            {cart.map((item) => (
                                                <motion.div
                                                    key={item.id}
                                                    layout
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, x: -50 }}
                                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-gray-50 rounded-3xl border border-gray-100/80 gap-6 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300"
                                                >
                                                    {/* Item Info */}
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                                                            <Image
                                                                src={item.image || '/food/default.jpg'}
                                                                alt={item.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <span className="text-[10px] text-red-600 font-extrabold tracking-widest uppercase">Shawrap Premium</span>
                                                            <h4 className="text-lg font-bold text-gray-900 leading-tight truncate uppercase mt-0.5" style={{ fontFamily: 'Oswald' }}>
                                                                {item.name}
                                                            </h4>
                                                            <p className="text-gray-400 text-sm font-semibold mt-1">₹{item.price} each</p>
                                                        </div>
                                                    </div>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center border border-gray-200 bg-white rounded-xl p-1">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 flex items-center justify-center transition-colors"
                                                                title={item.quantity === 1 ? "Remove item" : "Decrease quantity"}
                                                            >
                                                                {item.quantity === 1 ? (
                                                                    <Trash2 size={14} className="text-red-500" />
                                                                ) : (
                                                                    <Minus size={14} />
                                                                )}
                                                            </button>
                                                            <span className="text-gray-800 text-sm font-extrabold w-8 text-center">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="w-8 h-8 rounded-lg hover:bg-gray-100 text-red-600 flex items-center justify-center transition-colors"
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Price & Action */}
                                                    <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-200">
                                                        <div className="text-left sm:text-right">
                                                            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Total Price</p>
                                                            <p className="text-gray-900 font-extrabold text-lg">₹{item.price * item.quantity}</p>
                                                        </div>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="p-3 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-2xl transition-all duration-300"
                                                            title="Remove Item"
                                                        >
                                                            <Trash2 size={16} />
                                                        </motion.button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Right Column: Summary Card */}
                                <div>
                                    <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 sticky top-24 space-y-6">
                                        <h3 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-200" style={{ fontFamily: 'var(--font-outfit)' }}>
                                            Order Summary
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="flex justify-between text-gray-600 text-sm font-medium">
                                                <span>Subtotal</span>
                                                <span className="text-gray-900 font-bold">₹{total}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600 text-sm font-medium">
                                                <span>Delivery Fee</span>
                                                {deliveryFee === 0 ? (
                                                    <span className="text-green-600 font-bold tracking-wider uppercase">FREE 🎉</span>
                                                ) : (
                                                    <span className="text-gray-900 font-bold">₹{deliveryFee}</span>
                                                )}
                                            </div>

                                            {deliveryFee === 0 ? (
                                                <div className="p-3 bg-green-50 text-green-700 text-xs font-semibold rounded-xl text-center border border-green-100">
                                                    🎉 Congrats! Free delivery applied to your order.
                                                </div>
                                            ) : (
                                                <div className="p-3 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-xl text-center border border-yellow-100">
                                                    💡 Add <span className="font-bold">₹{301 - total}</span> more to unlock <span className="font-bold">FREE DELIVERY</span>!
                                                </div>
                                            )}

                                            <div className="border-t border-gray-200 pt-4 flex justify-between text-gray-900 font-black text-xl">
                                                <span>Total</span>
                                                <span className="text-red-600">₹{finalTotal}</span>
                                            </div>
                                        </div>

                                        <Link href="/checkout">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full mt-4 bg-gradient-to-r from-red-700 to-red-500 text-white font-bold py-4.5 rounded-2xl flex items-center justify-center gap-2 hover:from-red-600 hover:to-red-400 transition-all duration-300 shadow-xl shadow-red-900/10"
                                            >
                                                Proceed to Checkout
                                                <ArrowRight size={18} />
                                            </motion.button>
                                        </Link>

                                        <div className="pt-4 border-t border-gray-200/60 grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                <ShieldCheck size={14} className="text-green-500" /> Secure Checkout
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                <ShieldCheck size={14} className="text-red-500" /> Hot & Fresh
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <Footer />
        </div>
    );
}
