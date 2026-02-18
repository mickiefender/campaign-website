'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Heart, Share2, Download, ArrowRight } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const clientReference = searchParams.get('ref')
  const amount = searchParams.get('amount')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Trigger confetti or celebration animation
    if (typeof window !== 'undefined') {
      // You can add confetti library here
      console.log('Payment successful!')
    }
  }, [])

  const handleShare = async () => {
    const shareText = `I just supported Dr. Dwamena's campaign! Join me in making a difference for Ghana's future. 🇬🇭`
    const shareUrl = `${window.location.origin}/donate`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Support Dr. Dwamena's Campaign",
          text: shareText,
          url: shareUrl,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
            <CheckCircle className="text-green-600" size={56} />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-green-900">
            Thank You for Your Donation! 🎉
          </h1>
          <p className="text-xl text-muted-foreground">
            Your contribution has been successfully processed
          </p>
        </div>

        {/* Success Card */}
        <div className="bg-white border-2 border-green-200 rounded-lg shadow-lg p-8 mb-6">
          <div className="space-y-6">
            {/* Transaction Details */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Transaction Details</h2>
              <div className="space-y-3">
                {amount && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount Donated</span>
                    <span className="text-2xl font-bold text-green-600">
                      GH¢{parseFloat(amount).toLocaleString()}
                    </span>
                  </div>
                )}
                {clientReference && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Reference Number</span>
                    <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
                      {clientReference}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className="flex items-center gap-2 text-green-600 font-semibold">
                    <CheckCircle size={16} />
                    Completed
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date</span>
                  <span className="text-gray-900">
                    {new Date().toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Receipt Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Download className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <div className="flex-1">
                  <p className="font-semibold text-blue-900 mb-1">Receipt Sent</p>
                  <p className="text-sm text-blue-700">
                    A receipt has been sent to your email address. Please check your inbox (and spam folder).
                  </p>
                </div>
              </div>
            </div>

            {/* Impact Message */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-start gap-4">
                <Heart className="text-red-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">Your Impact</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Your generous contribution helps us reach more communities, engage with voters, 
                    and build a stronger campaign infrastructure. Together, we're creating positive 
                    change for Ghana's future.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-semibold transition"
          >
            <Share2 size={20} />
            {copied ? 'Link Copied!' : 'Share Your Support'}
          </button>
          <Link
            href="/donate"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold transition"
          >
            <Heart size={20} />
            Donate Again
          </Link>
        </div>

        {/* Next Steps */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-bold text-lg mb-4">What's Next?</h3>
          <div className="space-y-3">
            <Link
              href="/volunteer"
              className="flex items-center justify-between p-4 bg-background hover:bg-muted rounded-lg transition group"
            >
              <div>
                <p className="font-semibold">Join Our Volunteer Team</p>
                <p className="text-sm text-muted-foreground">Help us reach more communities</p>
              </div>
              <ArrowRight className="text-accent group-hover:translate-x-1 transition" size={20} />
            </Link>
            <Link
              href="/news"
              className="flex items-center justify-between p-4 bg-background hover:bg-muted rounded-lg transition group"
            >
              <div>
                <p className="font-semibold">Stay Updated</p>
                <p className="text-sm text-muted-foreground">Follow our campaign progress</p>
              </div>
              <ArrowRight className="text-accent group-hover:translate-x-1 transition" size={20} />
            </Link>
            <Link
              href="/"
              className="flex items-center justify-between p-4 bg-background hover:bg-muted rounded-lg transition group"
            >
              <div>
                <p className="font-semibold">Return to Homepage</p>
                <p className="text-sm text-muted-foreground">Learn more about our vision</p>
              </div>
              <ArrowRight className="text-accent group-hover:translate-x-1 transition" size={20} />
            </Link>
          </div>
        </div>

        {/* Support Contact */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            Questions about your donation?{' '}
            <Link href="/contact" className="text-accent hover:underline font-semibold">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
  )
}

export default function DonationSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background flex items-center justify-center px-4 py-16">
      <Suspense fallback={
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <CheckCircle className="text-green-600" size={56} />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-green-900">Loading...</h1>
          </div>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
