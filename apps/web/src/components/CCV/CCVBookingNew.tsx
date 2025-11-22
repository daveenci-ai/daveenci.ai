import React, { useState } from 'react';
import { Calendar, Mail, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CalendarPicker from '@/components/ui/calendar-picker';
import BookingForm, { Booking } from '@/components/ui/booking-form';

type MeetingType = '30min-fit-check' | '90min-consultation';

const CCVBookingNew = () => {
  const [step, setStep] = useState<'type' | 'calendar' | 'form' | 'confirmation'>('type');
  const [meetingType, setMeetingType] = useState<MeetingType | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string; display: string } | null>(null);
  const [bookingData, setBookingData] = useState<{ booking: Booking; meetLink?: string } | null>(null);

  const handleMeetingTypeSelect = (type: MeetingType) => {
    setMeetingType(type);
    setStep('calendar');
  };

  const handleSlotSelect = (slot: { start: string; end: string; display: string }) => {
    setSelectedSlot(slot);
  };

  const handleProceedToForm = () => {
    if (selectedSlot) {
      setStep('form');
    }
  };

  const handleBookingSuccess = (booking: { booking: Booking; meetLink?: string }) => {
    setBookingData(booking);
    setStep('confirmation');
  };

  const handleStartOver = () => {
    setStep('type');
    setMeetingType(null);
    setSelectedSlot(null);
    setBookingData(null);
  };

  return (
    <section id="booking" className="py-32 px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-8 mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-black rounded-2xl shadow-xl">
            <Calendar className="h-12 w-12 text-white" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-light text-black tracking-tight">
              Ready to Automate the Busywork?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Let's find one high-impact workflow and ship it to production in 30 days.
            </p>
          </div>
        </div>

        {/* Step 1: Select Meeting Type */}
        {step === 'type' && (
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-200">
            <h3 className="text-2xl font-semibold text-center mb-8">Choose Your Meeting Type</h3>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* 30-min Fit Check */}
              <button
                onClick={() => handleMeetingTypeSelect('30min-fit-check')}
                className="group relative bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-black hover:shadow-lg transition-shadow duration-200 text-left"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-slate-100 group-hover:bg-black rounded-xl flex items-center justify-center transition-colors duration-300">
                    <Calendar className="h-7 w-7 text-slate-700 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-slate-900 mb-2">30-min Fit Check</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Introductory call to understand your needs and see if there's a good fit.
                    </p>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>Overview of your challenges</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>Initial fit assessment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>Next steps discussion</span>
                    </li>
                  </ul>
                </div>
                <div className="absolute top-4 right-4 text-right">
                  <div className="text-xs font-semibold text-slate-500 group-hover:text-black transition-colors">
                    30 MIN
                  </div>
                  <div className="text-sm font-bold text-green-600 mt-1">
                    FREE
                  </div>
                </div>
              </button>

              {/* 90-min Deep Dive Consultation */}
              <button
                onClick={() => handleMeetingTypeSelect('90min-consultation')}
                className="group relative bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-black hover:shadow-lg transition-shadow duration-200 text-left"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-slate-100 group-hover:bg-black rounded-xl flex items-center justify-center transition-colors duration-300">
                    <Calendar className="h-7 w-7 text-slate-700 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-slate-900 mb-2">Deep Dive Consultation</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Comprehensive strategy session to review your stack and build a custom automation roadmap.
                    </p>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>Full stack review & technical assessment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>3-5 automation opportunities identified</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>ROI projections & 90-day implementation plan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>Written summary + action items delivered</span>
                    </li>
                  </ul>
                </div>
                <div className="absolute top-4 right-4 text-right">
                  <div className="text-xs font-semibold text-slate-500 group-hover:text-black transition-colors">
                    1:30 HR
                  </div>
                  <div className="text-sm font-bold text-brand-600 mt-1">
                    $150
                  </div>
                </div>
              </button>
            </div>

            <p className="text-sm text-slate-500 text-center mt-8">
              Start with a free 30-minute fit check, or dive deep with a comprehensive paid consultation that includes a written action plan.
            </p>
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 'calendar' && meetingType && (
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold text-slate-900">
                Select Date & Time
              </h3>
              <Button
                onClick={() => setStep('type')}
                variant="outline"
                size="sm"
                className="hover:bg-slate-100"
              >
                ← Change Type
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Left: Meeting Type Details */}
              <div className="flex flex-col gap-6 h-full">
                {/* Meeting Type Card */}
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 sticky top-4 flex-1 flex flex-col">
                  <div className="space-y-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-slate-600">
                          {meetingType === '30min-fit-check' ? '30 MIN' : '1:30 HR'}
                        </div>
                        <div className={`text-sm font-bold mt-1 ${meetingType === '30min-fit-check' ? 'text-green-600' : 'text-brand-600'}`}>
                          {meetingType === '30min-fit-check' ? 'FREE' : '$150'}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold text-slate-900 mb-2">
                        {meetingType === '30min-fit-check' ? '30-min Fit Check' : 'Deep Dive Consultation'}
                      </h4>
                      <p className="text-slate-600 leading-relaxed">
                        {meetingType === '30min-fit-check'
                          ? 'Introductory call to understand your needs and see if there\'s a good fit.'
                          : 'Comprehensive strategy session to review your stack and build a custom automation roadmap.'
                        }
                      </p>
                    </div>

                    <ul className="space-y-2 text-sm text-slate-600 flex-1">
                      {meetingType === '30min-fit-check' ? (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">•</span>
                            <span>Overview of your challenges</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">•</span>
                            <span>Initial fit assessment</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">•</span>
                            <span>Next steps discussion</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">•</span>
                            <span>Full stack review & technical assessment</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">•</span>
                            <span>3-5 automation opportunities identified</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">•</span>
                            <span>ROI projections & 90-day implementation plan</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">•</span>
                            <span>Written summary + action items delivered</span>
                          </li>
                        </>
                      )}
                    </ul>

                    {selectedSlot && (
                      <div className="pt-4 border-t border-slate-300 mt-auto">
                        <p className="text-xs font-semibold text-slate-600 mb-2">SELECTED TIME</p>
                        <p className="text-base font-semibold text-slate-900">
                          {new Date(selectedSlot.start).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-slate-600">{selectedSlot.display}</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedSlot && (
                  <Button
                    onClick={handleProceedToForm}
                    className="w-full bg-black text-white hover:bg-slate-800 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg"
                  >
                    Continue to Booking →
                  </Button>
                )}
              </div>

              {/* Right: Calendar */}
              <div>
                <CalendarPicker
                  onSelectSlot={handleSlotSelect}
                  selectedSlot={selectedSlot}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Booking Form */}
        {step === 'form' && selectedSlot && meetingType && (
          <BookingForm
            selectedSlot={selectedSlot}
            meetingType={meetingType}
            onSuccess={handleBookingSuccess}
            onCancel={() => setStep('calendar')}
          />
        )}

        {/* Step 4: Confirmation */}
        {step === 'confirmation' && bookingData && (
          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-slate-200 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            <h3 className="text-3xl font-semibold text-slate-900 mb-4">
              Booking Confirmed!
            </h3>

            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Your {meetingType === '30min-fit-check' ? '30-minute Fit Check' : '90-minute Deep Dive Consultation'} has been scheduled.
            </p>

            <div className="bg-slate-50 rounded-xl p-6 mb-8 max-w-md mx-auto">
              <div className="space-y-3 text-left">
                <div>
                  <p className="text-sm font-medium text-slate-600">Meeting Time</p>
                  <p className="text-lg text-slate-900">
                    {new Date(bookingData.booking.start_time).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-slate-600">
                    {new Date(bookingData.booking.start_time).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      timeZoneName: 'short',
                    })}
                  </p>
                </div>

                {bookingData.meetLink && (
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-2">Google Meet Link</p>
                    <a
                      href={bookingData.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium"
                    >
                      Join Meeting
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-brand-50 border border-brand-200 rounded-lg p-4 text-left max-w-md mx-auto">
                <Mail className="h-5 w-5 text-brand-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-brand-900">Calendar Invite Sent</p>
                  <p className="text-sm text-brand-800 mt-1">
                    Check your email at <strong>{bookingData.booking.email}</strong> for the Google Calendar invite with meeting details.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleStartOver}
                variant="outline"
                className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Email Fallback */}
        <div className="mt-8 p-6 bg-slate-50 rounded-2xl text-center">
          <div className="flex items-center justify-center gap-3 text-slate-600">
            <Mail className="h-5 w-5" />
            <span className="text-lg">Prefer email?</span>
            <a
              href="mailto:astrid@daveenci.com?subject=AI Strategy Call Request&body=Hi, I'd like to schedule an AI strategy call. Please let me know your availability."
              className="text-black font-semibold hover:underline transition-colors duration-200 inline-block"
            >
              astrid@daveenci.com
            </a>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Having issues with booking? Reach out and we'll schedule manually.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CCVBookingNew;

