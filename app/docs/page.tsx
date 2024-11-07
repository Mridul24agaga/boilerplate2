"use client"

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Search, Book, Twitter, Instagram, Linkedin, Code, ArrowRight } from "lucide-react";

const docsSections = [
  {
    title: "Getting Started",
    description: "Learn how to set up your account and create your first AI-generated content.",
    link: "/docs/getting-started",
    icon: Book,
  },
  {
    title: "Twitter Threads",
    description: "Discover how to create engaging Twitter threads using our AI technology.",
    link: "/docs/twitter-threads",
    icon: Twitter,
  },
  {
    title: "Instagram Captions",
    description: "Learn the best practices for generating Instagram captions that boost engagement.",
    link: "/docs/instagram-captions",
    icon: Instagram,
  },
  {
    title: "LinkedIn Posts",
    description: "Explore techniques for crafting professional LinkedIn content with AI assistance.",
    link: "/docs/linkedin-posts",
    icon: Linkedin,
  },
  {
    title: "API Reference",
    description: "Detailed documentation for integrating our AI content generation into your applications.",
    link: "/docs/api-reference",
    icon: Code,
  },
];

export default function DocsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSections = docsSections.filter((section) =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h1 
          className="text-4xl sm:text-5xl font-bold mb-8 text-center text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Documentation
        </motion.h1>
        <motion.div 
          className="max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" />
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredSections.map((section, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-lg border border-gray-800 bg-gray-900 flex flex-col hover:shadow-lg hover:shadow-[#333333]/20 transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <section.icon className="w-6 h-6 mr-2 text-[#333333]" />
                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
              </div>
              <p className="text-gray-400 mb-6 flex-grow">{section.description}</p>
              <Button
                asChild
                className="w-full bg-[#333333] text-white hover:bg-[#444444] transition-colors duration-300"
              >
                <Link href={section.link} className="flex items-center justify-center">
                  Read More
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
        {filteredSections.length === 0 && (
          <motion.p 
            className="text-center text-gray-400 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No results found. Please try a different search term.
          </motion.p>
        )}
      </main>
    </div>
  );
}