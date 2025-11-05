
import React from 'react';
import { AlertTriangle, TrendingDown, Search } from 'lucide-react';

const PainPointCard = ({ icon, title, description }) => (
  <div className="cc-card flex gap-6 p-8 bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-lg group">
    <div className="flex-shrink-0">
      <div className="w-14 h-14 bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors duration-300">
        {icon}
      </div>
    </div>
    <div className="cc-card__body space-y-3">
      <h3 className="text-xl font-medium text-black">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-lg">{description}</p>
    </div>
  </div>
);

const CCVPainPoints = () => {
  return (
    <section className="py-32 px-6 lg:px-8 bg-slate-50">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-12 gap-8 mb-20">
          <div className="col-span-12 lg:col-span-8 lg:col-start-3 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-8 tracking-tight leading-tight">
              Where Teams Get Stuck With AI
            </h2>
          </div>
        </div>
        
        <div className="cc-card-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <div>
            <PainPointCard
              icon={<TrendingDown className="h-7 w-7 text-red-600" />}
              title="Too Many Tools, No Strategy"
              description="Pilots pop up everywhere, but nothing connects to outcomes. We align AI work to revenue, margin, and customer experience."
            />
          </div>
          
          <div>
            <PainPointCard
              icon={<AlertTriangle className="h-7 w-7 text-red-600" />}
              title="Messy Data, Weak Signals"
              description="Your data lives in silos. We unify it and apply retrieval + event pipelines so models act on clean, timely context."
            />
          </div>
          
          <div>
            <PainPointCard
              icon={<Search className="h-7 w-7 text-red-600" />}
              title="Manual Work Slows Everything"
              description="Repetitive tasks eat cycles. We automate approvals, handoffs, reporting, and customer ops so teams focus on high-leverage work."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CCVPainPoints;
