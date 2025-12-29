
import React from 'react';
import { ShieldCheck, Zap, Globe, Lock } from 'lucide-react';

interface SEOContentProps {
  toolName: string;
  description: string;
  benefits: string[];
  faq: { q: string; a: string }[];
}

const SEOContent: React.FC<SEOContentProps> = ({ toolName, description, benefits, faq }) => {
  return (
    <div className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 space-y-16 animate-in fade-in duration-1000">
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white text-center">About {toolName}</h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed text-center">
          {description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                {i % 2 === 0 ? <ShieldCheck className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
              </div>
              <p className="font-bold text-slate-800 dark:text-slate-200">{benefit}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-950 rounded-[3rem] p-12 max-w-4xl mx-auto border border-slate-200 dark:border-slate-800">
        <h3 className="text-2xl font-bold mb-10 flex items-center gap-3">
          <Globe className="w-6 h-6 text-blue-500" />
          Common Questions (FAQ)
        </h3>
        <div className="space-y-8">
          {faq.map((item, i) => (
            <div key={i} className="space-y-2">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">{item.q}</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center py-10">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 font-bold text-sm">
          <Lock className="w-4 h-4" />
          <span>100% Secure Client-Side Encryption Enabled</span>
        </div>
      </div>
    </div>
  );
};

export default SEOContent;
