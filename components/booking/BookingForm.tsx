'use client';

import { useState } from 'react';
import { Calendar, Users } from 'lucide-react';
import Button from '@/components/common/Button';

interface BookingFormProps {
  onSubmit?: (data: BookingData) => void;
}

interface BookingData {
  checkIn: string;
  checkOut: string;
  guests: number;
}

export default function BookingForm({ onSubmit }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingData>({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const nights = formData.checkIn && formData.checkOut
    ? Math.ceil(
        (new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
      )
    : 0;

  const pricePerNight = 250;
  const totalPrice = nights > 0 ? nights * pricePerNight : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="date"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mountain-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-out Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="date"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mountain-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Guests
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mountain-medium appearance-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full">
          Check Availability
        </Button>
      </form>

      {/* Price Summary Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
          <h3 className="font-semibold text-lg text-gray-900 mb-6">Booking Summary</h3>

          <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
            {formData.checkIn && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Check-in</span>
                <span className="font-medium">{new Date(formData.checkIn).toLocaleDateString()}</span>
              </div>
            )}
            {formData.checkOut && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Check-out</span>
                <span className="font-medium">{new Date(formData.checkOut).toLocaleDateString()}</span>
              </div>
            )}
            {nights > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{nights} nights</span>
              </div>
            )}
            {formData.guests && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{formData.guests} guests</span>
              </div>
            )}
          </div>

          {nights > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">${pricePerNight} × {nights} nights</span>
                <span className="font-medium">${nights * pricePerNight}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cleaning fee</span>
                <span className="font-medium">$75</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg text-mountain-medium">
                  ${totalPrice + 75}
                </span>
              </div>
            </div>
          )}

          {nights === 0 && (
            <p className="text-sm text-gray-500 text-center">
              Select dates to see pricing
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
