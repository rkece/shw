'use client';
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import StretchText from './StretchText';

const DATA = [
  {
    id: 'chicken',
    name: 'CHICKEN CLASSIC',
    layers: [
      { id: 1, title: 'Original Toum', detail: 'Signature whipped garlic emulsion, made fresh hourly.', img: 'https://images.unsplash.com/photo-1544378730-8b5104b18790?w=800' },
      { id: 2, title: 'Pickled Garden', detail: 'Turkish cucumbers and crisp wild lettuce for the snap.', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800' },
      { id: 3, title: '24h Marinade', detail: 'Slow-carved chicken thighs, spiced with our heritage blend.', img: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800' },
      { id: 4, title: 'Hand-tossed Rumali', detail: 'Tissue-thin bread, cooked on a traditional inverted dome.', img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800' }
    ]
  },
  {
    id: 'fire',
    name: 'FIRE WRAP',
    layers: [
      { id: 1, title: 'Chili Infusion', detail: 'House-fermented habanero garlic sauce.', img: 'https://images.unsplash.com/photo-1544378730-8b5104b18790?w=800' },
      { id: 2, title: 'Jalapeno Crunch', detail: 'Pickled heat balanced with sweet red onions.', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800' },
      { id: 3, title: 'Spiced Protein', detail: 'Flame-grilled meat with extra black pepper and cumin.', img: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800' },
      { id: 4, title: 'Crispy Lavash', detail: 'Double-toasted flatbread for maximum structural integrity.', img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800' }
    ]
  }
];

export default function AnatomySection({ progress = 0 }: { progress?: number }) {
  const [activeType, setActiveType] = useState(0);
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative bg-white overflow-hidden py-20">
      <div className="absolute top-10 flex gap-4 z-50">
        {DATA.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setActiveType(i)}
            className={`px-6 py-2 rounded-full text-[10px] font-black tracking-[0.3em] uppercase transition-all ${activeType === i ? 'bg-red-600 text-white' : 'bg-black/5 text-black hover:bg-black/10'}`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="relative w-full max-w-4xl aspect-square flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeType}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {DATA[activeType].layers.map((layer, i) => (
              <Layer key={layer.id} layer={layer} index={i} total={DATA[activeType].layers.length} progress={progress} />
            ))}
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <h2 className="text-[15vw] md:text-[10vw] font-black text-black/5 uppercase leading-none select-none" style={{ fontFamily: 'var(--font-staatliches)' }}>ANATOMY</h2>
        </div>
      </div>

      <div className="absolute bottom-10 text-center">
          <p className="text-red-600 font-bold tracking-[0.5em] text-[10px] uppercase">Scroll to deconstruct the flavors</p>
      </div>
    </div>
  );
}

function Layer({ layer, index, total, progress }: { layer: any; index: number; total: number; progress: number }) {
  // Expansion logic based on progress
  const yOffset = (index - (total - 1) / 2) * 500 * progress;
  const rotateXVal = progress * 45;
  const scaleVal = 0.8 + (progress * 0.2);
  const opacityVal = 0.2 + (progress * 0.8);
  const labelOpacity = progress > 0.4 ? (progress - 0.4) * 2 : 0;

  return (
    <motion.div
       animate={{ 
         y: yOffset, 
         rotateX: rotateXVal, 
         scale: scaleVal,
         opacity: opacityVal
       }}
      className="absolute w-64 md:w-96 aspect-square group"
      style={{ zIndex: total - index }}
    >
      <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-2xl border border-white/20 transform-gpu group-hover:scale-105 transition-transform duration-500">
        <Image src={layer.img} alt={layer.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <StretchText 
              text={layer.title} 
              className="text-white text-3xl md:text-5xl font-black uppercase tracking-tight"
              style={{ fontFamily: 'var(--font-staatliches)', lineHeight: 0.9 }}
            />
            <p className="text-white/80 text-sm md:text-lg font-medium mt-4 leading-relaxed">{layer.detail}</p>
        </div>
      </div>
      
      {/* Connector Line and Label */}
      <motion.div 
        animate={{ opacity: labelOpacity }}
        className="absolute left-full ml-10 top-1/2 -translate-y-1/2 w-48 hidden md:block"
      >
          <div className="h-[1px] bg-red-600 w-full relative">
              <div className="absolute -right-2 -top-1 w-2 h-2 rounded-full bg-red-600" />
          </div>
          <div className="mt-4">
              <StretchText 
                text={layer.title} 
                className="text-red-600 text-sm md:text-lg font-black uppercase tracking-tight"
                style={{ fontFamily: 'var(--font-staatliches)' }}
              />
              <p className="text-black/60 text-[10px] md:text-xs font-bold uppercase mt-1 tracking-widest">Component {total - index}</p>
          </div>
      </motion.div>
    </motion.div>
  );
}
