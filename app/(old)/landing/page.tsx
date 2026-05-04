'use client';

// import './landing.module.css';
import React, { useState, useEffect, useRef } from 'react';

export default function Landing() {
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [slidePosition, setSlidePosition] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorGrow, setCursorGrow] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Hero slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % 4);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  // Mouse move tracking for custom cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Add hover effects to interactive elements
  useEffect(() => {
    const interactiveElements = document.querySelectorAll(
      'button,a,.nav-link,.ss-card,.step-card,.bento-cell,.testi-card'
    );
    const handleMouseEnter = () => setCursorGrow(true);
    const handleMouseLeave = () => setCursorGrow(false);

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // Outfit slideshow navigation
  const handleSlideNext = () => {
    const maxPosition = (5 - 3) * 316;
    setSlidePosition((prev) => Math.min(prev + 316, maxPosition));
  };

  const handleSlidePrev = () => {
    setSlidePosition((prev) => Math.max(prev - 316, 0));
  };

  return (
    // <div style={{ cursor: 'none' }}>
    <div>       {/* Custom Cursor */}
      {/* <div
        ref={cursorRef}
        className={`cursor ${cursorGrow ? 'grow' : ''}`}
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
        }}
      /> */}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-100 flex items-center justify-between px-10 py-5 mix-blend-multiply">
        <div className="font-playfair text-2xl font-light text-espresso tracking-wider">
          Mur<em className="italic text-accent">a</em>
        </div>
        <div className="flex gap-8 items-center">
          <a href="#" className="text-xs uppercase font-medium text-espresso tracking-widest hover:cursor-none">
            How it works
          </a>
          <a href="#" className="text-xs uppercase font-medium text-espresso tracking-widest hover:cursor-none">
            Features
          </a>
          <a href="#" className="text-xs uppercase font-medium text-espresso tracking-widest hover:cursor-none">
            Looks
          </a>
          <a href="#" className="text-xs font-bold text-sand bg-espresso px-5 py-2 border-2 border-espresso uppercase tracking-widest transition-all hover:bg-gold hover:text-espresso hover:border-gold hover:cursor-none">
            Get early access
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen grid grid-cols-2 relative overflow-hidden">
        <div className="flex flex-col justify-end p-10 pt-32 pb-12 relative z-20">
          <p className="font-mono text-xs tracking-widest text-muted uppercase mb-5 flex items-center gap-3 before:content-[''] before:inline-block before:w-8 before:h-px before:bg-muted">
            AI wardrobe stylist
          </p>
          <h1 className="font-playfair text-7xl font-bold leading-tight text-espresso mb-7">
            Dress with<em className="italic text-accent block">intention.</em>
          </h1>
          <p className="text-base text-muted max-w-xs leading-7 mb-10 font-light">
            Upload your wardrobe. Mura's AI learns your style and curates exactly what to wear — every single day.
          </p>
          <div className="flex gap-4 items-center">
            <button className="font-mono text-xs font-bold text-sand bg-espresso px-8 py-4 border-2 border-espresso uppercase tracking-widest transition-all hover:bg-gold hover:text-espresso hover:border-gold hover:cursor-none">
              Start for free
            </button>
            <a href="#" className="text-sm text-muted underline tracking-wider hover:cursor-none">
              See how it works ↓
            </a>
          </div>
        </div>
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`hero-img absolute inset-0 bg-cover bg-center ${
                  heroImageIndex === index ? 'active opacity-100' : 'opacity-0'
                }`}
                style={{
                  backgroundImage: [
                    'url("https://images.unsplash.com/photo-1619785292559-a15caa28bde6?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
                    'url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80")',
                    'url("https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80")',
                    'url("https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80")',
                  ][index],
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-sand via-sand to-transparent z-10" />
          <div className="absolute top-32 -right-2.5 bg-gold text-espresso font-mono text-xs font-bold uppercase px-4 py-2 border-2 border-espresso z-20" style={{ transform: 'rotate(3deg)' }}>
            AI Styled ✦
          </div>
          <div className="absolute bottom-12 right-10 z-30 font-mono text-xs text-sand/70 flex items-center gap-2.5">
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`hc-dot w-1.5 h-1.5 rounded-full transition-colors ${
                    heroImageIndex === index ? 'active bg-gold' : 'bg-sand/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-10 font-mono text-xs tracking-widest text-muted uppercase flex items-center gap-2 z-20 hero-scroll-line">
          <span>Scroll</span>
          <div className="w-px h-10 bg-muted" style={{ animation: 'scrollline 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-espresso py-3.5 overflow-hidden relative">
        <div className="marquee-track flex gap-0 whitespace-nowrap">
          {[
            'Smart Wardrobe',
            'Daily Outfit AI',
            'Style Analysis',
            'Occasion Dressing',
            'Capsule Wardrobe',
            'Trend Aware',
            'Smart Wardrobe',
            'Daily Outfit AI',
            'Style Analysis',
            'Occasion Dressing',
            'Capsule Wardrobe',
            'Trend Aware',
          ].map((item, index) => (
            <span key={index} className="font-mono text-xs font-bold uppercase text-sand px-8 flex items-center gap-4">
              {item}
              <span className="text-gold text-xs">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <section className="px-10 py-24">
        <p className="font-mono text-xs tracking-widest text-muted uppercase mb-4 flex items-center gap-3 before:content-[''] before:inline-block before:w-6 before:h-px before:bg-muted">
          Process
        </p>
        <h2 className="font-playfair text-5xl font-bold leading-tight mb-12">
          Three steps to<br />
          <em className="italic text-accent">effortless style.</em>
        </h2>
        <div className="grid grid-cols-3 gap-0 border-2 border-espresso">
          {[
            {
              num: '01',
              icon: '📸',
              title: 'Photograph your pieces',
              desc: 'Snap your clothes and Mura catalogues everything — fabrics, colours, silhouettes — into your digital wardrobe.',
            },
            {
              num: '02',
              icon: '🤖',
              title: 'AI learns your taste',
              desc: 'Mura analyses your wardrobe and picks up on your personal aesthetic, lifestyle and dressing patterns over time.',
            },
            {
              num: '03',
              icon: '✦',
              title: 'Get styled every morning',
              desc: 'Wake up to curated outfit suggestions for the day — considering weather, occasion, and what you actually own.',
            },
          ].map((step, index) => (
            <div
              key={index}
              className={`step-card p-10 relative overflow-hidden ${index < 2 ? 'border-r-2 border-espresso' : ''}`}
            >
              <div className="step-num font-playfair text-8xl font-bold leading-none mb-5">
                {step.num}
              </div>
              <div className="absolute top-8 right-8 text-3xl opacity-25">
                {step.icon}
              </div>
              <h3 className="font-playfair text-2xl font-medium mb-3 text-espresso">
                {step.title}
              </h3>
              <p className="text-sm text-muted leading-7 font-light">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Features */}
      <div className="px-10 pb-24 grid grid-cols-12 gap-3">
        <div className="bento-cell col-span-7 row-span-2 bg-espresso min-h-96 flex flex-col justify-end p-10 relative">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p className="font-mono text-xs tracking-widest text-gold uppercase mb-3">Core feature</p>
            <h3 className="font-playfair text-4xl font-medium leading-tight text-sand mb-2">
              Your entire wardrobe, organised and alive.
            </h3>
            <p className="text-sm leading-7 font-light" style={{ color: 'rgba(245,240,234,0.65)' }}>
              Every piece tagged, searchable, and understood. Mura knows your closet better than you do.
            </p>
          </div>
        </div>
        <div className="bento-cell col-span-5 bg-gold p-9 flex flex-col justify-between min-h-48">
          <div>
            <p className="font-mono text-xs tracking-widest text-accent uppercase mb-3">Daily styling</p>
            <h3 className="font-playfair text-2xl font-medium leading-tight text-espresso">
              Outfit of the day, every day.
            </h3>
          </div>
          <div className="inline-block font-mono text-xs font-bold tracking-widest text-espresso uppercase px-3 py-1.5 bg-gold border border-espresso mt-3">
            Weather-aware ✦
          </div>
        </div>
        <div className="bento-cell col-span-5 bg-warm-mid p-9 border-2 border-espresso min-h-48 flex flex-col justify-between">
          <div>
            <p className="font-mono text-xs tracking-widest text-accent uppercase mb-3">Stats</p>
            <div className="font-playfair text-6xl font-bold leading-none text-gold mb-1">
              94%
            </div>
          </div>
          <p className="text-sm leading-7 font-light text-muted">
            of users say they feel more confident getting dressed with Mura.
          </p>
        </div>
        <div className="bento-cell col-span-4 bg-raw p-9 border-2 border-espresso min-h-40">
          <p className="font-mono text-xs tracking-widest text-muted uppercase mb-3">Smart gaps</p>
          <h3 className="font-playfair text-xl font-medium leading-tight text-espresso mb-2">
            Tells you what's missing.
          </h3>
          <p className="text-sm leading-7 font-light text-muted">
            Mura spots the gaps in your wardrobe and suggests pieces worth buying.
          </p>
        </div>
        <div className="bento-cell col-span-4 bg-espresso p-9 min-h-40 flex flex-col justify-between">
          <p className="font-mono text-xs tracking-widest text-gold uppercase mb-3">Occasions</p>
          <div>
            <h3 className="font-playfair text-xl font-medium leading-tight text-sand">
              Dressed for every moment.
            </h3>
            <p className="text-sm leading-7 font-light mt-2" style={{ color: 'rgba(245,240,234,0.6)' }}>
              Work, dinner, weekend escape — Mura has a look for all of it.
            </p>
          </div>
        </div>
        <div className="bento-cell col-span-4 bg-sand p-9 border-2 border-espresso min-h-40">
          <p className="font-mono text-xs tracking-widest text-muted uppercase mb-3">Sustainability</p>
          <h3 className="font-playfair text-xl font-medium leading-tight text-espresso mb-2">
            Wear more of what you own.
          </h3>
          <p className="text-sm leading-7 font-light text-muted">
            Reduce waste by actually using the pieces you already have.
          </p>
        </div>
      </div>

      {/* Outfit Slideshow */}
      <section className="pb-24">
        <div className="px-10 flex justify-between items-end mb-8">
          <div>
            <p className="font-mono text-xs tracking-widest text-muted uppercase mb-3 flex items-center gap-3 before:content-[''] before:inline-block before:w-6 before:h-px before:bg-muted">
              Outfit looks
            </p>
            <h2 className="font-playfair text-3xl font-bold leading-tight">
              Styled by <em className="italic text-accent">Mura.</em>
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              className="ss-btn w-11 h-11 border-2 border-espresso flex items-center justify-center text-lg font-mono transition-all hover:bg-espresso hover:text-sand hover:cursor-none"
              onClick={handleSlidePrev}
            >
              ←
            </button>
            <button
              className="ss-btn w-11 h-11 border-2 border-espresso flex items-center justify-center text-lg font-mono transition-all hover:bg-espresso hover:text-sand hover:cursor-none"
              onClick={handleSlideNext}
            >
              →
            </button>
          </div>
        </div>
        <div className="px-10 overflow-hidden">
          <div
            className="ss-track flex gap-4"
            style={{
              transform: `translateX(-${slidePosition}px)`,
            }}
          >
            {[
              {
                img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80',
                badge: 'Casual Friday',
                occ: 'Everyday',
                name: 'Easy Linen Look',
              },
              {
                img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80',
                badge: 'Evening Out',
                occ: 'Night',
                name: 'Warm Dusk Dinner',
              },
              {
                img: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500&q=80',
                badge: 'Weekend',
                occ: 'Relaxed',
                name: 'Soft Sunday Layers',
              },
              {
                img: 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=500&q=80',
                badge: 'Office Ready',
                occ: 'Work',
                name: 'Sharp & Relaxed',
              },
              {
                img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80',
                badge: 'Travel',
                occ: 'On the go',
                name: 'Elevated Comfort',
              },
            ].map((outfit, index) => (
              <div key={index} className="ss-card flex-none w-72 relative overflow-hidden border-2 border-espresso">
                <div
                  className="ss-card-img h-96 bg-cover bg-center"
                  style={{ backgroundImage: `url('${outfit.img}')` }}
                />
                <div className="ss-card-badge absolute top-3.5 left-3.5 bg-gold text-espresso font-mono text-xs font-bold tracking-widest uppercase px-2.5 py-1 border border-espresso">
                  {outfit.badge}
                </div>
                <div className="ss-card-info p-4 bg-sand">
                  <p className="font-mono text-xs tracking-widest text-muted uppercase mb-1">
                    {outfit.occ}
                  </p>
                  <p className="font-playfair text-lg font-medium text-espresso">
                    {outfit.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-10 py-24 bg-espresso relative overflow-hidden">
        <div className="absolute text-9xl opacity-5 top-0 right-0 font-playfair leading-none" style={{ fontSize: '320px', color: 'rgba(201,169,122,0.06)' }}>
          ✦
        </div>
        <p className="font-mono text-xs tracking-widest text-gold uppercase mb-4 flex items-center gap-3 before:content-[''] before:inline-block before:w-6 before:h-px before:bg-gold">
          What people say
        </p>
        <h2 className="font-playfair text-5xl font-bold leading-tight text-sand mb-12">
          Real people,<br />
          <em className="italic text-accent">real wardrobes.</em>
        </h2>
        <div className="grid grid-cols-3 gap-0.5">
          {[
            {
              stars: '★★★★★',
              quote: '"I used to spend 20 minutes every morning stressing about what to wear. Mura genuinely changed my mornings."',
              author: 'Adaeze O. — Lagos',
            },
            {
              stars: '★★★★★',
              quote: '"It found outfit combinations I never would have thought of myself. My friends keep asking if I hired a stylist."',
              author: 'Priya M. — London',
            },
            {
              stars: '★★★★★',
              quote: '"Turns out I had the perfect capsule wardrobe all along — I just couldn\'t see it. Mura showed me what I had."',
              author: 'Camille D. — Paris',
            },
          ].map((testi, index) => (
            <div key={index} className="testi-card p-9 transition-colors" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,169,122,0.15)' }}>
              <p className="text-gold text-base tracking-widest mb-4">
                {testi.stars}
              </p>
              <p className="font-playfair text-lg italic text-sand leading-7 mb-6">
                {testi.quote}
              </p>
              <p className="font-mono text-xs tracking-widest text-gold uppercase">
                {testi.author}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-10 py-32 grid grid-cols-2 gap-20 items-center border-t-2 border-espresso">
        <div className="relative h-96">
          <div
            className="absolute inset-0 bg-cover bg-center border-2 border-espresso"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&q=80")',
            }}
          />
          <div className="absolute -bottom-3.5 -right-3.5 bg-gold border-2 border-espresso px-5 py-5 z-10">
            <p className="font-mono text-xs font-bold uppercase text-espresso tracking-widest">Free to start</p>
            <span className="font-playfair text-2xl font-bold italic text-espresso block mt-0.5">Today.</span>
          </div>
        </div>
        <div>
          <p className="font-mono text-xs tracking-widest text-muted uppercase mb-4 flex items-center gap-3 before:content-[''] before:inline-block before:w-6 before:h-px before:bg-muted">
            Early access
          </p>
          <h2 className="font-playfair text-5xl font-bold leading-tight mb-6">
            Your best-dressed<em className="italic text-accent block">era starts now.</em>
          </h2>
          <p className="text-base text-muted leading-8 mb-10 font-light">
            Join thousands already styling smarter. Upload your wardrobe in minutes and let Mura do the rest. No subscription needed to get started.
          </p>
          <div className="flex border-2 border-espresso">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-5 py-3 font-sans text-sm border-none outline-none bg-sand text-espresso placeholder:text-muted"
            />
            <button className="font-mono text-xs font-bold text-sand bg-espresso px-6 py-3 uppercase tracking-widest transition-all hover:bg-gold hover:text-espresso hover:cursor-none">
              Join waitlist →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-espresso px-10 pt-12 pb-10 grid grid-cols-4 gap-10">
        <div>
          <div className="font-playfair text-3xl font-light text-sand mb-4">
            Mur<em className="italic text-gold">a</em>
          </div>
          <p className="text-sm text-sand/45 leading-7 font-light max-w-48">
            Your AI wardrobe stylist. Helping you dress with intention, every single day.
          </p>
        </div>
        <div>
          <p className="font-mono text-xs font-bold tracking-widest text-gold uppercase mb-5">Product</p>
          <div className="flex flex-col gap-2.5">
            <a href="#" className="text-sm text-sand/55 hover:text-sand transition-colors">
              How it works
            </a>
            <a href="#" className="text-sm text-sand/55 hover:text-sand transition-colors">
              Features
            </a>
            <a href="#" className="text-sm text-sand/55 hover:text-sand transition-colors">
              Pricing
            </a>
            <a href="#" className="text-sm text-sand/55 hover:text-sand transition-colors">
              Download app
            </a>
          </div>
        </div>
        <div>
          <p className="font-mono text-xs font-bold tracking-widest text-gold uppercase mb-5">Company</p>
          <div className="flex flex-col gap-2.5">
            <a href="#" className="text-sm text-sand/55 hover:text-sand transition-colors">
              About
            </a>
            <a href="#" className="text-sm text-sand/55 hover:text-sand transition-colors">
              Blog
            </a>
            <a href="#" className="text-sm text-sand/55 hover:text-sand transition-colors">
              Careers
            </a>
            <a href="#" className="text-sm text-sand/55 hover:text-sand transition-colors">
              Press
            </a>
          </div>
        </div>
        <div>
          <p className="font-mono text-xs font-bold tracking-widest text-gold uppercase mb-5">Legal</p>
          <div className="flex flex-col gap-2.5">
            <a href="#" className="text-sm text-sand/55 hover:text-sand transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-sand/55 hover:text-sand transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-sand/55 hover:text-sand transition-colors">
              Cookies
            </a>
          </div>
        </div>
        <div className="col-span-4 border-t border-sand/10 pt-6 mt-5 flex justify-between items-center">
          <p className="font-mono text-xs tracking-widest text-sand/30 uppercase">© 2026 Mura. All rights reserved.</p>
          <p className="font-mono text-xs tracking-widest text-sand/30 uppercase">Dress with intention. ✦</p>
        </div>
      </footer>
    </div>
  );
}
