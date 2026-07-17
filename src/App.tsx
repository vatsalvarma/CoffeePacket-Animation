import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag, Leaf, Droplets, Flame } from 'lucide-react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const coffees = [
  {
    id: 1,
    name: "GOLDEN RESERVE",
    subtitle: "Premium Espresso Roast",
    description: "A rich and bold espresso roast with hints of dark chocolate, toasted almonds, and a velvet caramel finish. Hand-selected from the finest high-altitude estates.",
    image: import.meta.env.BASE_URL + "coffee_gold.png",
    bgColor: "#12110c",
    accentColor: "#D4AF37",
    price: "$24.99",
    ingredients: ["100% Arabica Beans", "Dark Cocoa Extract", "Madagascar Vanilla", "Toasted Almond Essence"],
    roastLevel: "Dark Roast",
    origin: "Colombia & Ethiopia"
  },
  {
    id: 2,
    name: "RUBY ORIGIN",
    subtitle: "Wild Berry & Citrus",
    description: "A bright, fruity medium roast featuring exhilarating notes of wild berries, sweet citrus, and a clean, vibrant finish. Cultivated in volcanic, nutrient-rich soils.",
    image: import.meta.env.BASE_URL + "coffee_ruby.png",
    bgColor: "#1a0f12",
    accentColor: "#E0115F",
    price: "$28.00",
    ingredients: ["Single Origin Peaberry", "Dried Wild Berries", "Citrus Zest", "Hibiscus Flower"],
    roastLevel: "Medium Roast",
    origin: "Costa Rica"
  },
  {
    id: 3,
    name: "EMERALD FOREST",
    subtitle: "Smooth & Earthy",
    description: "A smooth, earthy light roast with a refreshing botanical finish. Shade-grown under the dense canopies of tropical rainforests to preserve natural flavor profiles.",
    image: import.meta.env.BASE_URL + "coffee_emerald.png",
    bgColor: "#0a1410",
    accentColor: "#50C878",
    price: "$22.50",
    ingredients: ["Organic Shade-Grown Beans", "Matcha Dust", "Mint Leaf Extract", "Earthy Botanical Blend"],
    roastLevel: "Light Roast",
    origin: "Sumatra"
  }
];

const SplitText = ({ text, delayOffset = 0, direction }: { text: string, delayOffset?: number, direction: number }) => {
  return (
    <span className="flex flex-wrap gap-[0.2em] overflow-hidden">
      {text.split(' ').map((word, wordIndex) => (
        <span key={wordIndex} className="flex overflow-hidden">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              custom={direction}
              initial={{ y: "120%", rotate: 10, opacity: 0 }}
              animate={{ 
                y: "0%", 
                rotate: 0, 
                opacity: 1,
                transition: { duration: 0.8, ease: [0.21, 1.11, 0.81, 0.99], delay: delayOffset + (wordIndex * 0.05) + (charIndex * 0.02) } 
              }}
              exit={{ 
                y: direction === 1 ? "-120%" : "120%", opacity: 0, 
                transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } 
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
};

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageMoverRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);

  const activeCoffee = coffees[currentIndex];

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    let mm = gsap.matchMedia();

    if (imageMoverRef.current && section2Ref.current) {
      
      mm.add("(min-width: 1024px)", () => {
        // DESKTOP ANIMATION: Move left and arc
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section2Ref.current,
            start: "top bottom",
            end: "top top",
            scrub: 0.8,
          }
        });

        tl.to(imageMoverRef.current, { xPercent: -100, ease: "power1.inOut", duration: 1 }, 0);
        tl.to(imageMoverRef.current, { yPercent: -25, scale: 0.85, rotateZ: 15, ease: "sine.out", duration: 0.5 }, 0);
        tl.to(imageMoverRef.current, { yPercent: 0, scale: 1, rotateZ: -5, ease: "sine.in", duration: 0.5 }, 0.5);
      });

      mm.add("(max-width: 1023px)", () => {
        // MOBILE ANIMATION: Move up and shrink slightly to fit above ingredients
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section2Ref.current,
            start: "top bottom",
            end: "top top",
            scrub: 0.8,
          }
        });

        // We use yPercent to translate the entire full-height wrapper upwards
        tl.to(imageMoverRef.current, {
          yPercent: -45, // Moves it to the top half of the screen
          scale: 0.7,
          rotateZ: 10,
          ease: "power2.inOut"
        });
      });
    }

    return () => {
      lenis.destroy();
      mm.revert();
    };
  }, []);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === coffees.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? coffees.length - 1 : prev - 1));
  };

  const fadeUpVariant: Variants = {
    initial: () => ({ y: 40, opacity: 0, filter: "blur(8px)" }),
    animate: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
    exit: () => ({ y: -40, opacity: 0, filter: "blur(8px)", transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } })
  };

  const imageVariants: Variants = {
    initial: (dir: number) => ({
      x: dir === 1 ? '50vw' : '-50vw',
      scale: 0.8, rotateZ: dir === 1 ? 25 : -25, opacity: 0
    }),
    animate: {
      x: 0, scale: 1, rotateZ: 0, opacity: 1,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (dir: number) => ({
      x: dir === 1 ? '-50vw' : '50vw',
      scale: 0.8, rotateZ: dir === 1 ? -25 : 25, opacity: 0,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    })
  };

  return (
    <motion.div 
      className="relative w-full transition-colors duration-1000 ease-in-out font-sans"
      animate={{ backgroundColor: activeCoffee.bgColor }}
      ref={containerRef}
    >
      {/* Ambient Glow */}
      <motion.div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full blur-[160px] opacity-20 pointer-events-none mix-blend-screen z-0"
        animate={{ backgroundColor: activeCoffee.accentColor }}
        transition={{ duration: 1.2 }}
      />
      
      {/* Sticky Navbar */}
      <nav className="fixed top-0 left-0 w-full h-[10vh] px-6 lg:px-16 flex justify-between items-center z-50 mix-blend-difference">
        <div className="text-xl md:text-2xl font-black tracking-[0.2em] text-white cursor-pointer hover:scale-105 transition-transform duration-500">
          AURA
        </div>
        <div className="hidden md:flex gap-12 text-xs font-bold tracking-[0.3em] uppercase text-white/70">
          <a href="#" className="hover:text-white hover:tracking-[0.4em] transition-all duration-500">Shop</a>
          <a href="#" className="hover:text-white hover:tracking-[0.4em] transition-all duration-500">Story</a>
          <a href="#" className="hover:text-white hover:tracking-[0.4em] transition-all duration-500">Contact</a>
        </div>
        <button className="flex items-center gap-2 lg:gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white/90 hover:text-white group transition-all duration-500">
          <ShoppingBag className="w-4 h-4 group-hover:scale-125 transition-transform duration-500" />
          <span className="hidden sm:inline">Cart</span>
        </button>
      </nav>

      {/* FIXED IMAGE WRAPPER - Mobile: Bottom aligned. Desktop: Right aligned. */}
      <div className="fixed top-0 left-0 w-full h-[100dvh] pointer-events-none z-30">
        <div 
          ref={imageMoverRef} 
          className="absolute right-0 top-0 w-full lg:w-1/2 h-full flex items-end lg:items-center justify-center lg:justify-end px-8 pb-[18vh] lg:pb-0 lg:pr-32"
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.img
              key={activeCoffee.id}
              src={activeCoffee.image}
              alt={activeCoffee.name}
              custom={direction}
              variants={imageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-h-[38vh] lg:max-h-[90vh] w-auto object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
              style={{ filter: `drop-shadow(0 0 50px ${activeCoffee.accentColor}30)` }}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* CONTENT LAYERS */}
      <div className="relative z-20 w-full">
        
        {/* ================= PAGE 1: HERO ================= */}
        <div className="min-h-[100dvh] w-full max-w-[1600px] mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 pt-[10vh] lg:pt-[15vh] pb-[15vh]">
          {/* Left Side: Hero Text - Top aligned on mobile, Center on desktop */}
          <div className="flex flex-col justify-start lg:justify-center h-full relative z-20 pt-2 lg:pt-0">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div key={activeCoffee.id} className="absolute w-full lg:w-[120%]">
                
                <div className="overflow-hidden mb-2 lg:mb-6">
                  <motion.span 
                    custom={direction} variants={fadeUpVariant} initial="initial" animate="animate" exit="exit"
                    className="block text-[10px] md:text-sm font-bold tracking-[0.4em] uppercase" 
                    style={{ color: activeCoffee.accentColor }}
                  >
                    {activeCoffee.subtitle}
                  </motion.span>
                </div>
                
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.1] mb-3 lg:mb-8 text-white tracking-tighter" style={{ textShadow: `0 20px 40px ${activeCoffee.accentColor}30` }}>
                  <SplitText text={activeCoffee.name} delayOffset={0.1} direction={direction} />
                </h1>
                
                <motion.div custom={direction} variants={fadeUpVariant} initial="initial" animate="animate" exit="exit" transition={{ delay: 0.3 }}>
                  <p className="text-white/70 text-xs sm:text-sm md:text-lg leading-relaxed max-w-md mb-6 lg:mb-10 font-light">
                    {activeCoffee.description}
                  </p>
                  
                  <div className="flex items-center gap-4 lg:gap-10">
                    <span className="text-xl sm:text-2xl lg:text-4xl font-light text-white tracking-tight">{activeCoffee.price}</span>
                    <button 
                      className="px-5 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-full font-bold tracking-[0.2em] uppercase text-[9px] lg:text-xs transition-all duration-500 relative overflow-hidden group hover:scale-105 pointer-events-auto"
                      style={{ backgroundColor: activeCoffee.accentColor, color: '#000', boxShadow: `0 10px 30px -10px ${activeCoffee.accentColor}` }}
                    >
                      <span className="relative z-10 flex items-center gap-2">Order Now</span>
                      <div className="absolute inset-0 bg-white/30 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Right Side is empty to let the fixed image show on desktop */}
          <div className="hidden lg:block"></div>
        </div>

        {/* ================= PAGE 2: INGREDIENTS ================= */}
        <div ref={section2Ref} className="min-h-[100dvh] w-full relative z-20 flex items-center bg-black/20 backdrop-blur-3xl border-t border-white/5">
          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2">
             {/* Spacers for the fixed image: Mobile top, Desktop left */}
             <div className="block lg:hidden h-[40vh] w-full"></div>
             <div className="hidden lg:block h-[50vh]"></div>
             
             {/* Ingredients Text */}
             <div className="flex flex-col justify-center py-10 lg:py-24 z-20">
                <AnimatePresence custom={direction} mode="wait">
                  <motion.div key={activeCoffee.id + 'ing'} className="w-full">
                     <motion.h2 
                        custom={direction} variants={fadeUpVariant} initial="initial" whileInView="animate" viewport={{ once: false, margin: "-50px" }} exit="exit"
                        className="text-3xl md:text-5xl font-black text-white mb-8 lg:mb-12 tracking-tight"
                     >
                        Crafted with <br className="block sm:hidden" /><span style={{ color: activeCoffee.accentColor }}>Precision.</span>
                     </motion.h2>

                     <div className="space-y-6 lg:space-y-8">
                        <motion.div custom={direction} variants={fadeUpVariant} initial="initial" whileInView="animate" viewport={{ once: false, margin: "-50px" }} exit="exit" transition={{ delay: 0.1 }} className="flex items-start gap-3 lg:gap-4">
                           <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shrink-0">
                              <Leaf style={{ color: activeCoffee.accentColor }} className="w-4 h-4 lg:w-5 lg:h-5" />
                           </div>
                           <div>
                              <h3 className="text-white font-bold text-base lg:text-lg mb-2 tracking-wide">Premium Ingredients</h3>
                              <ul className="space-y-1 lg:space-y-2">
                                {activeCoffee.ingredients.map((ing, i) => (
                                  <li key={i} className="text-white/60 text-sm lg:text-base font-light flex items-center gap-2">
                                    <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full shrink-0" style={{ backgroundColor: activeCoffee.accentColor }} />
                                    {ing}
                                  </li>
                                ))}
                              </ul>
                           </div>
                        </motion.div>

                        <motion.div custom={direction} variants={fadeUpVariant} initial="initial" whileInView="animate" viewport={{ once: false, margin: "-50px" }} exit="exit" transition={{ delay: 0.2 }} className="flex items-start gap-3 lg:gap-4">
                           <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shrink-0">
                              <Flame style={{ color: activeCoffee.accentColor }} className="w-4 h-4 lg:w-5 lg:h-5" />
                           </div>
                           <div>
                              <h3 className="text-white font-bold text-base lg:text-lg mb-2 tracking-wide">Roast Profile</h3>
                              <p className="text-white/60 text-sm lg:text-base font-light leading-relaxed">{activeCoffee.roastLevel} - Masterfully roasted to highlight natural oils and deep flavor notes.</p>
                           </div>
                        </motion.div>

                        <motion.div custom={direction} variants={fadeUpVariant} initial="initial" whileInView="animate" viewport={{ once: false, margin: "-50px" }} exit="exit" transition={{ delay: 0.3 }} className="flex items-start gap-3 lg:gap-4">
                           <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shrink-0">
                              <Droplets style={{ color: activeCoffee.accentColor }} className="w-4 h-4 lg:w-5 lg:h-5" />
                           </div>
                           <div>
                              <h3 className="text-white font-bold text-base lg:text-lg mb-2 tracking-wide">Origin</h3>
                              <p className="text-white/60 text-sm lg:text-base font-light leading-relaxed">{activeCoffee.origin} - Sourced from sustainable, high-altitude farms.</p>
                           </div>
                        </motion.div>
                     </div>
                  </motion.div>
                </AnimatePresence>
             </div>
          </div>
        </div>

      </div>

      {/* Navigation Controls (Absolute to Hero page) */}
      <div className="absolute top-[85dvh] left-0 w-full h-[15vh] px-6 lg:px-16 flex justify-between items-center z-40">
        {/* Thumbnails indicator */}
        <div className="flex gap-2 lg:gap-6 items-center">
          {coffees.map((coffee, idx) => (
            <button
              key={coffee.id}
              onClick={() => {
                if (idx !== currentIndex) {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }
              }}
              className="relative group w-8 sm:w-12 lg:w-20 h-[2px] lg:h-1 cursor-pointer py-4"
            >
              <div className="absolute inset-y-1/2 -translate-y-1/2 left-0 right-0 h-[2px] lg:h-1 bg-white/20 overflow-hidden transition-all duration-300 group-hover:bg-white/40 group-hover:scale-y-150">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-white"
                  initial={false}
                  animate={{ 
                    width: currentIndex === idx ? '100%' : '0%',
                    opacity: currentIndex === idx ? 1 : 0 
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </button>
          ))}
          <div className="text-white/50 font-mono text-[10px] lg:text-sm ml-2 lg:ml-4 font-light tracking-[0.3em]">
            0{currentIndex + 1} / 0{coffees.length}
          </div>
        </div>

        {/* Arrows */}
        <div className="flex gap-2 lg:gap-5">
          <button 
            onClick={handlePrev}
            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full border border-white/20 flex items-center justify-center text-white backdrop-blur-md hover:bg-white hover:text-black hover:scale-110 transition-all duration-500 ease-[0.16,1,0.3,1] pointer-events-auto"
          >
            <ChevronLeft className="w-4 h-4 lg:w-6 lg:h-6" strokeWidth={1.5} />
          </button>
          <button 
            onClick={handleNext}
            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full border border-white/20 flex items-center justify-center text-white backdrop-blur-md hover:bg-white hover:text-black hover:scale-110 transition-all duration-500 ease-[0.16,1,0.3,1] pointer-events-auto"
          >
            <ChevronRight className="w-4 h-4 lg:w-6 lg:h-6" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      
    </motion.div>
  );
}

export default App;
