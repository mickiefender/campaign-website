import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                NPP
              </div>
              <h3 className="font-bold text-lg">NPP Campaign</h3>
            </div>
            <p className="text-sm opacity-80">Building Ghana together. Join us on the journey to a prosperous nation.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-accent transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-accent transition">About</Link></li>
              <li><Link href="/vision" className="hover:text-accent transition">Vision</Link></li>
              <li><Link href="/news" className="hover:text-accent transition">News</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Get Involved</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/volunteer" className="hover:text-accent transition">Volunteer</Link></li>
              <li><Link href="/donate" className="hover:text-accent transition">Donate</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition">Contact Us</Link></li>
              <li><Link href="/policies" className="hover:text-accent transition">Policies</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} /> +233 XXX XXX XXXX
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} /> info@nppcampaign.gh
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} /> Accra, Ghana
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="py-8 border-t border-secondary-foreground/20 flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm opacity-80">&copy; 2024 NPP Campaign. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-accent transition" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-accent transition" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-accent transition" aria-label="Instagram">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
