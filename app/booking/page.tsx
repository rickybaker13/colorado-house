'use client';

import { useState } from 'react';
import BookingForm from '@/components/booking/BookingForm';
import Button from '@/components/common/Button';
import { ShieldCheck, Lock } from 'lucide-react';

interface BookingData {
  checkIn: string;
  checkOut: string;
  guests: number;
}

export default function BookingPage() {
  const [step, setStep] = useState<'availability' | 'details' | 'confirmation'>('availability');
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  const handleFormSubmit = (data: BookingData) => {
    setBookingData(data);
    setStep('details');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">
            Book Your Stay
          </h1>
          <p className="text-gray-600 text-lg">
            Secure your perfect mountain getaway at Purgatory Townhouse
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12 flex justify-center gap-4">
          <div className={`text-center ${step === 'availability' ? 'text-mountain-medium' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-semibold ${
              step === 'availability' ? 'bg-mountain-medium text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <p className="text-sm">Check Availability</p>
          </div>

          <div className={`hidden sm:block flex-1 mt-5 ${step === 'details' || step === 'confirmation' ? 'border-t-2 border-mountain-medium' : 'border-t-2 border-gray-300'}`} />

          <div className={`text-center ${step === 'details' ? 'text-mountain-medium' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-semibold ${
              ['details', 'confirmation'].includes(step) ? 'bg-mountain-medium text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <p className="text-sm">Guest Details</p>
          </div>

          <div className={`hidden sm:block flex-1 mt-5 ${step === 'confirmation' ? 'border-t-2 border-mountain-medium' : 'border-t-2 border-gray-300'}`} />

          <div className={`text-center ${step === 'confirmation' ? 'text-mountain-medium' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-semibold ${
              step === 'confirmation' ? 'bg-mountain-medium text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
            <p className="text-sm">Confirm & Pay</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {step === 'availability' && (
            <div>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-8">
                Select Your Dates
              </h2>
              <BookingForm onSubmit={handleFormSubmit} />
            </div>
          )}

          {step === 'details' && bookingData && (
            <div>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-8">
                Guest Information
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mountain-medium"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mountain-medium"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mountain-medium"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mountain-medium"
                      rows={4}
                      placeholder="Let us know if you have any special requests..."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      onClick={() => setStep('availability')}
                      variant="outline"
                      size="lg"
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep('confirmation')}
                      size="lg"
                      className="flex-1"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </form>

                {/* Booking Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-6">
                    Booking Summary
                  </h3>
                  <div className="space-y-4 pb-6 border-b border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in</span>
                      <span className="font-medium">
                        {new Date(bookingData.checkIn).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out</span>
                      <span className="font-medium">
                        {new Date(bookingData.checkOut).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests</span>
                      <span className="font-medium">{bookingData.guests}</span>
                    </div>
                  </div>

                  <div className="pt-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Nightly rate</span>
                      <span>$250</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cleaning fee</span>
                      <span>$75</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-mountain-medium text-lg">$575+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="text-green-600" size={32} />
                </div>
                <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">
                  Review & Payment
                </h2>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 mb-8 text-left">
                <h3 className="font-semibold text-lg text-gray-900 mb-6">
                  Booking Details
                </h3>
                {bookingData && (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property</span>
                      <span className="font-medium">Purgatory Townhouse</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in Date</span>
                      <span className="font-medium">
                        {new Date(bookingData.checkIn).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out Date</span>
                      <span className="font-medium">
                        {new Date(bookingData.checkOut).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number of Guests</span>
                      <span className="font-medium">{bookingData.guests}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
                      <span>Total Amount Due</span>
                      <span className="text-mountain-medium">$575+</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 justify-center mb-8">
                <Lock size={20} className="text-green-600" />
                <span className="text-gray-600">
                  Your payment is secure and encrypted
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setStep('details')}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Back to Details
                </Button>
                <Button size="lg" className="flex-1">
                  Complete Booking
                </Button>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                This is a demo. In production, this would connect to a payment processor.
              </p>
            </div>
          )}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <ShieldCheck className="mx-auto mb-3 text-mountain-medium" size={32} />
            <h3 className="font-semibold text-gray-900 mb-2">Secure Booking</h3>
            <p className="text-gray-600 text-sm">All transactions are encrypted and secure</p>
          </div>
          <div className="text-center">
            <svg
              className="mx-auto mb-3 w-8 h-8 text-mountain-medium"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="font-semibold text-gray-900 mb-2">Best Price Guarantee</h3>
            <p className="text-gray-600 text-sm">Lowest rates directly from the owner</p>
          </div>
          <div className="text-center">
            <svg
              className="mx-auto mb-3 w-8 h-8 text-mountain-medium"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-sm">We are here to help anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
}
