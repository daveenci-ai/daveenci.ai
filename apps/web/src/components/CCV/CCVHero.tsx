
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';

const CCVHero = () => {
  const handleBookCall = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-width background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero.png" 
          alt="AI robotic arm with circuit board visualization - DaVeenci automation" 
          className="w-full h-full object-cover object-center"
        />
        {/* Darker gradient on left side for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent"></div>
      </div>
      
      {/* Content container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 lg:col-span-7 space-y-8 animate-fade-in">
            <div className="space-y-6">
              <div className="hidden md:inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-white/90 font-medium">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Strategy • Systems • Scale
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight text-white leading-[0.95] drop-shadow-2xl">
                Clarity on AI.
                <br />
                <span className="font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Automation that Ships.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/90 leading-relaxed max-w-3xl font-light drop-shadow-lg">
                We design and deliver AI copilots and automated workflows that cut manual work, unlock your data, and move key metrics in weeks—not quarters.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button 
                  onClick={handleBookCall}
                  className="bg-white text-black hover:bg-white/90 px-8 py-5 text-base md:text-lg h-auto font-semibold transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-white/25 group"
                >
                  <Calendar className="mr-2 h-4 w-4 md:h-5 md:w-5 group-hover:rotate-12 transition-transform" />
                  Book an AI Strategy Call
                </Button>
                <Button 
                  onClick={() => scrollToSection('offerings')}
                  variant="outline" 
                  className="border-2 border-white/50 text-white hover:bg-white hover:text-black px-8 py-5 text-base md:text-lg h-auto font-semibold transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm bg-white/10"
                >
                  See AI Playbooks
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CCVHero;
