'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Clock, RefreshCw, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export default function DonationPending() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const clientReference = searchParams.get('ref')
  const [isChecking, setIsChecking] = useState(false)
  const [checkCount, setCheckCount] = useState(0)
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(true)

  // Auto-check payment status every 5 seconds (max 12 times = 1 minute)
  useEffect(() => {
    if (!autoCheckEnabled || !clientReference || checkCount >= 12) {
      return
    }

    const timer = setTimeout(() => {
      checkPaymentStatus()
    }, 5000)

    return () => clearTimeout(timer)
  }, [checkCount, autoCheckEnabled, clientReference])

  const checkPaymentStatus = async () => {
    if (!clientReference || isChecking) return

    setIsChecking(true)
    setCheckCount(prev => prev + 1)

    try {
      // Call the callback endpoint to re-verify status
      const response = await fetch(
        `/api/hubtel/callback?status=check&clientReference=${clientReference}`
      )

      // The callback will redirect if status has changed
      // If we're still here, payment is still pending
      console.log('Payment still pending...')
    } catch (error) {
      console.error('Error checking payment status:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const handleManualCheck = () => {
    setAutoCheckEnabled(false)
    checkPaymentStatus()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-background flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        {/* Pending Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 rounded-full mb-6">
            <Clock className="text-yellow-600 animate-pulse" size={56} />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-yellow-900">
            Payment Processing
          </h1>
          <p className="text-xl text-muted-foreground">
            Your payment is being processed
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white border-2 border-yellow-200 rounded-lg shadow-lg p-8 mb-6">
          <div className="space-y-6">
            {/* Processing Info */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">What's Happening?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your payment is currently being processed by the payment provider. This usually takes 
                a few moments, but can sometimes take longer depending on your payment method.
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

            {/* Auto-check Status */}
            {autoCheckEnabled && checkCount < 12 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <RefreshCw 
                    className={`text-blue-600 flex-shrink-0 mt-1 ${isChecking ? 'animate-spin' : ''}`} 
                    size={20} 
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900 mb-1">Auto-checking Status</p>
                    <p className="text-sm text-blue-700">
                      We're automatically checking your payment status every 5 seconds. 
                      You'll be redirected once the payment is confirmed.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 bg-blue-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full transition-all duration-500"
                          style={{ width: `${(checkCount / 12) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-blue-700 font-medium">
                        {checkCount}/12
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Manual Check Button */}
            <button
              onClick={handleManualCheck}
              disabled={isChecking}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground px-6 py-4 rounded-lg font-semibold transition"
            >
              <RefreshCw className={isChecking ? 'animate-spin' : ''} size={20} />
              {isChecking ? 'Checking...' : 'Check Status Now'}
            </button>

            {/* Payment Methods Info */}
            <div>
              <h3 className="font-semibold mb-3 text-gray-900">Processing Times by Payment Method</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">Mobile Money</span>
                  <span className="text-gray-600">1-5 minutes</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">Card Payment</span>
                  <span className="text-gray-600">Instant - 2 minutes</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">Bank Transfer</span>
                  <span className="text-gray-600">5-10 minutes</span>
                </div>
              </div>
            </div>

            {/* What to Expect */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <CheckCircle size={18} />
                What Happens Next?
              </h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>You'll receive a confirmation email once payment is complete</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Your donation will appear in our records immediately</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>A receipt will be sent to your email address</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <AlertCircle className="text-yellow-600" size={20} />
            Important Notes
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span>
                <strong className="text-foreground">Don't close this page</strong> - 
                We'll automatically redirect you once payment is confirmed
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span>
                <strong className="text-foreground">Check your phone</strong> - 
                If using mobile money, you may need to approve the transaction
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span>
                <strong className="text-foreground">Be patient</strong> - 
                Some payment methods take longer than others
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span>
                <strong className="text-foreground">Save your reference</strong> - 
                Keep the reference number above for your records
              </span>
            </li>
          </ul>
        </div>

        {/* Alternative Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 bg-card hover:bg-muted border-2 border-border text-foreground px-6 py-3 rounded-lg font-semibold transition"
          >
            Need Help?
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-card hover:bg-muted border-2 border-border text-foreground px-6 py-3 rounded-lg font-semibold transition"
          >
            Return Home
          </Link>
        </div>

        {/* Support Info */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            Payment taking too long?{' '}
            <Link href="/contact" className="text-accent hover:underline font-semibold">
              Contact support
            </Link>
            {' '}with your reference number
          </p>
        </div>
      </div>
    </div>
  )
}
