"use client"

import { motion } from "framer-motion"
import { FaCheck, FaTimes } from "react-icons/fa"

const plans = [
  {
    name: "Basic",
    forWho: "For individuals",
    price: 39,
    description: "Perfect for smaller projects",
    popular: false,
    features: [
      { included: true, text: "250 lead credits / mo" },
      { included: true, text: "Supports Twitter/X" },
      { included: true, text: "Realtime Notifications" },
      { included: true, text: "AI Replies" },
      { included: true, text: "Basic Analytics" },
      { included: false, text: "Supports Reddit" },
      { included: false, text: "Supports LinkedIn" },
      { included: false, text: "Automated follow-up" },
    ],
  },
  {
    name: "Launch",
    forWho: "For startups/agencies",
    price: 79,
    description: "Perfect for growth-stage companies",
    popular: true,
    features: [
      { included: true, text: "1000 lead credits / mo" },
      { included: true, text: "Supports Twitter/X" },
      { included: true, text: "Realtime Notifications" },
      { included: true, text: "AI Replies" },
      { included: true, text: "Basic Analytics" },
      { included: true, text: "Supports Reddit" },
      { included: false, text: "Supports LinkedIn" },
      { included: false, text: "Automated follow-up" },
    ],
  },
  {
    name: "Scale",
    forWho: "For enterprises",
    price: 299,
    description: "For larger scale companies",
    popular: false,
    features: [
      { included: true, text: "5000 lead credits / mo" },
      { included: true, text: "Supports Twitter/X" },
      { included: true, text: "Realtime Notifications" },
      { included: true, text: "AI Replies" },
      { included: true, text: "Advanced Analytics" },
      { included: true, text: "Supports Reddit" },
      { included: true, text: "Supports LinkedIn" },
      { included: true, text: "Automated follow-up" },
    ],
  },
]

export default function PricingComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white py-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Simple, scalable pricing</h2>
        <p className="text-xl text-gray-400">
          All plans are currently 30% off for the first 50 customers (20 left)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            className={`bg-black text-white rounded-2xl shadow-lg p-8 relative border border-gray-800 ${
              plan.popular ? "border-2 border-[#333333]" : ""
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            {plan.popular && (
              <div className="absolute top-4 right-4 bg-[#333333] text-white text-sm px-3 py-1 rounded-full">
                Popular
              </div>
            )}
            <h3 className="text-sm font-medium text-gray-300 mb-2">{plan.forWho}</h3>
            <p className="text-3xl font-bold mb-2">{plan.name}</p>
            <p className="text-4xl font-bold mb-4">${plan.price} <span className="text-xl text-gray-400">/ mo</span></p>
            <p className="text-gray-400 mb-6">{plan.description}</p>
            <ul className="mb-8 space-y-3">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center">
                  <span className={`mr-2 ${feature.included ? "text-green-400" : "text-red-400"}`}>
                    {feature.included ? (
                      <FaCheck aria-hidden="true" />
                    ) : (
                      <FaTimes aria-hidden="true" />
                    )}
                  </span>
                  <span className="sr-only">{feature.included ? "Included" : "Not included"}</span>
                  {feature.text}
                </li>
              ))}
            </ul>
            <motion.button
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                plan.popular
                  ? "bg-[#333333] text-white hover:bg-[#444444]"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}