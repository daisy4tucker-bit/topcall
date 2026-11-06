import React from 'react';
import { Eye, Plus, MessageCircle } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '1',
      icon: Eye,
      title: 'Browse Profiles',
      desc: 'Explore verified providers in your city.',
    },
    {
      num: '2',
      icon: Plus,
      title: 'View Details',
      desc: 'Check photos, rates, reviews and availability.',
    },
    {
      num: '3',
      icon: MessageCircle,
      title: 'Contact Directly',
      desc: 'Message or call providers directly. No agencies.',
    },
  ];

  return (
    <section className="bg-[#081528] border-b border-slate-800/80 py-14 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Simple, safe and direct. Connect with independent companions in just a few steps.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.num}
                className="flex flex-col items-center text-center space-y-4 group"
              >
                {/* White circular icon container */}
                <div className="w-16 h-16 rounded-full bg-white text-red-600 shadow-lg shadow-red-500/10 flex items-center justify-center transition-transform group-hover:scale-105">
                  <IconComponent className="w-7 h-7 stroke-[2.2]" />
                </div>

                {/* Step number badge & title */}
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
                      {step.num}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-xs leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
