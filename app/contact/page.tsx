'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-6 text-balance">Get In Touch</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Have questions? Want to volunteer? Send us a message and we'll get back to you as soon as possible.
        </p>
      </section>

      {/* Contact Information */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <Mail className="text-accent mb-4" size={32} />
            <h3 className="font-bold mb-2">Email</h3>
            <p className="text-muted-foreground text-sm">info@nppcampaign.gh</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <Phone className="text-primary mb-4" size={32} />
            <h3 className="font-bold mb-2">Phone</h3>
            <p className="text-muted-foreground text-sm">+233 XXX XXX XXXX</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <MapPin className="text-accent mb-4" size={32} />
            <h3 className="font-bold mb-2">Address</h3>
            <p className="text-muted-foreground text-sm">Accra, Greater Accra<br />Ghana</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <Clock className="text-primary mb-4" size={32} />
            <h3 className="font-bold mb-2">Hours</h3>
            <p className="text-muted-foreground text-sm">Mon-Fri: 9AM-5PM<br />Sat: 10AM-2PM</p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 border-t border-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Send us a Message</h2>

            {submitted && (
              <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-bold text-green-900 mb-2">Message Sent Successfully!</h3>
                <p className="text-green-800 text-sm">
                  Thank you for contacting us. We'll respond to your message shortly.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-semibold mb-2">Full Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="+233 XXX XXX XXXX"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Subject*</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">Select a subject</option>
                  <option value="volunteer">Volunteer Inquiry</option>
                  <option value="donation">Donation Question</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">Message*</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Your message..."
                  rows={6}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-bold transition disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Quick Resources</h2>
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-bold mb-2">Volunteer with Us</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Interested in volunteering? Visit our volunteer page to learn about available roles.
                </p>
                <a href="/volunteer" className="text-accent font-semibold">
                  Become a Volunteer →
                </a>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-bold mb-2">Support Our Campaign</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Every contribution helps us reach more communities and bring change.
                </p>
                <a href="/donate" className="text-accent font-semibold">
                  Make a Donation →
                </a>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-bold mb-2">Latest News</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Stay updated with the latest campaign news and developments.
                </p>
                <a href="/news" className="text-accent font-semibold">
                  Read Latest News →
                </a>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-bold mb-2">Our Vision</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Learn more about our vision for Ghana and our commitments.
                </p>
                <a href="/vision" className="text-accent font-semibold">
                  Explore Our Vision →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full h-96 border-t border-border mt-16">
        <div className="w-full h-full bg-card flex items-center justify-center">
          <div className="text-center">
            <MapPin size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Map would be embedded here</p>
          </div>
        </div>
      </section>
    </div>
  )
}
