import React, { useState, useEffect, useCallback, memo } from 'react';
import { Calendar, MapPin, Loader2 } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  duration_minutes: number;
  image_url: string | null;
  image_alt: string | null;
  google_calendar_event_id: string | null;
  google_meet_link: string | null;
  status: string;
  max_attendees: number;
  registration_link: string | null;
  date_created: string;
}

const CCVEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState('');
  const { toast } = useToast();

  // Fetch events from API
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchEvents = async () => {
      const apiUrl = import.meta.env.API_URL;
      
      if (!apiUrl) {
        console.warn('Backend API not configured. No events will be displayed.');
        setEvents([]);
        setIsLoadingEvents(false);
        return;
      }
      
      try {
        const response = await fetch(`${apiUrl}/events?status=upcoming`, {
          signal: abortController.signal
        });
        
        if (!response.ok) {
          throw new Error('Failed to load events');
        }
        
        const eventsData: Event[] = await response.json();
        
        // Sort by date (upcoming first) and filter only future events
        const now = new Date();
        const upcomingEvents = eventsData
          .filter(event => new Date(event.event_date) >= now)
          .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
        
        setEvents(upcomingEvents);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Events fetch aborted');
          return;
        }
        console.error('Error loading events:', error);
        setEvents([]);
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoadingEvents(false);
        }
      }
    };

    fetchEvents();
    
    // Cleanup: abort fetch if component unmounts
    return () => {
      abortController.abort();
    };
  }, []);

  const handleRequestInvite = useCallback((eventTitle: string) => {
    setSelectedEvent(events.find(e => e.title === eventTitle) || null);
    setShowForm(true);
  }, [events]);

  const handleJoinWebinar = useCallback((event: Event) => {
    setSelectedEvent(event);
    setRegistrationEmail('');
    setShowRegistrationModal(true);
  }, []);

  const handleRegistrationSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registrationEmail || !selectedEvent) return;

    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.API_URL;
      
      if (!apiUrl) {
        toast({
          title: "Registration Submitted",
          description: `You'll receive an invite at ${registrationEmail}`,
        });
        setShowRegistrationModal(false);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${apiUrl}/events/${selectedEvent.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registrationEmail,
          event_id: selectedEvent.id,
          event_title: selectedEvent.title,
          event_date: selectedEvent.event_date,
          google_meet_link: selectedEvent.google_meet_link,
        }),
      });

      if (response.ok) {
        toast({
          title: "Registration Successful!",
          description: `Event invite sent to ${registrationEmail}`,
        });
        setShowRegistrationModal(false);
        setRegistrationEmail('');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: "Registration Submitted",
        description: `You'll receive an invite at ${registrationEmail}`,
        variant: "default",
      });
      setShowRegistrationModal(false);
      setRegistrationEmail('');
    } finally {
      setIsLoading(false);
    }
  }, [selectedEvent, registrationEmail, toast]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Using placeholder webhook URL - would need actual Zapier webhook
      const webhookUrl = 'https://hooks.zapier.com/hooks/catch/your-webhook-url/';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          ...formData,
          event: selectedEvent,
          timestamp: new Date().toISOString(),
          type: 'event_invite_request'
        }),
      });

      toast({
        title: "Request Sent",
        description: "Your invite request has been submitted. We'll be in touch soon!",
      });

      setFormData({ name: '', email: '', company: '', message: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, selectedEvent, toast]);

  return (
    <section id="events" className="py-24 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-light text-black mb-6">
            Happy <span className="text-brand-600">Fridays</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            End your week on a high note with our Friday sessions—where AI founders, operators, and builders connect, learn, and ship together.
          <br /><br />
            Join us for live demos, practical workshops, peer networking, and expert talks. Leave with templates, tactics, and next steps you can implement right away.
          </p>
        </div>

        {isLoadingEvents ? (
          <div className="text-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-brand-600 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">Loading upcoming events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 text-xl font-medium mb-2">No Upcoming Events</p>
            <p className="text-slate-500">Check back soon for new webinar announcements!</p>
          </div>
        ) : (
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: events.length > 2,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {events.map((event) => (
                  <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full bg-white border border-slate-200 hover:border-slate-300 transition-shadow duration-200 hover:shadow-lg flex flex-col">
                      <CardContent className="p-0 flex flex-col h-full">
                        <div className="aspect-video bg-gradient-to-br from-brand-50 to-slate-100 rounded-t-lg overflow-hidden">
                          {event.image_url ? (
                            <img 
                              src={event.image_url} 
                              alt={event.image_alt || event.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Calendar className="h-16 w-16 text-brand-300" />
                            </div>
                          )}
                        </div>
                        <div className="p-6 space-y-4 flex flex-col flex-grow">
                          <div className="flex items-center gap-3 text-brand-600">
                            <Calendar className="h-5 w-5" />
                            <span className="font-semibold">
                              {new Date(event.event_date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                timeZone: 'America/Chicago'
                              })}
                              {' @ '}
                              {new Date(event.event_date).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                                timeZone: 'America/Chicago'
                              })}
                              {' CST'}
                            </span>
                          </div>
                          
                          <h3 className="text-2xl font-semibold text-black">
                            {event.title}
                          </h3>
                          
                          <p className="text-slate-600 text-lg leading-relaxed flex-grow line-clamp-3">
                            {event.description}
                          </p>
                          
                          <div className="flex items-center gap-2 text-slate-500">
                            <span className="text-sm">🌐 Online Webinar • {event.duration_minutes} min</span>
                          </div>
                          
                          <Button
                            onClick={() => handleJoinWebinar(event)}
                            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 mt-auto"
                          >
                            Join Webinar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden lg:flex -left-12 border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
              <CarouselNext className="hidden lg:flex -right-12 border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
            </Carousel>
          </div>
        )}

        {/* Inline Form */}
        {showForm && (
          <div className="mt-16 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-brand-50 to-slate-50 rounded-3xl p-8 border border-slate-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-black mb-2">
                  Request Invite to {selectedEvent?.title || 'Event'}
                </h3>
                <p className="text-slate-600">
                  Fill out the form below and we'll send you an invite.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="rounded-xl border-slate-300 focus:border-brand-500 focus:ring-brand-500/20"
                  />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="rounded-xl border-slate-300 focus:border-brand-500 focus:ring-brand-500/20"
                  />
                </div>
                
                <Input
                  type="text"
                  placeholder="Company / Title"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="rounded-xl border-slate-300 focus:border-brand-500 focus:ring-brand-500/20"
                />
                
                <Textarea
                  placeholder="Tell us about your startup or what you're working on..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="rounded-xl border-slate-300 focus:border-brand-500 focus:ring-brand-500/20"
                />
                
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  >
                    {isLoading ? 'Sending...' : 'Send Request'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="px-6 rounded-xl border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Registration Modal */}
        {showRegistrationModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
              {/* Close button */}
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal content */}
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-black mb-2">
                  Join Webinar
                </h3>
                <p className="text-slate-600">
                  {selectedEvent.title}
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(selectedEvent.event_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      timeZone: 'America/Chicago'
                    })}
                    {' @ '}
                    {new Date(selectedEvent.event_date).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                      timeZone: 'America/Chicago'
                    })}
                    {' CST'}
                  </span>
                </div>
              </div>

              <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="registrationEmail">Email Address *</Label>
                  <Input
                    id="registrationEmail"
                    type="email"
                    placeholder="you@company.com"
                    value={registrationEmail}
                    onChange={(e) => setRegistrationEmail(e.target.value)}
                    required
                    className="mt-1 border-2 border-slate-200 focus:border-brand-500 rounded-xl"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    You'll receive a calendar invite with the Google Meet link
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowRegistrationModal(false)}
                    className="flex-1 border-2 border-slate-200 hover:bg-slate-50 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !registrationEmail}
                    className="flex-1 bg-brand-600 hover:bg-brand-700 text-white rounded-xl"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Get Invite'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CCVEvents;