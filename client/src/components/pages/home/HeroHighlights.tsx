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
    title: "Create",
    description: "Document your project with our simple, powerful editor.",
  },
  {
    icon: Share2,
    title: "Share",
    description: "Publish your work and inspire the community of makers.",
  },
  {
    icon: Search,
    title: "Discover",
    description: "Explore thousands of projects to spark your next idea.",
  },
];

const features = [
  {
    icon: Trophy,
    title: "Show Projects",
    description: "Highlight your creations and get feedback from makers.",
  },
  {
    icon: BookOpen,
    title: "DIY Guides",
    description: "Publish tutorials so others can follow step by step.",
  },
  {
    icon: Globe,
    title: "Resources",
    description: "Find tools, parts, and materials to fuel creativity.",
  },
];

export default function HeroHighlights() {
  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Turn Ideas Into Reality
          </h2>
          <p className="mx-auto max-w-2xl mt-4 text-muted-foreground text-lg md:text-xl">
            Share your DIY journey with makers worldwide — from concept to
            creation.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center gap-4 animate-fade-in-up"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="bg-primary/10 p-4 rounded-full">
                <step.icon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, i) => (
            <Card
              key={feature.title}
              className="bg-card/50 backdrop-blur-sm border border-border hover:border-primary/40 transition-all hover:shadow-xl animate-fade-in-up"
              style={{ animationDelay: `${400 + i * 200}ms` }}
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
      </div>
    </section>
  );
}
