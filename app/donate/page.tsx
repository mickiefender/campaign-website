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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-6 text-balance">Welcome to Dr. Dwamena's Campaign Donation</h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl">
          Every contribution, no matter the size, helps us reach more communities and bring our vision for Ghana to life.
        </p>
        
      </section>

      {/* Impact Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t border-border">
        <h2 className="text-2xl font-bold mb-8">Your Donation Makes a Difference</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Heart, title: '₵100', desc: 'Supports one community engagement' },
            { icon: Zap, title: '₵500', desc: 'Funds digital campaign outreach' },
            { icon: Shield, title: '₵1,000', desc: 'Supports volunteer training' },
            { icon: Heart, title: '₵5,000+', desc: 'Major campaign infrastructure' },
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6">
              <item.icon className="text-accent mb-4" size={32} />
              <div className="font-bold text-lg mb-2">{item.title}</div>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Donation Form */}
      <section className="max-w-4xl mx-auto px-4 py-16 border-t border-border">
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
                        className={`p-6 rounded-lg font-bold transition flex flex-col items-center gap-3 ${
                          paymentCategory === category.id
                            ? 'bg-primary text-primary-foreground border-2 border-primary shadow-lg'
                            : 'bg-card border-2 border-border hover:border-accent hover:shadow-md'
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
                      className={`p-4 rounded-lg font-bold transition ${
                        !isCustom && donationAmount === amount
                          ? 'bg-primary text-primary-foreground border-2 border-primary'
                          : 'bg-card border-2 border-border hover:border-accent'
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
                      <span className="absolute left-3 top-3 text-muted-foreground">GH¢</span>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value)
                          if (e.target.value) setIsCustom(true)
                        }}
                        className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
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
                        className="text-accent font-semibold px-4"
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
                </div>
                <div className="mt-6">
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
              </div>

              {/* Options */}
              <div>
                <h3 className="text-xl font-bold mb-6">Options</h3>
                <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-card/50 transition mb-4">
                  <input
                    type="checkbox"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">Make this donation anonymous</span>
                </label>

                <div>
                  <label className="block font-semibold mb-2">Leave a Message (Optional)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Share why you're supporting our campaign..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex gap-4">
                <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
                <div className="text-blue-900 text-sm">
                  <p className="font-semibold mb-2">Secure Payment Processing</p>
                  <p>Your payment will be processed securely through Hubtel. All donations are tax-compliant and transparently reported.</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-bold text-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Heart size={20} />
                {isProcessing ? 'Processing...' : `Donate GH¢${finalAmount.toLocaleString()}`}
              </button>
            </form>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-card border-2 border-accent rounded-lg p-8 sticky top-4">
              <h3 className="text-xl font-bold mb-6">Donation Summary</h3>
              
              <div className="space-y-4 mb-8 pb-8 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-bold capitalize">{paymentCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold">GH¢{finalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">In USD</span>
                  <span className="font-semibold text-accent">${isCGHS}</span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <h4 className="font-bold">Payment Method</h4>
                <div className="bg-background p-4 rounded-lg border border-border">
                  <p className="text-sm font-semibold">Hubtel</p>
                  <p className="text-xs text-muted-foreground">Mobile money & card payments accepted</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-900">
                  <strong>Thank you</strong> for supporting Ghana's future! Your contribution helps us reach more communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-4 py-16 border-t border-border">
        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
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
            <div key={i} className="bg-card border border-border rounded-lg p-6">
              <h4 className="font-bold mb-3">{faq.q}</h4>
              <p className="text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
