'use client'

import { useState } from 'react'
import { Heart, MapPin, Clock, AlertCircle, Users, Zap } from 'lucide-react'
import Image from 'next/image'

const VOLUNTEER_ROLES = [
  { id: 'campaign', name: 'Campaign Ambassador', description: 'Represent NPP in your community' },
  { id: 'events', name: 'Event Coordinator', description: 'Help organize campaign events' },
  { id: 'canvassing', name: 'Door-to-Door Canvasser', description: 'Engage directly with voters' },
  { id: 'social', name: 'Social Media Manager', description: 'Help with digital outreach' },
  { id: 'finance', name: 'Fundraising Coordinator', description: 'Support fundraising efforts' },
  { id: 'admin', name: 'Administrative Support', description: 'Help with office operations' },
]

const REGIONS = [
  'Greater Accra', 'Ashanti', 'Central', 'Western', 'Eastern',
  'Volta', 'Northern', 'Upper East', 'Upper West', 'Savannah',
  'North East', 'Bono East', 'Bono', 'Ahafo', 'Oti', 'Western North'
]

export default function Volunteer() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    region: '',
    roles: [] as string[],
    skills: '',
    availability: '',
    commitment: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter(r => r !== roleId)
        : [...prev.roles, roleId]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          region: '',
          roles: [],
          skills: '',
          availability: '',
          commitment: '',
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
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>

      {/* Hero Section with Image */}
      <section className="relative w-full h-screen max-h-96 md:max-h-[500px] overflow-hidden rounded-b-3xl shadow-2xl">
        <Image
          src="/image/main-flyer.JPG"
          alt="Join our volunteer movement"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 to-blue-600/80 mix-blend-multiply"></div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center text-white max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Join Our Volunteer Movement</h1>
            <p className="text-xl md:text-2xl mb-8 text-red-50">
              Be part of the change. Your efforts directly contribute to building Ghana's future.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold mb-16 text-center text-gray-900">Why Volunteer With Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-8 hover:shadow-lg transition transform hover:-translate-y-2">
            <div className="bg-red-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
              <Heart className="text-red-600" size={32} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">Make a Real Impact</h3>
            <p className="text-gray-700">Your efforts directly contribute to positive change in Ghana.</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-8 hover:shadow-lg transition transform hover:-translate-y-2">
            <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
              <Users className="text-blue-600" size={32} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">Community Connection</h3>
            <p className="text-gray-700">Build networks and connect with like-minded Ghanaians.</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-8 hover:shadow-lg transition transform hover:-translate-y-2">
            <div className="bg-red-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
              <Clock className="text-red-600" size={32} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">Flexible Involvement</h3>
            <p className="text-gray-700">Volunteer at your own pace with opportunities suited to your schedule.</p>
          </div>
        </div>
      </section>

      {/* Volunteer Roles */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-t border-gray-200">
        <h2 className="text-4xl font-bold mb-16 text-center text-gray-900">Available Volunteer Roles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {VOLUNTEER_ROLES.map((role, i) => {
            const isRed = i % 2 === 0;
            return (
              <div key={role.id} className={`bg-white border-l-4 rounded-xl p-8 hover:shadow-lg transition ${isRed ? 'border-l-red-600' : 'border-l-blue-600'}`}>
                <h3 className="font-bold text-lg mb-3 text-gray-900">{role.name}</h3>
                <p className="text-gray-600">{role.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Registration Form */}
      <section className="max-w-4xl mx-auto px-4 py-20 border-t border-gray-200">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Volunteer Registration Form</h2>

        {submitted && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl">
            <h3 className="font-bold text-red-900 mb-2">Thank You for Registering!</h3>
            <p className="text-red-800">
              We've received your application and will contact you soon with next steps.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2 text-gray-900">Full Name*</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-900">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-900">Phone Number*</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+233 XXX XXX XXXX"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-900">Region*</label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a region</option>
                  {REGIONS.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Volunteer Roles */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Select Your Volunteer Roles*</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {VOLUNTEER_ROLES.map((role, i) => (
                <label key={role.id} className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50/50 transition">
                  <input
                    type="checkbox"
                    checked={formData.roles.includes(role.id)}
                    onChange={() => handleRoleChange(role.id)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="font-semibold text-gray-900">{role.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block font-semibold mb-2 text-gray-900">What skills do you have?</label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., public speaking, event planning, social media, graphic design..."
              rows={3}
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block font-semibold mb-2 text-gray-900">Availability*</label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select your availability</option>
              <option value="weekends">Weekends only</option>
              <option value="evenings">Weekday evenings</option>
              <option value="fulltime">Full-time</option>
              <option value="flexible">Flexible/As needed</option>
            </select>
          </div>

          {/* Commitment */}
          <div>
            <label className="block font-semibold mb-2 text-gray-900">Commitment Level*</label>
            <select
              name="commitment"
              value={formData.commitment}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select commitment level</option>
              <option value="occasional">Occasional (few hours/month)</option>
              <option value="regular">Regular (4-8 hours/week)</option>
              <option value="dedicated">Dedicated (8+ hours/week)</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block font-semibold mb-2 text-gray-900">Additional Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us why you want to volunteer..."
              rows={4}
            />
          </div>

          {/* Disclaimer */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 flex gap-4">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div className="text-blue-900">
              <p className="font-semibold mb-2">Commitment to Excellence</p>
              <p className="text-sm">All volunteers are expected to uphold the values of the NPP and treat all community members with respect.</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition disabled:opacity-50 shadow-lg transform hover:scale-105"
          >
            {isLoading ? 'Submitting...' : 'Join as a Volunteer'}
          </button>
        </form>
      </section>
    </div>
  )
}
