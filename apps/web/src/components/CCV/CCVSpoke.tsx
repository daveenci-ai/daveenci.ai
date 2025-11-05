
import React from 'react';
import { Button } from '@/components/ui/button';
import { Code, Zap, Database, Brain, ArrowRight } from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 border border-slate-200 hover:shadow-md transition-all duration-300">
    <div className="w-14 h-14 bg-slate-100 flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-medium text-black mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

const CCVSpoke = () => {
  const handleRequestQuote = () => {
    window.open('https://gospoke.co/', '_blank');
  };

  return (
    <section id="spoke" className="py-24 px-6 lg:px-8 bg-white">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-6 tracking-tight">
            Development Partnership
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            We've partnered with a team of senior engineers to deliver custom development solutions for ambitious founders
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <FeatureCard
            icon={<Code className="h-7 w-7 text-slate-700" />}
            title="No-Code SaaS MVPs"
            description="Rapid prototyping and validation tools built without traditional development overhead"
          />
          
          <FeatureCard
            icon={<Database className="h-7 w-7 text-slate-700" />}
            title="Full-Stack Internal Tools"
            description="Custom dashboards, admin panels, and workflow automation tailored to your operations"
          />
          
          <FeatureCard
            icon={<Brain className="h-7 w-7 text-slate-700" />}
            title="AI-Powered Workflows"
            description="Intelligent automation that learns from your processes and scales with your growth"
          />
          
          <FeatureCard
            icon={<Zap className="h-7 w-7 text-slate-700" />}
            title="Analytics Dashboards"
            description="Real-time analytics and monitoring solutions for technical and business metrics"
          />
        </div>
        
        <div className="text-center">
          <div className="bg-slate-50 p-12">
            <h3 className="text-2xl font-medium text-black mb-4">
              Ready to Build Something Exceptional?
            </h3>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              From concept to deployment, we handle the technical complexity while you focus on growing your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleRequestQuote}
                className="bg-black text-white hover:bg-slate-800 px-8 py-4 text-lg rounded-none font-medium"
              >
                Request Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={handleRequestQuote}
                className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg rounded-none font-medium"
              >
                View Portfolio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CCVSpoke;
