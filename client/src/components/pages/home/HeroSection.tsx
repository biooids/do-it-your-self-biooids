"use client";

import React from "react";
import Link from "next/link";
import HeroAnimation from "./HeroAnimation";
import FeaturedPosts from "./FeaturedPosts";
import Background from "./Background";
import TerminalMockUp from "./TerminalMockUp";
import HeroHighlights from "./HeroHighlights";

export default function HeroSection() {
  return (
    <section className="w-full">
      <div className="relative overflow-hidden">
        <HeroAnimation />
        <Background />

        {/* MAIN HERO */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 min-h-screen px-6 md:px-12 py-12 text-center md:text-left max-w-7xl mx-auto">
          {/* RIGHT: Headline + Description + Buttons */}
          <div className="w-full md:w-1/2 space-y-6 relative">
            {/* FLOATING DECORATIONS */}
            <div className="absolute -top-8 -left-6 hidden md:block animate-float-slow">
              <div className="bg-gradient-to-tr from-fuchsia-500 to-yellow-300 rounded-full w-6 h-6 blur-md opacity-70" />
            </div>
            <div className="absolute bottom-[-40px] right-0 hidden md:block animate-float-fast">
              <div className="bg-gradient-to-r from-cyan-400 to-sky-600 w-10 h-10 rounded-lg blur-lg opacity-60" />
            </div>
            <div className="absolute -top-16 right-10 hidden md:block animate-pulse">
              <span className="text-xs px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white backdrop-blur-sm shadow">
                🚀 10,000+ Makers joined
              </span>
            </div>

            {/* GRADIENT HEADING */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent leading-tight drop-shadow-md">
              Build. Share. Inspire.
            </h1>

            {/* SUBTEXT */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0">
              Dive into the world of DIY tech. Create your own robots, share
              tutorials, and get inspired by fellow makers across the globe.
            </p>

            {/* BADGE STRIP / MINI UI */}
            <div className="flex flex-wrap items-center gap-3 pt-4 text-sm text-white/80">
              <span className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full shadow-sm backdrop-blur-md">
                🛠️ No-code + Hardware Friendly
              </span>
              <span className="px-3 py-1 bg-pink-600/20 border border-pink-500/30 rounded-full shadow-sm backdrop-blur-md">
                🌐 Community Powered
              </span>
              <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-400/30 rounded-full shadow-sm backdrop-blur-md">
                📦 100+ DIY Projects
              </span>
            </div>

            {/* CTA BUTTONS */}
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-4">
              <Link href="/create">
                <button className="px-6 py-3 rounded-xl text-white bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 shadow-lg hover:brightness-110 transition">
                  Share Your Project
                </button>
              </Link>
              <Link href="/all">
                <button className="px-6 py-3 rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20 transition">
                  Explore Projects
                </button>
              </Link>
            </div>
          </div>
          {/* LEFT: Code Editor Mockup */}
          <div className="w-full md:w-1/2 max-w-full lg:max-w-xl xl:max-w-2xl">
            <TerminalMockUp />
          </div>
        </div>
      </div>

      {/* CARDS & POSTS */}
      <div className="container px-4 md:px-6 py-12 md:py-20 lg:py-24 space-y-16 md:space-y-24">
        <HeroHighlights />
        <FeaturedPosts />
      </div>
    </section>
  );
}
