
import React from 'react';
import { Users, Search, Settings, Package, Mic } from 'lucide-react';

interface WorkCardProps {
  icon: React.ReactElement;
  title: string;
  description: string;
  price?: string;
  features: string[];
}

const WorkCard = ({ icon, title, description, price, features }: WorkCardProps) => {
  return (
    <div className="bg-white p-8 rounded-xl border border-stone-200 hover:shadow-lg transition-all duration-300 h-full">
      <div className="mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      {price && (
        <p className="text-2xl font-bold text-stone-800 mb-4">{price}</p>
      )}
      <p className="text-stone-600 mb-6">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-stone-400 mt-2 flex-shrink-0"></div>
            <span className="text-stone-600">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CCVWork = () => {
  return (
    <section id="work" className="py-20 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">My Work</h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Comprehensive support for founders at every stage of their journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <WorkCard
            icon={<Users className="h-10 w-10 text-stone-700" />}
            title="Founder Advisory"
            price="Starting at $250"
            description="1:1 Clarity Sessions"
            features={[
              "Roadmap strategy",
              "MVP development guidance", 
              "GTM strategy",
              "Quick async reviews"
            ]}
          />
          
          <WorkCard
            icon={<Search className="h-10 w-10 text-stone-700" />}
            title="Fractional Product & Capital Support"
            price="$1,150–$4,200/month"
            description="Monthly retainers"
            features={[
              "Work alongside design/dev teams",
              "Fundraising prep",
              "Investor decks",
              "SAFE guidance"
            ]}
          />
          
          <WorkCard
            icon={<Settings className="h-10 w-10 text-stone-700" />}
            title="Embedded Solutions"
            price="via Spoke"
            description="Product + full-stack build support under my strategic lead"
            features={[
              "Ideal for startups without a product co-founder",
              "End-to-end development",
              "Strategic oversight",
              "Technical leadership"
            ]}
          />
          
          <WorkCard
            icon={<Package className="h-10 w-10 text-stone-700" />}
            title="Founder Operating System"
            description="Templates, tools, and systems for managing funding, investor updates, deal flow, and launch"
            features={[
              "Notion-based system",
              "Updated weekly",
              "Comprehensive templates",
              "Workflow automation"
            ]}
          />
          
          <WorkCard
            icon={<Mic className="h-10 w-10 text-stone-700" />}
            title="Workshops & Content"
            description="Live sessions and weekly newsletter"
            features={[
              "AI, GTM, Fundraising workshops",
              "VC + Economic Intelligence newsletter",
              "Austin-specific content",
              "Content sponsorships"
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default CCVWork;
