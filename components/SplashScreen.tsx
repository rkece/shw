'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import StretchText from './StretchText';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
    const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('hold'), 800);
        const t2 = setTimeout(() => setPhase('exit'), 2200);
        const t3 = setTimeout(() => onComplete(), 3000);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [onComplete]);

    return (
        <AnimatePresence>
            {phase !== 'exit' ? (
                <motion.div
                    key="splash"
                    className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex items-center justify-center flex-col gap-6"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                        className="relative w-24 h-24 bg-white rounded-full p-4 shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                    >
                        <Image
                            src="/logo.png"
                            alt="Shawarma Inn Logo"
                            fill
                            className="object-contain p-4"
                            priority
                        />
                    </motion.div>

                    {/* Name */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="text-center"
                    >
                        <div className="flex flex-col items-center">
                            <StretchText 
                                text="SHAWARMA" 
                                className="text-white text-5xl md:text-7xl font-black uppercase"
                                style={{ fontFamily: 'var(--font-bebas)', lineHeight: 0.8 }}
                            />
                            <StretchText 
                                text="INN" 
                                className="text-red-600 text-5xl md:text-7xl font-black uppercase mt-[-0.1em]"
                                style={{ fontFamily: 'var(--font-bebas)', lineHeight: 0.8 }}
                            />
                        </div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-white/20 text-[8px] tracking-[1.5em] uppercase mt-4 font-black"
                        >
                            SINCE 1998
                        </motion.p>
                    </motion.div>

                    {/* Loading bar */}
                    <motion.div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden mt-4">
                        <motion.div
                            className="h-full bg-gradient-to-r from-red-700 to-red-400 rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.3 }}
                        />
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}
