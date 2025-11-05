
import React from 'react';
import { CheckCircle, BarChart3, Users, TrendingUp } from 'lucide-react';

const OfferCard = ({ icon, title, description }) => (
  <div className="cc-card flex gap-6 p-8 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 group">
    <div className="flex-shrink-0">
      <div className="w-14 h-14 bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors duration-300">
        {icon}
      </div>
    </div>
    <div className="cc-card__body space-y-3">
      <h3 className="text-xl font-medium text-black">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-lg">{description}</p>
    </div>
  </div>
);

const CCVWhatWeOffer = () => {
  return (
    <section className="py-32 px-6 lg:px-8 bg-white">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-12 gap-8 mb-20">
          <div className="col-span-12 lg:col-span-8 lg:col-start-3 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-8 tracking-tight leading-tight">
              What We Automate
            </h2>
          </div>
        </div>
        
        <div className="cc-card-grid grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div>
            <OfferCard
              icon={<BarChart3 className="h-7 w-7 text-green-600" />}
              title="AI Strategy & Roadmaps"
              description="Identify the highest-ROI automations, quantify impact, and ship a 90-day build plan."
            />
          </div>
          
          <div>
            <OfferCard
              icon={<Users className="h-7 w-7 text-green-600" />}
              title="Workflow Automation"
              description="Design event-driven processes that trigger agents, orchestrate tasks, and close loops with humans-in-the-loop."
            />
          </div>
          
          <div>
            <OfferCard
              icon={<TrendingUp className="h-7 w-7 text-green-600" />}
              title="Data & Integration"
              description="Connect apps, unify data, and implement RAG/feature stores so AI has the context to act."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CCVWhatWeOffer;
