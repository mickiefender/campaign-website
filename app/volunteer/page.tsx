'use client'

import { useState } from 'react'
import { Heart, MapPin, Clock, AlertCircle } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-6 text-balance">Join Our Volunteer Movement</h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl">
          Be part of the change. Whether you have a few hours a week or want to dedicate more time, there's a role for you in building Ghana's future.
        </p>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t border-border">
        <h2 className="text-2xl font-bold mb-8">Why Volunteer With Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <Heart className="text-accent mb-4" size={32} />
            <h3 className="font-bold mb-2">Make a Real Impact</h3>
            <p className="text-muted-foreground">Your efforts directly contribute to positive change in Ghana.</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <MapPin className="text-primary mb-4" size={32} />
            <h3 className="font-bold mb-2">Community Connection</h3>
            <p className="text-muted-foreground">Build networks and connect with like-minded Ghanaians.</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <Clock className="text-accent mb-4" size={32} />
            <h3 className="font-bold mb-2">Flexible Involvement</h3>
            <p className="text-muted-foreground">Volunteer at your own pace with opportunities suited to your schedule.</p>
          </div>
        </div>
      </section>

      {/* Volunteer Roles */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-border">
        <h2 className="text-2xl font-bold mb-8">Available Volunteer Roles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {VOLUNTEER_ROLES.map(role => (
            <div key={role.id} className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold mb-2">{role.name}</h3>
              <p className="text-muted-foreground text-sm">{role.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Registration Form */}
      <section className="max-w-4xl mx-auto px-4 py-16 border-t border-border">
        <h2 className="text-3xl font-bold mb-8">Volunteer Registration Form</h2>

        {submitted && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-bold text-green-900 mb-2">Thank You for Registering!</h3>
            <p className="text-green-800">
              We've received your application and will contact you soon with next steps.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div>
            <h3 className="text-xl font-bold mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2">Full Name*</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Your full name"
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
                <label className="block font-semibold mb-2">Phone Number*</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="+233 XXX XXX XXXX"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Region*</label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
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
            <h3 className="text-xl font-bold mb-6">Select Your Volunteer Roles*</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {VOLUNTEER_ROLES.map(role => (
                <label key={role.id} className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-card/50 transition">
                  <input
                    type="checkbox"
                    checked={formData.roles.includes(role.id)}
                    onChange={() => handleRoleChange(role.id)}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">{role.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block font-semibold mb-2">What skills do you have?</label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g., public speaking, event planning, social media, graphic design..."
              rows={3}
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block font-semibold mb-2">Availability*</label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
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
            <label className="block font-semibold mb-2">Commitment Level*</label>
            <select
              name="commitment"
              value={formData.commitment}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Select commitment level</option>
              <option value="occasional">Occasional (few hours/month)</option>
              <option value="regular">Regular (4-8 hours/week)</option>
              <option value="dedicated">Dedicated (8+ hours/week)</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block font-semibold mb-2">Additional Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Tell us why you want to volunteer..."
              rows={4}
            />
          </div>

          {/* Disclaimer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex gap-4">
            <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
            <div className="text-blue-900">
              <p className="font-semibold mb-2">Commitment to Excellence</p>
              <p className="text-sm">All volunteers are expected to uphold the values of the NPP and treat all community members with respect.</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-bold text-lg transition disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : 'Join as a Volunteer'}
          </button>
        </form>
      </section>
    </div>
  )
}
