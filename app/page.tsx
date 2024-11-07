'use client'

import { motion } from "framer-motion"
import { Twitter, Instagram, Linkedin, Zap } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { HoverEffect } from "@/components/ui/card-hover-effect"
import  Pricing  from "@/components/ui/pricing"
import FAQAccordion from "@/components/ui/faq-accordion"
import Footer from "@/components/ui/footer"

const projects = [
  {
    title: "Smart Automation",
    description: "Automate your social media workflow with AI-powered scheduling and content generation.",
    link: "/features/automation",
  },
  {
    title: "Content Generation",
    description: "Create engaging posts that resonate with your audience across all platforms.",
    link: "/features/content-generation",
  },
  {
    title: "Growth Analytics",
    description: "Track your social media performance with detailed insights and metrics.",
    link: "/features/analytics",
  },
  {
    title: "Smart Scheduling",
    description: "Post at the perfect time with AI-optimized scheduling for maximum engagement.",
    link: "/features/scheduling",
  },
  {
    title: "Audience Insights",
    description: "Understand your followers better with detailed demographic analysis.",
    link: "/features/audience-insights",
  },
  {
    title: "Performance Tracking",
    description: "Monitor your growth and engagement with real-time analytics dashboard.",
    link: "/features/performance",
  },
]

export default function HeroSection() {
  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      <Navbar />
      {/* Animated background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Animated glowing orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

      <div className="relative px-4 py-16 mt-20 text-center z-10"> {/* Update: Added mt-20 */}
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold text-white mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Unleash Your Social Media Potential
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Harness the power of AI to dominate Twitter, Instagram, and LinkedIn with captivating content.
        </motion.p>

        <motion.div 
          className="flex justify-center space-x-4 mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Twitter className="w-12 h-12 text-blue-400" />
          <Instagram className="w-12 h-12 text-pink-500" />
          <Linkedin className="w-12 h-12 text-blue-600" />
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href="/get-started" className="group">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 flex items-center">
              <Zap className="w-6 h-6 mr-2 group-hover:animate-pulse" />
              Get Started Now
            </button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="w-full max-w-5xl mx-auto px-8 mt-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Features</h2>
        <HoverEffect items={projects} />
      </motion.div>

      {/* Add animation keyframes */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      <Pricing/>
      <FAQAccordion/>
      <Footer/>
    </div>
  )
}