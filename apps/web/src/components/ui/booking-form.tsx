/**
 * Booking Form Component
 * Collects user information and creates calendar booking
 */

import React, { useState } from 'react';
import { Button } from './button';
import { Mail, User, Phone, Building, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';

export interface Booking {
  id: number;
  name: string;
  email: string;
  start_time: string;
  end_time: string;
  meeting_type: string;
  google_meet_link?: string;
}

interface BookingFormProps {
  selectedSlot: { start: string; end: string; display: string };
  meetingType: '30min-fit-check' | '90min-consultation';
  onSuccess: (booking: { booking: Booking; meetLink?: string }) => void;
  onCancel: () => void;
}

export function BookingForm({ selectedSlot, meetingType, onSuccess, onCancel }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          meetingType,
          startTime: selectedSlot.start,
          endTime: selectedSlot.end,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create booking');
      }

      const data = await response.json();
      onSuccess(data);
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const meetingDuration = meetingType === '30min-fit-check' ? '30 minutes' : '1 hour 30 minutes';
  const meetingTitle = meetingType === '30min-fit-check' ? '30-min Fit Check' : 'Deep Dive Consultation';
  const meetingPrice = meetingType === '30min-fit-check' ? 'FREE' : '$150';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8">
      <h3 className="text-2xl font-semibold text-slate-900 mb-6">
        Confirm Your Booking
      </h3>

      {/* Selected Time Display */}
      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Meeting Type</p>
            <p className="text-lg font-semibold text-slate-900">{meetingTitle}</p>
            <p className="text-sm text-slate-600 mt-1">Duration: {meetingDuration}</p>
            <p className={`text-sm font-bold mt-1 ${meetingType === '30min-fit-check' ? 'text-green-600' : 'text-brand-600'}`}>
              {meetingPrice}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-600 mb-1">Selected Time</p>
            <p className="text-lg font-semibold text-slate-900">
              {new Date(selectedSlot.start).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <p className="text-sm text-slate-600">{selectedSlot.display}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="john@company.com"
              className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            You'll receive a calendar invite at this email
          </p>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
            Phone Number (Optional)
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-semibold text-slate-700 mb-2">
            Company (Optional)
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Acme Corp"
              className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-semibold text-slate-700 mb-2">
            What would you like to discuss? (Optional)
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-slate-400" />
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Tell us about your automation challenges or what you'd like to achieve..."
              className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400 resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-black text-white hover:bg-slate-800 px-6 py-3 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Confirming...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Confirm Booking
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            disabled={loading}
            variant="outline"
            className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 text-base font-semibold rounded-xl"
          >
            Cancel
          </Button>
        </div>

        <p className="text-xs text-slate-500 text-center mt-4">
          By confirming, you'll receive a Google Calendar invite with a Meet link
        </p>
      </form>
    </div>
  );
}

export default BookingForm;

