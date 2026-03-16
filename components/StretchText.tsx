'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface StretchTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function StretchText({ text, className, style }: StretchTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chars = text.split('');
  
  // We'll track mouse X relative to the container
  const mouseX = useMotionValue(Infinity);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
  };

  const handleMouseLeave = () => {
    mouseX.set(Infinity);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`flex justify-center select-none cursor-default ${className}`}
      style={style}
    >
      {chars.map((char, i) => (
        <Char key={i} char={char} index={i} mouseX={mouseX} />
      ))}
    </div>
  );
}

function Char({ char, index, mouseX }: { char: string; index: number; mouseX: any }) {
  const ref = useRef<HTMLSpanElement>(null);

  // We use a spring for smooth transition
  const scaleX = useSpring(1, { stiffness: 400, damping: 30 });
  const scaleY = useSpring(1, { stiffness: 400, damping: 30 });
  const fontWeight = useSpring(900, { stiffness: 400, damping: 30 });

  useEffect(() => {
    return mouseX.on("change", (v: number) => {
      if (!ref.current || v === Infinity) {
        scaleX.set(1);
        scaleY.set(1);
        fontWeight.set(900);
        return;
      }

      const rect = ref.current.getBoundingClientRect();
      const charX = rect.left + rect.width / 2;
      const mouseAbsX = v + (ref.current.parentElement?.getBoundingClientRect().left || 0);
      
      const distance = Math.abs(mouseAbsX - charX);
      const proximity = 120;
      
      if (distance < proximity) {
        const factor = 1 - distance / proximity;
        scaleX.set(1 + factor * 1.5); // More extreme stretch
        scaleY.set(1 + factor * 0.3);
        if (ref.current) ref.current.style.color = '#ef4444'; // Red on proximity
      } else {
        scaleX.set(1);
        scaleY.set(1);
        if (ref.current) ref.current.style.color = ''; // Reset
      }
    });
  }, [mouseX, scaleX, scaleY, fontWeight]);

  return (
    <motion.span
      ref={ref}
      style={{ 
        display: 'inline-block', 
        scaleX, 
        scaleY,
        transformOrigin: 'center center',
        whiteSpace: char === ' ' ? 'pre' : 'normal',
        margin: '0 -0.01em', // Tighter spacing as requested
        fontWeight: 'inherit'
      }}
      className="transition-colors duration-500 ease-out"
    >
      {char}
    </motion.span>
  );
}
