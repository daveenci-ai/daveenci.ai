
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, TrendingUp, CheckCircle2 } from 'lucide-react';

const CCVNewsletter = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [interests, setInterests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, interests }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      setIsSuccess(true);
      setName('');
      setEmail('');
      setInterests('');

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setError('Failed to subscribe. Please try again or contact astrid@daveenci.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="newsletter" className="py-32 px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-8 mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-black to-slate-800 rounded-2xl shadow-xl">
            <Mail className="h-12 w-12 text-white" />
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black tracking-tight leading-tight">
              Automation Insider Newsletter
            </h2>
            <div className="space-y-4">
              <p className="text-2xl text-slate-700 font-light">
                Monthly field notes on AI agents, workflow design, and measurable wins.
              </p>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Strategic insights, tactical frameworks, and real-world case studies for AI automation
              </p>
              <div className="flex items-center justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-full">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">Ship AI in weeks, not quarters</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-800 bg-brand-50 px-4 py-2 rounded-full">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">No spam. Unsubscribe anytime.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-12 shadow-2xl border border-slate-200 hover:shadow-3xl transition-shadow duration-500">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Your Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors duration-200 text-lg font-medium hover:border-slate-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors duration-200 text-lg font-medium hover:border-slate-300"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">What interests you most?</label>
              <select
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full px-6 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors duration-200 text-lg font-medium hover:border-slate-300"
              >
                <option value="">Choose your focus area</option>
                <option value="ai-strategy">AI Strategy & Roadmaps</option>
                <option value="workflow-automation">Workflow Automation</option>
                <option value="data-integration">Data & Integration</option>
                <option value="all">Everything (Recommended)</option>
              </select>
            </div>
            
            {isSuccess && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 flex items-center justify-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <p className="text-green-700 font-semibold text-lg">
                  Successfully subscribed! Check your email for confirmation.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <p className="text-red-700 text-center">{error}</p>
              </div>
            )}
            
            <div className="flex justify-center pt-6">
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-white hover:bg-slate-800 px-10 py-4 text-lg rounded-xl font-semibold transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Subscribing...' : 'Get Monthly Notes'}
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CCVNewsletter;
