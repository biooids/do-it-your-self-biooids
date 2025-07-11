// =================================================================
// FILE: src/components/landing/HeroHighlights.tsx
// =================================================================
"use client";

import {
  Trophy,
  BookOpen,
  Globe,
  Lightbulb,
  Share2,
  Search,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    icon: Lightbulb,
    title: "1. Create",
    description: "Document your project with our powerful, easy-to-use editor.",
  },
  {
    icon: Share2,
    title: "2. Share",
    description:
      "Publish your work and share it with a growing community of makers.",
  },
  {
    icon: Search,
    title: "3. Discover",
    description:
      "Explore thousands of projects and find inspiration for your next build.",
  },
];

const features = [
  {
    icon: Trophy,
    title: "Share Projects",
    description:
      "Showcase your finished work, from simple crafts to complex electronics, and get feedback from the community.",
  },
  {
    icon: BookOpen,
    title: "Show DIY Guides",
    description:
      "Create detailed, step-by-step tutorials to help others learn new skills and replicate your amazing projects.",
  },
  {
    icon: Globe,
    title: "Discover Resources",
    description:
      "Find and share useful tools, links, and materials that can help everyone in their creative endeavors.",
  },
];

export default function HeroHighlights() {
  return (
    <section className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          Get Started in Minutes
        </h2>
        <p className="mx-auto max-w-2xl mt-4 text-muted-foreground text-lg md:text-xl">
          From a spark of an idea to a finished project, we've got you covered.
        </p>
      </div>

      {/* Step-by-step process */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center gap-4"
          >
            <div className="bg-primary/10 p-4 rounded-full">
              <step.icon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div className="grid gap-8 md:grid-cols-3">
        {features.map((feature, index) => (
          <Card
            key={feature.title}
            className="bg-card/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all hover:shadow-xl animate-fade-in-up"
            style={{ animationDelay: `${800 + index * 150}ms` }}
          >
            <CardHeader className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg font-semibold">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
