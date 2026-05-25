"use client"

import Link from "next/link"
import Image from "next/image"
import { Zap, ShieldCheck, Sparkles, Film, Coins } from "lucide-react"

export default function MobileAppPromo() {
  return (
    <section className="py-20 bg-zinc-950 border-b border-zinc-800 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-zinc-900/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border border-red-950 bg-red-950/20 text-red-500 rounded-full">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span className="font-mono text-xs tracking-wider uppercase">Now on Google Play</span>
            </div>
            
            <h2 className="font-heading text-4xl sm:text-5xl text-white mb-6 tracking-wide leading-tight uppercase">
              Download the <span className="text-red-500">D&apos;Rentals</span> Companion App
            </h2>
            
            <p className="text-zinc-400 font-body text-sm sm:text-base mb-8 max-w-xl leading-relaxed">
              Rent premium cameras, lenses, and film equipment instantly in Hyderabad. Built by Penmen Studios to help independent filmmakers and content creators bring their creative vision to life.
            </p>

            {/* Why Choose D'RENTALS? Section */}
            <h3 className="font-heading text-white text-base tracking-wider uppercase mb-6 border-b border-zinc-800 pb-2 w-full max-w-lg">
              Why Choose D&apos;RENTALS?
            </h3>

            {/* App Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg mb-10">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500">
                  <Film className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-heading text-white text-sm uppercase tracking-wider mb-1">Extensive Catalog</h4>
                  <p className="text-zinc-500 text-xs font-body">Browse a wide range of professional cinema cameras, DSLR/mirrorless bodies, premium lenses, lighting, audio gear, and accessories.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-heading text-white text-sm uppercase tracking-wider mb-1">Hassle-Free Booking</h4>
                  <p className="text-zinc-500 text-xs font-body">Add items to your cart, select your dates, and send your booking request directly to our team via WhatsApp in just one tap.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-heading text-white text-sm uppercase tracking-wider mb-1">Verified Quality</h4>
                  <p className="text-zinc-500 text-xs font-body">All our gear is rigorously tested, cleaned, and maintained by professionals to ensure top-notch performance on your set.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-heading text-white text-sm uppercase tracking-wider mb-1">Transparent Pricing</h4>
                  <p className="text-zinc-500 text-xs font-body">No hidden fees. See exactly what your daily rental will cost upfront with clear and honest rates.</p>
                </div>
              </div>
            </div>

            {/* Google Play Store Badge Button */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://play.google.com/store/apps/details?id=com.drentals.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-transform hover:scale-105 active:scale-95 duration-200"
              >
                <Image
                  src="/google-play-badge.png"
                  alt="Get it on Google Play"
                  width={284}
                  height={84}
                  className="h-[84px] w-auto object-contain"
                />
              </a>
            </div>
          </div>

          {/* Right Mobile Mockup Column */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Outer Glow behind phone */}
              {/* Outer Glow behind phone */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-red-600 to-zinc-800 rounded-[44px] blur-lg opacity-30 group-hover:opacity-45 transition duration-500" />
              
              {/* Phone Frame */}
              <div className="relative w-[320px] h-[640px] sm:w-[360px] sm:h-[720px] rounded-[42px] bg-zinc-950 border-[8px] border-zinc-900 shadow-2xl flex flex-col overflow-hidden select-none">
                {/* Speaker notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-zinc-900 rounded-full z-30 flex items-center justify-center">
                  <div className="w-12 h-1 bg-zinc-800 rounded-full" />
                </div>
                
                {/* Camera dot */}
                <div className="absolute top-2.5 right-[30%] w-2 h-2 bg-zinc-950 rounded-full border border-zinc-900 z-30" />

                {/* Simulated Screen */}
                <div className="flex-1 flex flex-col bg-zinc-950 text-white font-body p-5 pt-9">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center text-xs text-zinc-500 font-mono mb-5 px-1">
                    <span>13:58</span>
                    <div className="flex items-center gap-1.5">
                      <span>5G</span>
                      <div className="w-4 h-2.5 border border-zinc-655 rounded-sm p-[1px] flex items-center">
                        <div className="w-full h-full bg-zinc-400 rounded-2xs" />
                      </div>
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="flex justify-between items-center mb-7">
                    <div className="flex flex-col">
                      <span className="font-heading text-base tracking-wider uppercase text-white">D&apos;Rentals</span>
                      <span className="text-[9px] text-zinc-500 font-mono tracking-tight uppercase">by Penmen Studios</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-400">
                      👤
                    </div>
                  </div>

                  {/* Promo Banner inside app */}
                  <div className="bg-gradient-to-r from-red-950/40 to-zinc-900 border border-red-900/30 p-3.5 rounded-lg mb-5">
                    <span className="text-[9px] font-mono text-red-500 uppercase tracking-widest">HydCineRentals</span>
                    <h5 className="font-heading text-sm text-white uppercase mt-1">Premium RED V-Raptor</h5>
                    <p className="text-xs text-zinc-400 mt-1 font-body">Available for immediate hire today.</p>
                  </div>

                  {/* Category grid title */}
                  <h6 className="font-heading text-xs text-zinc-400 tracking-wider uppercase mb-2.5">Browse Categories</h6>
                  
                  {/* Category grid items */}
                  <div className="grid grid-cols-2 gap-2.5 mb-5">
                    <div className="bg-zinc-900 border border-zinc-800 p-2.5 text-center rounded-lg">
                      <span className="text-xl block mb-1">🎥</span>
                      <span className="text-[10px] font-heading uppercase text-zinc-300">Cameras</span>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-2.5 text-center rounded-lg">
                      <span className="text-xl block mb-1">🔍</span>
                      <span className="text-[10px] font-heading uppercase text-zinc-300">Lenses</span>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-2.5 text-center rounded-lg">
                      <span className="text-xl block mb-1">💡</span>
                      <span className="text-[10px] font-heading uppercase text-zinc-300">Lighting</span>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-2.5 text-center rounded-lg">
                      <span className="text-xl block mb-1">🎙️</span>
                      <span className="text-[10px] font-heading uppercase text-zinc-300">Audio</span>
                    </div>
                  </div>

                  {/* Featured gear */}
                  <h6 className="font-heading text-xs text-zinc-400 tracking-wider uppercase mb-2.5">Popular Items</h6>
                  <div className="flex gap-2.5 overflow-x-auto pb-2 shrink-0 scrollbar-none">
                    <div className="w-[130px] bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg flex-shrink-0">
                      <div className="w-full h-14 bg-zinc-950 rounded mb-1.5 flex items-center justify-center text-xs text-zinc-650">Sony FX3</div>
                      <span className="text-[10px] font-heading uppercase text-white block truncate">Sony FX3 Cinema</span>
                      <span className="text-[9px] font-mono text-red-500 block">₹3,500/day</span>
                    </div>
                    <div className="w-[130px] bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg flex-shrink-0">
                      <div className="w-full h-14 bg-zinc-950 rounded mb-1.5 flex items-center justify-center text-xs text-zinc-655">ARRI Alexa</div>
                      <span className="text-[10px] font-heading uppercase text-white block truncate">ARRI Alexa Mini</span>
                      <span className="text-[9px] font-mono text-red-500 block">₹12,000/day</span>
                    </div>
                  </div>

                  {/* Bottom Navigation Bar */}
                  <div className="mt-auto border-t border-zinc-900 pt-2.5 flex justify-around text-zinc-500 text-[10px] font-heading uppercase tracking-wider">
                    <div className="flex flex-col items-center text-white">
                      <span>🏠</span>
                      <span className="mt-0.5">Home</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>🎥</span>
                      <span className="mt-0.5">Catalog</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>📦</span>
                      <span className="mt-0.5">Orders</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>⚙️</span>
                      <span className="mt-0.5">Settings</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
