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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
    <div className="min-h-screen bg-white">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-800 to-red-600 opacity-95" />

        <div className="relative max-w-7xl mx-auto px-4 py-24 text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Contact Our Campaign
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            Have questions, ideas, or want to support the movement? Reach out and
            our team will respond promptly.
          </p>
        </div>
      </section>

      {/* ================= CONTACT CARDS ================= */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Mail,
              title: 'Email',
              value: 'info@nppcampaign.gh',
              color: 'text-blue-700',
            },
            {
              icon: Phone,
              title: 'Phone',
              value: '+233 XXX XXX XXXX',
              color: 'text-red-600',
            },
            {
              icon: MapPin,
              title: 'Address',
              value: 'Accra, Greater Accra\nGhana',
              color: 'text-blue-700',
            },
            {
              icon: Clock,
              title: 'Working Hours',
              value: 'Mon–Fri: 9AM–5PM\nSat: 10AM–2PM',
              color: 'text-red-600',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition"
            >
              <item.icon className={`${item.color} mb-4`} size={32} />
              <h3 className="font-bold mb-2 text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= MAIN SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* ===== FORM ===== */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Send us a Message
            </h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-semibold">
                  Message sent successfully!
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name*"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
              />

              <Input
                label="Email*"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
              />

              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+233 XXX XXX XXXX"
              />

              <div>
                <label className="block font-semibold mb-2 text-gray-800">
                  Subject*
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
                <label className="block font-semibold mb-2 text-gray-800">
                  Message*
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* ===== QUICK LINKS ===== */}
          <div className="space-y-5">
            <QuickCard
              title="Volunteer with Us"
              text="Join our nationwide volunteer network and help drive change."
              link="/volunteer"
            />
            <QuickCard
              title="Support Our Campaign"
              text="Your contribution helps us reach more communities."
              link="/donate"
            />
            <QuickCard
              title="Latest News"
              text="Stay informed with our most recent updates."
              link="/news"
            />
            <QuickCard
              title="Our Vision"
              text="Discover our long-term plans for Ghana."
              link="/vision"
            />
          </div>
        </div>
      </section>

      {/* ================= MAP ================= */}
      <section className="w-full h-96 bg-gray-100 flex items-center justify-center border-t">
        <div className="text-center">
          <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Map will be embedded here</p>
        </div>
      </section>
    </div>
  )
}

/* ================= SMALL COMPONENTS ================= */

function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="block font-semibold mb-2 text-gray-800">
        {label}
      </label>
      <input
        {...props}
        required={props.required}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
      />
    </div>
  )
}

function QuickCard({ title, text, link }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
      <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-3">{text}</p>
      <a href={link} className="text-blue-700 font-semibold hover:underline">
        Learn more →
      </a>
    </div>
  )
}