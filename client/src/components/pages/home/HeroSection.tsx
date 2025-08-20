"use client";

import React from "react";
import Link from "next/link";
import { Users, Cpu, Globe, Boxes } from "lucide-react";

import HeroAnimation from "./HeroAnimation";
import Background from "./Background";
import TerminalMockUp from "./TerminalMockUp";
import HeroHighlights from "./HeroHighlights";
import FeaturedPosts from "./FeaturedPosts";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="w-full ">
      <div className="relative overflow-hidden">
        <HeroAnimation />
        <Background />

        {/* MAIN HERO */}
        <div className="bg-whie relative z-10 flex flex-col md:flex-row  justify-between gap-12  px-6 md:px-12 py-10 max-w-7xl mx-auto">
          {/* LEFT: Headline + Description + Actions */}
          <div className="w-full md:w-1/2 space-y-8 ">
            {/* Social Proof */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-primary" />
              <span>
                <strong className="text-foreground">10,000+</strong> makers
                joined
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Build. Share. Inspire.
            </h1>

            {/* Subtext */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl">
              Document your DIY projects, publish tutorials, and connect with a
              global community of makers.
            </p>

            {/* Quick Features */}
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground">
                <Cpu className="h-4 w-4 text-primary" />
                No-code + Hardware Friendly
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground">
                <Globe className="h-4 w-4 text-primary" />
                Community Powered
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground">
                <Boxes className="h-4 w-4 text-primary" />
                100+ DIY Projects
              </span>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button asChild size="lg">
                <Link href="/create">Share Your Project</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/all">Explore Projects</Link>
              </Button>
            </div>
          </div>

          {/* RIGHT: Mockup */}
          <div className="w-full md:w-1/2 max-w-full lg:max-w-xl xl:max-w-2xl hidden md:block ">
            <TerminalMockUp />
          </div>
        </div>
      </div>

      {/* CARDS & POSTS */}
      <div className="container px-4 md:px-6 py-16 md:py-24 space-y-20 md:space-y-24">
        <HeroHighlights />
        <FeaturedPosts />
      </div>
    </section>
  );
}
