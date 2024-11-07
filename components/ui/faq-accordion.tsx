"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "What do I get with our Social Media AI platform?",
    answer: "Our Social Media AI platform provides you with a comprehensive set of tools and features to enhance your social media presence and engagement."
  },
  {
    question: "What makes our Social Media AI unique?",
    answer: "Our unique approach combines cutting-edge AI technology with intuitive design, making social media management faster and more efficient."
  },
  {
    question: "What is the main goal of our Social Media AI?",
    answer: "Our main goal is to simplify complex social media processes while maintaining flexibility and power for advanced users and marketers."
  },
  {
    question: "How often is our Social Media AI platform updated?",
    answer: "We release updates regularly, typically every two weeks, with major feature releases every quarter to keep up with the latest social media trends."
  },
  {
    question: "What features does our Social Media AI platform have?",
    answer: "Our platform includes AI-powered content generation, automated posting schedules, advanced analytics, multi-platform management, and comprehensive reporting tools."
  },
  {
    question: "Is our Social Media AI platform easy to use?",
    answer: "Yes! We've designed our platform to be intuitive for beginners while providing advanced features for experienced social media managers."
  },
  {
    question: "What technology does our Social Media AI use?",
    answer: "We use the latest AI and machine learning technologies, along with robust cloud infrastructure, to ensure optimal performance and reliability."
  },
  {
    question: "Can I get a refund if I'm not happy with the Social Media AI platform?",
    answer: "Yes, we offer a 30-day money-back guarantee with no questions asked to ensure your satisfaction."
  },
  {
    question: "What support do you offer?",
    answer: "We provide 24/7 email support, comprehensive documentation, video tutorials, and an active community forum for all our users."
  }
]

export default function FAQAccordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-16 bg-black text-white">
      <div className="flex flex-col items-center mb-12">
        <div className="bg-white text-black px-4 py-1 text-sm font-medium rounded">
          FAQ
        </div>
        <h2 className="text-3xl font-bold text-center mt-6 mb-4">
          Frequently asked questions
        </h2>
        <p className="text-gray-400 text-center max-w-2xl">
          Need help with something? Here are some of the most common questions we get about our Social Media AI platform.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-800">
            <button
              className="flex justify-between items-center w-full py-4 text-left hover:text-gray-300 transition-colors duration-300"
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              aria-expanded={activeIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="text-base font-medium">{faq.question}</span>
              <motion.span
                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-gray-400"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.span>
            </button>
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  id={`faq-answer-${index}`}
                  className="overflow-hidden"
                >
                  <p className="pb-4 text-gray-400">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 text-sm text-gray-400">
        Still have questions? Email us at{" "}
        <a 
          href="mailto:support@socialmediaai.com" 
          className="text-white hover:underline"
        >
          support@socialmediaai.com
        </a>
      </div>
    </div>
  )
}