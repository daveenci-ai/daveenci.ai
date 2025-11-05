
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, ExternalLink, FileText, Zap, Users } from 'lucide-react';

interface OfferingCardProps {
  icon: React.ReactElement;
  title: string;
  subtitle?: string;
  description: string;
  price?: string;
  features: string[];
  ctaText: string;
  ctaAction: () => void;
  isHighlighted?: boolean;
}

const OfferingCard = ({ 
  icon, 
  title, 
  subtitle, 
  description, 
  price, 
  features, 
  ctaText, 
  ctaAction,
  isHighlighted = false 
}: OfferingCardProps) => {
  return (
    <div className={`cc-offering-card ${
      isHighlighted ? 'border-black' : 'border-slate-200'
    }`}>
      <div className="cc-offering-card__content">
        <div className="cc-offering-card__body space-y-6">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-slate-100 flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h3 className="text-2xl font-medium text-black tracking-tight">{title}</h3>
              {subtitle && <p className="text-lg text-slate-500 mt-1">{subtitle}</p>}
              {price && <p className="text-3xl font-light text-black mt-2">{price}</p>}
            </div>
          </div>
          
          <p className="text-lg text-slate-600 leading-relaxed">{description}</p>
          
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-slate-400 mt-3 flex-shrink-0"></div>
                <span className="text-slate-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="cc-offering-card__cta">
          <Button 
            onClick={ctaAction}
            className="w-full bg-black text-white hover:bg-slate-800 py-4 text-lg font-medium rounded-none"
          >
            {ctaText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const CCVOfferings = () => {
  const handleBookCall = () => {
    const bookingSection = document.getElementById('booking');
    bookingSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSpokeQuote = () => {
    window.open('https://gospoke.co/', '_blank');
  };

  const handleNewsletter = () => {
    const newsletterSection = document.getElementById('newsletter');
    newsletterSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="offerings" className="py-24 px-6 lg:px-8 bg-white">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-6 tracking-tight">
            Services & Advisory
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive support for founders at every stage of their journey
          </p>
        </div>
        
        <div className="cc-offering-grid grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <OfferingCard
            icon={<Calendar className="h-8 w-8 text-slate-700" />}
            title="AI Strategy Sprint"
            description="2 weeks to align stakeholders, score use cases, and deliver a 90-day roadmap."
            features={[
              "Stakeholder alignment sessions",
              "Use case scoring & prioritization", 
              "90-day implementation roadmap",
              "ROI projections & success metrics"
            ]}
            ctaText="See Sprint Outline"
            ctaAction={handleBookCall}
            isHighlighted={true}
          />
          
          <OfferingCard
            icon={<Zap className="h-8 w-8 text-slate-700" />}
            title="Intelligent Workflow Design"
            description="Map processes, surface data events, and define when agents act vs. humans approve."
            features={[
              "Process mapping & documentation",
              "Event-driven architecture design",
              "Agent vs. human decision boundaries",
              "Approval & escalation workflows"
            ]}
            ctaText="Explore Workflows"
            ctaAction={handleBookCall}
          />
          
          <OfferingCard
            icon={<Users className="h-8 w-8 text-slate-700" />}
            title="Custom AI Development"
            description="Build copilots, agents, and integrations using your stack and security model."
            features={[
              "Custom AI copilots & agents",
              "API & system integrations",
              "Your tech stack & security model",
              "Production-ready deployments"
            ]}
            ctaText="Start a Build"
            ctaAction={handleSpokeQuote}
          />
          
          <OfferingCard
            icon={<FileText className="h-8 w-8 text-slate-700" />}
            title="Automation Operating System"
            description="A modular foundation for prompts, policies, connectors, RAG, and observability."
            features={[
              "Prompt & policy libraries",
              "Pre-built connectors & integrations",
              "RAG & feature store setup",
              "Observability & monitoring tools"
            ]}
            ctaText="View the OS"
            ctaAction={handleBookCall}
          />
          
          <OfferingCard
            icon={<ExternalLink className="h-8 w-8 text-slate-700" />}
            title="Enablement & Training"
            description="Hands-on sessions for ops, support, sales, and product teams to adopt AI safely."
            features={[
              "Operations & support training",
              "Sales enablement workshops",
              "Product team AI adoption",
              "Safe AI usage guidelines"
            ]}
            ctaText="See Curriculum"
            ctaAction={handleBookCall}
          />
          
          <OfferingCard
            icon={<FileText className="h-8 w-8 text-slate-700" />}
            title="Monitoring & Improvement"
            description="Track quality, cost, and drift with human-feedback loops and auto-tests."
            features={[
              "Quality & cost tracking",
              "Model drift detection",
              "Human-feedback loops",
              "Automated test suites"
            ]}
            ctaText="View Monitoring"
            ctaAction={handleNewsletter}
          />
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-slate-50 px-8 py-4">
            <span className="text-lg text-slate-600">Ready to get started?</span>
            <Button 
              onClick={handleBookCall}
              className="bg-black text-white hover:bg-slate-800 px-6 py-2 rounded-none font-medium"
            >
              Schedule a Call
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CCVOfferings;
