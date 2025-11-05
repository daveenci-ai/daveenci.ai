
import React from 'react';
import { Calendar, Map, BookOpen, TrendingUp } from 'lucide-react';

const EcosystemCard = ({ icon, title, description, status }) => {
  return (
    <div className="group bg-stone-50 hover:bg-white p-8 rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all duration-300 cursor-pointer">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 group-hover:text-black transition-colors">{title}</h3>
      <p className="text-stone-600 mb-4">{description}</p>
      <span className="inline-block px-3 py-1 text-sm font-medium bg-stone-200 text-stone-700 rounded-full">
        {status}
      </span>
    </div>
  );
};

const CCVEcosystem = () => {
  return (
    <section id="ecosystem" className="py-20 px-6 lg:px-8 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">Ecosystem Projects</h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Building the future of Austin's startup ecosystem
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EcosystemCard
            icon={<Calendar className="h-10 w-10 text-stone-700" />}
            title="Austin Founder Lesson Series"
            description="Weekly sessions for local founders"
            status="Live"
          />
          
          <EcosystemCard
            icon={<Map className="h-10 w-10 text-stone-700" />}
            title="VC & Operator Map"
            description="Interactive Austin ecosystem mapping"
            status="In Development"
          />
          
          <EcosystemCard
            icon={<BookOpen className="h-10 w-10 text-stone-700" />}
            title="Build-to-Fund Guide"
            description="Comprehensive fundraising playbook"
            status="Coming Soon"
          />
          
          <EcosystemCard
            icon={<TrendingUp className="h-10 w-10 text-stone-700" />}
            title="Syndicate & Scout Program"
            description="Investment opportunities for operators"
            status="Q4 2025 Launch"
          />
        </div>
      </div>
    </section>
  );
};

export default CCVEcosystem;
