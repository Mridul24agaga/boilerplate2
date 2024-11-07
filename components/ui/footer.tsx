import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social Media AI</h3>
            <p className="text-sm text-gray-400">Empowering your social presence with AI-driven insights and automation.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-sm hover:text-gray-300 transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-sm hover:text-gray-300 transition-colors">Pricing</Link></li>
              <li><Link href="/about" className="text-sm hover:text-gray-300 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-gray-300 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-sm hover:text-gray-300 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm hover:text-gray-300 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="text-sm hover:text-gray-300 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Social Media AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}