"use client";

import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Logo from "@/components/shared/Logo";
// --- FIX: Replaced lucide-react with react-icons/fa ---
import {
  FaGithub,
  FaTwitter,
  FaEnvelope,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// --- NEW: Custom SVG icon for TikTok ---
const TikTokIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.01-1.58-.01-3.18-.01-4.75-.25 0-.51 0-.78 0-1.02.01-2.04.01-3.06 0-1.24.01-2.48.01-3.72.01v4.61c.88.02 1.76.02 2.64.02 1.45.01 2.89.01 4.34.01v4.03c-1.11.29-2.29.42-3.4.52-1.69.16-3.4.09-5.09-.38-1.69-.46-3.23-1.19-4.57-2.22-1.34-1.02-2.33-2.31-2.94-3.85-.61-1.54-.85-3.2-.85-4.85.01-1.64.24-3.28.84-4.85.6-1.57 1.6-2.85 2.94-3.85 1.34-1 2.88-1.73 4.57-2.22 1.69-.49 3.4-.56 5.09-.38 1.11.11 2.29.24 3.4.52v4.03c-1.54-.17-3.12-.68-4.24-1.79-1.12-1.08-1.67-2.64-1.75-4.17Z" />
  </svg>
);

// --- UPDATED: Navigation links ---
const links = {
  explore: [
    { href: "/guides", label: "Guides" },
    { href: "/showcases", label: "Showcases" },
    { href: "/resources", label: "Resources" },
  ],
  community: [{ href: "/create", label: "Create Something" }],
  legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-of-service", label: "Terms of Service" },
  ],
};

// --- UPDATED: Social media links with react-icons ---
const socialLinks = [
  {
    href: "https://x.com/biooids",
    icon: FaXTwitter,
    label: "X (Twitter)",
  },
  {
    href: "https://github.com/biooids",
    icon: FaGithub,
    label: "GitHub",
  },
  {
    href: "https://www.tiktok.com/@navi_biooid",
    icon: FaTiktok,
    label: "TikTok",
  },
  {
    href: "mailto:intellbiooid@gmail.com",
    icon: FaEnvelope,
    label: "Email",
  },
  {
    href: "https://wa.me/250790931024",
    icon: FaWhatsapp,
    label: "WhatsApp",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/80 backdrop-blur-lg w-full">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Logo & tagline */}
          <div>
            <div className="flex items-center">
              <Logo />
            </div>
            <p className="mt-4 max-w-sm text-muted-foreground">
              <strong>WanderGuilds</strong> is your creative dev sanctuary —
              where ideas roam wild and builders unite.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-2">
            <div>
              <p className="font-semibold text-foreground">Explore</p>
              <ul className="mt-4 space-y-2">
                {links.explore.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground transition hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground">Community</p>
              <ul className="mt-4 space-y-2">
                {links.community.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground transition hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground">Legal</p>
              <ul className="mt-4 space-y-2">
                {links.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground transition hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 border-t pt-6 sm:flex sm:items-center sm:justify-between">
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank" // Open social links in a new tab
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <span className="sr-only">{social.label}</span>
                <social.icon />
              </Link>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground sm:mt-0">
            &copy; {currentYear} WanderGuilds. Crafted by developers, for
            developers.
          </p>
        </div>
      </div>
    </footer>
  );
}
