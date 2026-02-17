'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { XCircle, ArrowLeft, Heart, HelpCircle } from 'lucide-react'

export default function DonationCancelled() {
  const searchParams = useSearchParams()
  const clientReference = searchParams.get('ref')

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-background flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        {/* Cancelled Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-6">
            <XCircle className="text-orange-600" size={56} />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-orange-900">
            Payment Cancelled
          </h1>
          <p className="text-xl text-muted-foreground">
            Your donation was not completed
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white border-2 border-orange-200 rounded-lg shadow-lg p-8 mb-6">
          <div className="space-y-6">
            {/* Status Info */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">What Happened?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You cancelled the payment process before it was completed. No charges have been made to your account.
              </p>
              {clientReference && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Reference Number</span>
                    <span className="font-mono text-sm bg-white px-3 py-1 rounded border border-gray-200">
                      {clientReference}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Reasons */}
            <div>
              <h3 className="font-semibold mb-3 text-gray-900">Common Reasons for Cancellation</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Changed your mind about the donation amount</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Wanted to use a different payment method</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Encountered technical issues during payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Needed to review donation details</span>
                </li>
              </ul>
            </div>

            {/* Reassurance */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <div className="flex-1">
                  <p className="font-semibold text-blue-900 mb-1">No Worries!</p>
                  <p className="text-sm text-blue-700">
                    Your payment information was not processed, and no charges were made. 
                    You can try again whenever you're ready.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/donate"
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 rounded-lg font-semibold transition"
          >
            <Heart size={20} />
            Try Again
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-card hover:bg-muted border-2 border-border text-foreground px-6 py-4 rounded-lg font-semibold transition"
          >
            <ArrowLeft size={20} />
            Return Home
          </Link>
        </div>

        {/* Alternative Actions */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-bold text-lg mb-4">Other Ways to Support</h3>
          <div className="space-y-3">
            <Link
              href="/volunteer"
              className="flex items-center justify-between p-4 bg-background hover:bg-muted rounded-lg transition group"
            >
              <div>
                <p className="font-semibold">Volunteer Your Time</p>
                <p className="text-sm text-muted-foreground">Join our campaign team</p>
              </div>
              <ArrowLeft className="text-accent rotate-180 group-hover:translate-x-1 transition" size={20} />
            </Link>
            <Link
              href="/contact"
              className="flex items-center justify-between p-4 bg-background hover:bg-muted rounded-lg transition group"
            >
              <div>
                <p className="font-semibold">Get in Touch</p>
                <p className="text-sm text-muted-foreground">Have questions? Contact us</p>
              </div>
              <ArrowLeft className="text-accent rotate-180 group-hover:translate-x-1 transition" size={20} />
            </Link>
            <Link
              href="/news"
              className="flex items-center justify-between p-4 bg-background hover:bg-muted rounded-lg transition group"
            >
              <div>
                <p className="font-semibold">Stay Informed</p>
                <p className="text-sm text-muted-foreground">Follow our campaign updates</p>
              </div>
              <ArrowLeft className="text-accent rotate-180 group-hover:translate-x-1 transition" size={20} />
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground mb-2">
            Experiencing technical issues?
          </p>
          <Link
            href="/contact"
            className="text-accent hover:underline font-semibold text-sm"
          >
            Contact our support team for assistance
          </Link>
        </div>
      </div>
    </div>
  )
}
