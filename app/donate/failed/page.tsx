'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, HelpCircle, ArrowLeft, Heart } from 'lucide-react'

function FailedContent() {
  const searchParams = useSearchParams()
  const clientReference = searchParams.get('ref')
  const errorCode = searchParams.get('error')
  const reason = searchParams.get('reason')

  const getErrorMessage = () => {
    switch (errorCode) {
      case 'missing_reference':
        return 'The payment reference is missing. Please try making a new donation.'
      case 'invalid_reference':
        return 'The payment reference format is invalid. Please contact support.'
      case 'donation_not_found':
        return 'We could not find the donation record. Please try again.'
      case 'update_failed':
        return 'Failed to update the donation status. Please contact support.'
      case 'processing_error':
        return 'An error occurred while processing your payment. Please try again.'
      default:
        return reason || 'Your payment could not be processed. Please try again.'
    }
  }

  return (
    <div className="max-w-2xl w-full">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
            <AlertTriangle className="text-red-600" size={56} />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-red-900">
            Payment Failed
          </h1>
          <p className="text-xl text-muted-foreground">
            We couldn't process your donation
          </p>
        </div>

        {/* Error Card */}
        <div className="bg-white border-2 border-red-200 rounded-lg shadow-lg p-8 mb-6">
          <div className="space-y-6">
            {/* Error Details */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">What Went Wrong?</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 leading-relaxed">
                  {getErrorMessage()}
                </p>
              </div>
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

            {/* Common Reasons */}
            <div>
              <h3 className="font-semibold mb-3 text-gray-900">Common Reasons for Payment Failure</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong>Insufficient funds:</strong> Your account doesn't have enough balance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong>Card declined:</strong> Your bank declined the transaction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong>Incorrect details:</strong> Payment information was entered incorrectly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong>Network issues:</strong> Connection problems during payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong>Transaction timeout:</strong> Payment took too long to complete</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong>Daily limit reached:</strong> You've exceeded your transaction limit</span>
                </li>
              </ul>
            </div>

            {/* What to Do */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <div className="flex-1">
                  <p className="font-semibold text-blue-900 mb-2">What Should You Do?</p>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Check your account balance or card details</li>
                    <li>• Try a different payment method</li>
                    <li>• Contact your bank if the issue persists</li>
                    <li>• Wait a few minutes and try again</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Reassurance */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong className="text-green-900">Don't worry!</strong> No charges were made to your account. 
                Your payment information is secure, and you can try again whenever you're ready.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/donate"
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 rounded-lg font-semibold transition"
          >
            <RefreshCw size={20} />
            Try Again
          </Link>
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 bg-card hover:bg-muted border-2 border-border text-foreground px-6 py-4 rounded-lg font-semibold transition"
          >
            <HelpCircle size={20} />
            Get Help
          </Link>
        </div>

        {/* Alternative Support Options */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="font-bold text-lg mb-4">Need Assistance?</h3>
          <div className="space-y-3">
            <div className="p-4 bg-background rounded-lg">
              <p className="font-semibold mb-1">Contact Support</p>
              <p className="text-sm text-muted-foreground mb-2">
                Our team is here to help resolve any payment issues
              </p>
              <Link
                href="/contact"
                className="text-accent hover:underline text-sm font-semibold"
              >
                Contact us →
              </Link>
            </div>
            <div className="p-4 bg-background rounded-lg">
              <p className="font-semibold mb-1">Check Payment Status</p>
              <p className="text-sm text-muted-foreground mb-2">
                Verify your payment status with your bank or mobile money provider
              </p>
              {clientReference && (
                <p className="text-xs text-muted-foreground font-mono">
                  Reference: {clientReference}
                </p>
              )}
            </div>
            <div className="p-4 bg-background rounded-lg">
              <p className="font-semibold mb-1">Alternative Payment Methods</p>
              <p className="text-sm text-muted-foreground">
                Try using a different payment method (Mobile Money, Card, or Bank Transfer)
              </p>
            </div>
          </div>
        </div>

        {/* Other Ways to Support */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-lg mb-4">Other Ways to Support Our Campaign</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link
              href="/volunteer"
              className="flex items-center gap-3 p-4 bg-white hover:bg-gray-50 rounded-lg transition border border-gray-200"
            >
              <Heart className="text-accent flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold text-sm">Volunteer</p>
                <p className="text-xs text-muted-foreground">Join our team</p>
              </div>
            </Link>
            <Link
              href="/news"
              className="flex items-center gap-3 p-4 bg-white hover:bg-gray-50 rounded-lg transition border border-gray-200"
            >
              <ArrowLeft className="text-accent flex-shrink-0 rotate-180" size={24} />
              <div>
                <p className="font-semibold text-sm">Stay Updated</p>
                <p className="text-xs text-muted-foreground">Follow our progress</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Return Home */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-accent hover:underline font-semibold"
          >
            <ArrowLeft size={16} />
            Return to Homepage
          </Link>
        </div>
      </div>
  )
}

export default function DonationFailed() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-background flex items-center justify-center px-4 py-16">
      <Suspense fallback={
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
              <AlertTriangle className="text-red-600" size={56} />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-red-900">Loading...</h1>
          </div>
        </div>
      }>
        <FailedContent />
      </Suspense>
    </div>
  )
}
