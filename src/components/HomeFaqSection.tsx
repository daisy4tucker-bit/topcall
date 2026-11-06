import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export const HomeFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "What's the difference between shemale, trans and TS escorts?",
      a: 'The terms "shemale", "trans", and "TS" (transsexual) are commonly used search labels within online escort directories referring to transgender women and trans feminine adult companions. Terminology preferences vary by individual provider, but all listed independent companions offer professional adult accompaniment services.',
    },
    {
      q: 'Is it free to browse?',
      a: 'Yes, 100% free. Browsing verified profiles, photos, rates, listed services, and direct contact details does not require any paid subscription or mandatory account registration.',
    },
    {
      q: 'Are the profiles verified?',
      a: 'Yes. Verified profiles on this directory complete government-issued photo ID age checks (strictly 18+) and biometric photo verification to eliminate fake profiles, stolen photography, and catfishing.',
    },
    {
      q: 'How often are new escorts added?',
      a: 'New independent trans companion profiles are submitted, verified, and published on a daily basis across metropolitan regions and cities nationwide.',
    },
    {
      q: 'How do I contact an independent provider directly?',
      a: 'Click on any companion profile to view their published direct contact channels, including SMS text number, verified messaging links, rates, and preferred booking policies. There are no agencies or intermediaries.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="bg-[#060f1c] border-b border-slate-800/80 py-14 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Answers to common questions about browsing and connecting with independent companions.
          </p>
        </div>

        {/* Clean Accordion List */}
        <div className="border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800 bg-[#081528] shadow-xl">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-slate-200 hover:text-white transition cursor-pointer"
                >
                  <span className="pr-4">{item.q}</span>
                  <span className="text-red-500 shrink-0">
                    {isOpen ? <Minus className="w-5 h-5 stroke-[2.5]" /> : <Plus className="w-5 h-5 stroke-[2.5]" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed animate-in fade-in">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
