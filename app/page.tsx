'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ArrowRight, MapPin, Phone, Mail, Users, Star, Flame, Clock, CheckCircle2, ChevronDown, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SplashScreen from '@/components/SplashScreen';
import Footer from '@/components/Footer';
import Magnetic from '@/components/Magnetic';
import TextReveal from '@/components/TextReveal';
import SoundToggle from '@/components/SoundToggle';
import Tilt from '@/components/Tilt';
import StretchText from '@/components/StretchText';
import AnatomySection from '@/components/AnatomySection';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const SECTIONS = [
  { id: 'hero', title: 'HERO' },
  { id: 'mission', title: 'MISSION' },
  { id: 'kitchens', title: 'KITCHENS' },
  { id: 'gallery', title: 'GALLERY' },
  { id: 'anatomy', title: 'ANATOMY' },
  { id: 'signatures', title: 'SIGNATURES' },
  { id: 'community', title: 'COMMUNITY' },
  { id: 'contact', title: 'CONTACT' }
];

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [anatomyProgress, setAnatomyProgress] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray('.slide-panel');

      sections.forEach((section: any, i: number) => {
        // Entrance animation
        if (i !== 0) {
          gsap.fromTo(section,
            { yPercent: 100 },
            {
              yPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: containerRef.current,
                start: () => `${i * 100}vh top`,
                end: () => `${(i + 1) * 100}vh top`,
                scrub: true,
              }
            }
          );
        }

        // Dedicated active progress trigger for each slide
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: () => `${i * 100}vh top`,
          end: () => `${(i + 1) * 100}vh top`,
          onToggle: self => {
            if (self.isActive) setActiveIdx(i);
          },
          onUpdate: (self) => {
            if (i === 4) setAnatomyProgress(self.progress);
          }
        });
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${(sections.length - 1) * 100}%`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const idx = Math.floor(progress * sections.length);
          if (idx !== activeIdx && idx < sections.length) {
            setActiveIdx(idx);
          }
        }
      });

      setTimeout(() => ScrollTrigger.refresh(), 1000);
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (idx: number) => {
    gsap.to(window, {
      scrollTo: idx * window.innerHeight,
      duration: 1.5,
      ease: "power3.inOut"
    });
  };

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div ref={mainRef} className="bg-[#0A0A0A] selection:bg-red-600 selection:text-white">
      <AnimatePresence>
        {showIntro && (
          <SplashScreen onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>
      
      {!showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative z-[200]"
        >
          <Navbar />
          <SoundToggle isMuted={isMuted} onToggle={toggleSound} />
        </motion.div>
      )}

      <div className="fixed right-10 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col gap-4">
        {SECTIONS.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSection(i)}
            className={`w-1 h-2 rounded-full transition-all duration-500 hover:bg-red-600 ${activeIdx === i ? 'bg-red-600 h-8 shadow-[0_0_10px_#ff0000]' : 'bg-white/20'}`}
          />
        ))}
      </div>

      <div ref={containerRef} className="relative w-full h-screen overflow-hidden">

        {/* SECTION 1: HERO - HD VIDEO NO BLUR NO CAPTION */}
        <section className="slide-panel absolute inset-0 z-[10] flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 bg-black pointer-events-none">
            {/* 
                "Virtual AI Eraser" Tech: 
                - scale-125 to zoom past captions
                - object-top to push captions off-screen at the bottom
                - opacity-100 for maximum HD clarity
            */}
            {!showIntro && (
              <>
                <Image 
                  src="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=1920&q=80"
                  alt="Background Fallback"
                  fill
                  className="object-cover opacity-50 brightness-[0.4]"
                  priority
                />
                <video
                  ref={videoRef}
                  autoPlay loop muted playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover object-top opacity-100 scale-125 filter contrast-125 brightness-110 z-10"
                >
                  <source src="/videos/intro.mp4" type="video/mp4" />
                </video>
              </>
            )}
            {/* Clean subtle vignette for text legibility without blurring the video */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black z-[1]" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 1.1, filter: "blur(20px)" }}
            animate={!showIntro ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
            className="relative z-[20] text-center px-6"
          >
            <span className="text-red-600 font-bold tracking-[0.8em] text-[10px] md:text-[11px] uppercase block mb-6 drop-shadow-lg" style={{ fontFamily: 'var(--font-syncopate)' }}>SHAWARMA INN</span>
            <div className="flex flex-col items-center mb-8 gap-0">
              <StretchText 
                text="PREMIUM" 
                className="text-5xl md:text-[8vw] font-black tracking-tighter text-white transition-all hover:text-red-600" 
                style={{ fontFamily: 'var(--font-staatliches)', lineHeight: 0.8 }}
              />
              <StretchText 
                text="FLAVORS" 
                className="text-5xl md:text-[8vw] font-black tracking-tighter text-red-600 italic transition-all hover:text-white mt-[-0.1em]" 
                style={{ fontFamily: 'var(--font-staatliches)', lineHeight: 0.8 }}
              />
            </div>
            <p className="text-white/60 text-[10px] md:text-sm font-medium max-w-md mx-auto mb-10 tracking-[0.15em] uppercase leading-relaxed" style={{ fontFamily: 'var(--font-space)' }}>
              Authentic Middle Eastern Craftsmanship since 1998. <br /> Experiencing the heritage of carved perfection.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Magnetic>
                <Link href="/menu">
                  <button className="btn-premium bg-red-600 text-white px-6 py-3 rounded-full font-bold text-[9px] md:text-[10px] tracking-[0.4em] uppercase shadow-[0_20px_40px_-10px_rgba(204,26,26,0.3)] border border-white/10 overflow-hidden group">
                    <span className="relative z-10">EXPLORE MENU</span>
                    <motion.div className="absolute inset-0 bg-white z-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </button>
                </Link>
              </Magnetic>
              <Magnetic>
                <button 
                  onClick={() => scrollToSection(5)}
                  className="px-6 py-3 rounded-full font-bold text-[9px] md:text-[10px] tracking-[0.4em] uppercase border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-500"
                >
                  SIGNATURES
                </button>
              </Magnetic>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={!showIntro ? { opacity: 0.6 } : {}}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 text-white z-[20]"
          >
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown size={32} strokeWidth={1} />
            </motion.div>
          </motion.div>
        </section>
        
        {/* SECTION 2: MISSION */}
        <section className="slide-panel absolute inset-0 z-[15] flex flex-col items-center justify-center bg-white">
          <div className="max-w-4xl w-full px-6 text-center text-black">
            <motion.div
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 1 }}
            >
              <h2 className="text-red-600 font-black tracking-[0.5em] text-[10px] uppercase mb-8">OUR MISSION</h2>
              <p className="text-2xl md:text-5xl font-black tracking-tighter leading-none mb-10" style={{ fontFamily: 'var(--font-outfit)' }}>
                TO SERVE THE <span className="text-red-600">BOLDEST</span> FLAVORS WITH UNCOMPROMISING <span className="text-red-600">QUALITY.</span>
              </p>
               <p className="text-black/40 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                We believe shawarma is an art. Since 1998, we've remained true to traditional methods while innovating for the modern palate.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SECTION 3: KITCHENS */}
        <section className="slide-panel absolute inset-0 z-[20] flex flex-col items-center justify-center bg-white">
          <div className="max-w-7xl w-full px-6 text-center text-black">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-red-600 font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block"
            >
              VISIT OUR KITCHENS
            </motion.span>
            <h2 className="text-5xl md:text-7xl font-bold mb-16 tracking-tighter text-black" style={{ fontFamily: 'var(--font-outfit)' }}>OUR BRANCHES</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {[
                { name: 'Kolathur', map: 'https://maps.google.com/?q=Shawarma+Inn+Kolathur' },
                { name: 'Madhavaram', map: 'https://maps.google.com/?q=Shawarma+Inn+Madhavaram' },
                { name: 'Thirumullaivoyal', map: 'https://maps.google.com/?q=Shawarma+Inn+Thirumullaivoyal' },
                { name: 'Mathur', map: 'https://maps.google.com/?q=Shawarma+Inn+Mathur' },
                { name: 'KKD Nagar', map: 'https://maps.google.com/?q=Shawarma+Inn+KKD+Nagar' },
                { name: 'Anna Nagar', map: 'https://maps.google.com/?q=Shawarma+Inn+Anna+Nagar' }
              ].map((loc, i) => (
                <Magnetic key={i}>
                  <a href={loc.map} target="_blank" rel="noopener noreferrer">
                    <Tilt className="p-6 md:p-8 border border-black/5 bg-black/5 rounded-[30px] hover:bg-black hover:text-white transition-all duration-500 group">
                      <MapPin className="mx-auto mb-4 text-red-600 group-hover:scale-110 transition-transform" size={24} />
                       <h3 className="text-sm md:text-lg font-black uppercase tracking-tight line-clamp-1">{loc.name}</h3>
                      <p className="mt-2 text-[10px] tracking-[0.2em] opacity-60 uppercase transition-opacity group-hover:opacity-100 font-bold">Open 24/7</p>
                    </Tilt>
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: GALLERY */}
        <section className="slide-panel absolute inset-0 z-[25] flex flex-col items-center justify-center bg-white">
          <div className="max-w-7xl w-full px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800',
                'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800',
                'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
                'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800'
              ].map((img, i) => (
                <Tilt key={i} className="aspect-[4/5] overflow-hidden rounded-[30px] relative group">
                  <Image src={img} alt="Gallery" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" />
                  <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </Tilt>
              ))}
            </div>
            <div className="text-center mt-12">
               <h3 className="text-black font-black tracking-[0.8em] text-[10px] uppercase">OUR CRAFT • IN EVERY DETAIL</h3>
            </div>
          </div>
        </section>

        {/* SECTION 5: ANATOMY */}
        <section className="slide-panel absolute inset-0 z-[30] flex flex-col items-center justify-center bg-white">
          <AnatomySection progress={anatomyProgress} />
        </section>
        {/* SECTION 6: SIGNATURES */}
        <section id="signatures" className="slide-panel absolute inset-0 z-[35] flex flex-col items-center justify-center bg-white">

          <div className="max-w-7xl w-full px-6">
            <div className="text-center mb-16">
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-red-600 font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block"
              >
                CRAFTED PERFECTION
              </motion.span>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-black" style={{ fontFamily: 'var(--font-outfit)' }}>SIGNATURES</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              {[
                { name: 'Rumali Special', img: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600', id: 'rumali-special' },
                { name: 'Fire Wrap', img: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=600', id: 'fire-wrap' },
                { name: 'Heritage Plate', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600', id: 'heritage-plate' },
                { name: 'Garlic Blast', img: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600', id: 'garlic-blast' }
              ].map((item, i) => (
                <Link href={`/menu`} key={i}>
                  <Tilt className="aspect-[3/4] bg-black/5 rounded-[40px] border border-black/5 overflow-hidden group relative cursor-pointer" data-cursor="VIEW DISH">
                    <Image src={item.img} alt={item.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[50%] group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute bottom-10 left-10 translate-y-2 group-hover:translate-y-0 transition-transform">
                      <p className="text-white font-bold tracking-[0.2em] text-xs uppercase mb-2">SIGNATURE {i + 1}</p>
                      <h4 className="text-white font-black text-2xl uppercase leading-none">{item.name}</h4>
                    </div>
                  </Tilt>
                </Link>
              ))}
            </div>

            <div className="flex justify-center">
              <Magnetic>
                <Link href="/menu">
                  <button className="group flex items-center gap-4 text-black font-black tracking-[0.2em] text-xs md:text-sm uppercase px-10 py-5 border-2 border-black/10 rounded-full hover:bg-black hover:text-white transition-all duration-500 shadow-xl">
                    EXPLORE FULL MENU <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </Link>
              </Magnetic>
            </div>
          </div>
        </section>

        {/* SECTION 7: COMMUNITY */}
        <section className="slide-panel absolute inset-0 z-[40] flex flex-col items-center justify-center bg-white">
          <div className="text-center px-6 max-w-7xl w-full">
            <div className="mb-20">
              <div className="flex gap-4 items-center justify-center text-red-500 mb-8">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} fill="currentColor" size={24} className="drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]" />)}
              </div>
              <h2 className="text-5xl md:text-8xl font-bold tracking-tighter uppercase leading-[0.9] text-black" style={{ fontFamily: 'var(--font-outfit)' }}>
                TRUSTED BY <br /> <span className="text-red-600">THOUSANDS.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { user: "Rakesh K.", platform: "Zomato", rating: 5, text: "The most consistent shawarma flavor in Chennai. Literally a masterpiece every single time!" },
                { user: "Priya M.", platform: "Google Maps", rating: 5, text: "The meat is so juicy and tender. Best garlic mayo I've ever had. Highly recommended!" },
                { user: "Arun V.", platform: "Swiggy", rating: 4.8, text: "Ordered the Fire Wrap, it was actually fire! Great packaging and fast delivery." }
              ].map((feedback, i) => (
                <Tilt key={i} className="p-10 bg-black/5 rounded-[40px] border border-black/5 text-left relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <MessageSquare size={100} className="text-black" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill={s <= Math.floor(feedback.rating) ? "#CC1A1A" : "transparent"} className="text-red-600" />)}
                      </div>
                      <span className="text-[10px] font-bold text-red-600/50 tracking-widest uppercase">{feedback.platform}</span>
                    </div>
                    <p className="text-lg md:text-xl font-medium text-black/80 mb-8 leading-relaxed italic">"{feedback.text}"</p>
                    <div>
                      <h4 className="font-bold text-black uppercase tracking-widest text-sm">{feedback.user}</h4>
                      <p className="text-[10px] text-black/30 font-bold uppercase mt-1 tracking-widest">Verified Customer</p>
                    </div>
                  </div>
                </Tilt>
              ))}
            </div>
            <p className="mt-16 text-black/20 tracking-[0.5em] text-[10px] font-black uppercase">5.0 Star Rated Cuisine Across Platforms</p>
          </div>
        </section>

        {/* SECTION 8: CONTACT */}
        <section className="slide-panel absolute inset-0 z-[45] flex flex-col bg-white">
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-red-600 font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block"
            >
              LOCATE US
            </motion.span>
            <h2 className="text-5xl md:text-7xl font-bold mb-16 tracking-tighter text-black" style={{ fontFamily: 'var(--font-outfit)' }}>CONTACT INFO</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-5xl">
              {[
                { icon: Phone, title: "HOTLINE", detail: "+91 98765 43210", action: "tel:+919876543210" },
                { icon: Mail, title: "EMAIL US", detail: "HELLO@SHAWARMAINN.COM", action: "mailto:hello@shawarmainn.com" },
                { icon: MapPin, title: "MAIN OFFICE", detail: "CHENNAI, TAMIL NADU", action: "#" }
              ].map((item, i) => (
                <Magnetic key={i}>
                  <a href={item.action} className="block text-center p-12 bg-black/5 rounded-[40px] hover:bg-black hover:text-white transition-all duration-700 group border border-transparent hover:border-black/5">
                    <item.icon className="mx-auto mb-6 text-red-600 group-hover:scale-125 transition-transform duration-500" size={32} />
                    <h4 className="text-[10px] font-black tracking-[0.3em] text-black/30 group-hover:text-white/40 mb-3">{item.title}</h4>
                    <p className="text-lg font-bold tracking-tight">{item.detail}</p>
                  </a>
                </Magnetic>
              ))}
            </div>

            {/* Social media removed as requested (present in footer) */}
          </div>
          <Footer />
        </section>

      </div>

      <div style={{ height: `${(SECTIONS.length - 1) * 100}vh` }} />
    </div>
  );
}
