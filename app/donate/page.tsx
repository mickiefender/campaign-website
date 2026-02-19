'use client'
export const dynamic = "force-dynamic"


import { useState } from 'react'
import { Heart, Shield, Zap, AlertCircle, Calendar, Clock, Repeat, CreditCard } from 'lucide-react'

type PaymentCategory = 'daily' | 'weekly' | 'monthly' | 'onetime'

const PAYMENT_CATEGORIES = [
  { id: 'daily' as PaymentCategory, label: 'Daily', icon: Clock },
  { id: 'weekly' as PaymentCategory, label: 'Weekly', icon: Calendar },
  { id: 'monthly' as PaymentCategory, label: 'Monthly', icon: Repeat },
  { id: 'onetime' as PaymentCategory, label: 'One Time', icon: CreditCard },
]

const CATEGORY_AMOUNTS: Record<PaymentCategory, number[]> = {
  daily: [1, 10, 20, 100],
  weekly: [500, 1000, 2000, 5000, 10000],
  monthly: [10000, 20000, 30000, 40000, 50000],
  onetime: [100, 250, 500, 1000, 5000, 10000],
}

export default function Donate() {
  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory>('daily')
  const [donationAmount, setDonationAmount] = useState(5)
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    isAnonymous: false,
    message: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const finalAmount = isCustom && customAmount ? parseInt(customAmount) : donationAmount
  const isCGHS = (finalAmount / 100).toFixed(2)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const response = await fetch('/api/hubtel/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone,
          isAnonymous: formData.isAnonymous,
          message: formData.message,
        }),
      })

      const data = await response.json()
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        console.error('Error initializing payment:', data.error)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCategoryChange = (category: PaymentCategory) => {
    setPaymentCategory(category)
    setDonationAmount(CATEGORY_AMOUNTS[category][0])
    setIsCustom(false)
    setCustomAmount('')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>

      {/* Hero Section */}
<section className="relative max-w-7xl mx-auto px-4 py-20 overflow-hidden rounded-2xl">

  {/* Background Image */}
  <div className="absolute inset-0">
    <img
      src="/image/main-flyer.JPG" // 🔥 replace with your image path
      alt="Campaign background"
      className="w-full h-full object-cover"
    />
    {/* Dark Overlay for readability */}
    <div className="absolute inset-0 bg-black/60"></div>
  </div>

  {/* Content */}
  <div className="relative text-center z-10">
    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white text-balance">
      Support Ghana's Future
    </h1>

    <p className="text-xl text-white/90 mb-4 max-w-3xl mx-auto">
      Dr. Charles Dwamena's campaign needs your support to reach every community and transform Ghana.
    </p>

    <p className="text-lg text-white/80 max-w-2xl mx-auto">
      Every contribution, no matter the size, helps us bring our vision to life.
    </p>
  </div>
</section>


      {/* Impact Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-gray-200">
        <h2 className="text-4xl font-bold mb-12 text-gray-900 text-center">Your Donation Makes a Difference</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Heart, title: '₵100', desc: 'Supports one community engagement', color: 'from-red-50 to-red-100' },
            { icon: Zap, title: '₵500', desc: 'Funds digital campaign outreach', color: 'from-blue-50 to-blue-100' },
            { icon: Shield, title: '₵1,000', desc: 'Supports volunteer training', color: 'from-red-50 to-red-100' },
            { icon: Heart, title: '₵5,000+', desc: 'Major campaign infrastructure', color: 'from-blue-50 to-blue-100' },
          ].map((item, i) => (
            <div key={i} className={`bg-gradient-to-br ${item.color} border-2 border-gray-200 rounded-2xl p-8 hover:shadow-lg transition transform hover:-translate-y-1`}>
              <item.icon className={`${i % 2 === 0 ? 'text-red-600' : 'text-blue-600'} mb-4`} size={36} />
              <div className="font-bold text-2xl mb-2 text-gray-900">{item.title}</div>
              <p className="text-gray-700 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Donation Form */}
      <section className="max-w-4xl mx-auto px-4 py-20 border-t border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleDonate} className="space-y-8">
              {/* Payment Category Selection */}
              <div>
                <h3 className="text-xl font-bold mb-6">Please Select Your Payment Category</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {PAYMENT_CATEGORIES.map((category) => {
                    const Icon = category.icon
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleCategoryChange(category.id)}
                        className={`p-6 rounded-xl font-bold transition flex flex-col items-center gap-3 ${
                          paymentCategory === category.id
                            ? 'bg-gradient-to-br from-red-600 to-red-700 text-white border-2 border-red-600 shadow-lg'
                            : 'bg-white border-2 border-gray-200 hover:border-blue-400 hover:shadow-md'
                        }`}
                      >
                        <Icon size={28} />
                        <span>{category.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <h3 className="text-xl font-bold mb-6">
                  Please Select Amount for {PAYMENT_CATEGORIES.find(c => c.id === paymentCategory)?.label}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {CATEGORY_AMOUNTS[paymentCategory].map(amount => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        setDonationAmount(amount)
                        setIsCustom(false)
                        setCustomAmount('')
                      }}
                      className={`p-4 rounded-xl font-bold transition ${
                        !isCustom && donationAmount === amount
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-2 border-blue-600'
                          : 'bg-white border-2 border-gray-200 hover:border-blue-400 text-gray-900'
                      }`}
                    >
                      GH¢{amount.toLocaleString()}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div>
                  <label className="block font-semibold mb-2">Or Enter Custom Amount</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-3 text-gray-500">GH¢</span>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value)
                          if (e.target.value) setIsCustom(true)
                        }}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter amount"
                        min="5"
                      />
                    </div>
                    {customAmount && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomAmount('')
                          setIsCustom(false)
                          setDonationAmount(CATEGORY_AMOUNTS[paymentCategory][0])
                        }}
                        className="text-red-600 font-semibold px-4 hover:text-red-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-bold mb-6">Your Information</h3>
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
                </div>
                <div className="mt-6">
                  <label className="block font-semibold mb-2 text-gray-900">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+233 XXX XXX XXXX"
                  />
                </div>
              </div>

              {/* Options */}
              <div>
                <h3 className="text-xl font-bold mb-6">Options</h3>
                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50/50 transition mb-4">
                  <input
                    type="checkbox"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="font-semibold text-gray-900">Make this donation anonymous</span>
                </label>

                <div>
                  <label className="block font-semibold mb-2 text-gray-900">Leave a Message (Optional)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Share why you're supporting our campaign..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 flex gap-4">
                <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <div className="text-blue-900 text-sm">
                  <p className="font-semibold mb-2">Secure Payment Processing</p>
                  <p>Your payment will be processed securely through Hubtel. All donations are tax-compliant and transparently reported.</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
              >
                <Heart size={20} />
                {isProcessing ? 'Processing...' : `Donate GH¢${finalAmount.toLocaleString()}`}
              </button>
            </form>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-red-300 rounded-2xl p-8 sticky top-4 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Donation Summary</h3>
              
              <div className="space-y-4 mb-8 pb-8 border-b-2 border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-bold capitalize text-gray-900">{paymentCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-bold text-2xl text-red-600">GH¢{finalAmount.toLocaleString()}</span>
                </div>
                
              </div>

              <div className="space-y-3 mb-8">
                <h4 className="font-bold text-gray-900">Payment Method</h4>
                <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                  <p className="text-sm font-semibold text-gray-900">Hubtel</p>
                  <p className="text-xs text-gray-600">Mobile money & card payments accepted</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-900">
                  <strong>Thank you</strong> for supporting Ghana's future! Your contribution helps us reach more communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-4 py-20 border-t border-gray-200">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'Is my donation secure?',
              a: 'Yes, all donations are processed through Hubtel, a trusted and secure payment gateway in Ghana.'
            },
            {
              q: 'Can I make recurring donations?',
              a: 'You can set up multiple donations through our platform. Contact us for a recurring donation arrangement.'
            },
            {
              q: 'Will my donation be public?',
              a: 'You can choose to make your donation anonymous. Otherwise, your name will appear on our donors list.'
            },
            {
              q: 'What is the money used for?',
              a: 'Donations support campaign activities, community outreach, voter education, and volunteer coordination.'
            },
            {
              q: 'Can I get a receipt?',
              a: 'Yes, a receipt will be sent to your email immediately after successful payment.'
            },
            {
              q: 'Is there a minimum donation?',
              a: 'The minimum donation is ₵50. You can donate any amount you wish.'
            },
          ].map((faq, i) => (
            <div key={i} className={`border-l-4 rounded-lg p-6 bg-white transition hover:shadow-md ${i % 2 === 0 ? 'border-l-red-500' : 'border-l-blue-500'}`}>
              <h4 className="font-bold mb-3 text-gray-900">{faq.q}</h4>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
