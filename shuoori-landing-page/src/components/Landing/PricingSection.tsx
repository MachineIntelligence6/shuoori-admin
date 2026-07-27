import { useState } from "react";
import Button from "../common/Button";

type PricingPlan = {
  name: string;
  subtitle?: string;
  price: string;
  priceYearly?: string;
  features: string[];
  cta: string;
  badge?: string;
  featured?: boolean;
};

type PricingSectionProps = {
  t: {
    title: string;
    subtitle: string;
    toggleMonthly: string;
    toggleYearly: string;
    save: string;
    plans: PricingPlan[];
  };
};

const CheckmarkIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" className="h-[14px] w-[14px] shrink-0">
    <path
      d="M3 8l3.5 3.5L13 4.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PricingSection = ({ t }: PricingSectionProps) => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="bg-[#f5fbff] py-24" dir="rtl">
      <div className="mx-auto max-w-[1100px] px-6">
        {/* Heading */}
        <div className="relative flex flex-col items-center text-center">
          <h2 className="text-[44px] font-bold text-[#1a1a1a] mb-3">
            {t.title}
          </h2>
          <p className="text-[17px] text-[#5f5f5f]">{t.subtitle}</p>
        </div>

        {/* Toggle */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <span
            className={`text-[17px] font-medium ${!isYearly ? "text-[#1a1a1a]" : "text-[#5f5f5f]"}`}
          >
            {t.toggleMonthly}
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative h-8 w-16 rounded-full bg-[#0070B8] transition-colors flex items-center overflow-visible"
            aria-checked={isYearly}
            role="switch"
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-all duration-300 ${
                isYearly ? "start-9" : "start-1"
              }`}
            />
          </button>
          <span
            className={`text-[17px] font-medium ${isYearly ? "text-[#1a1a1a]" : "text-[#5f5f5f]"}`}
          >
            {t.toggleYearly}
          </span>
          <span className="text-[17px] font-bold text-[#0070B8] mr-1">
            {t.save}
          </span>
        </div>

        {/* Cards */}
        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
          {t.plans.map((plan, idx) => {
            const isFeatured = plan.featured;
            const isFreePlan = idx === 2; // الخطة المجانية is the last one

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-[2.5rem] bg-white p-1 pb-1 pt-1 z-10 ${!isFeatured ? "shadow-[0_4px_30px_rgba(0,0,0,0.03)]" : ""}`}
              >
                {/* Gradient Wrapper for Featured Card */}
                {isFeatured && (
                  <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#00A3A8] to-[#0461A8] p-[1.5px] -z-10" />
                )}

                <div className="flex flex-col flex-1 rounded-[2.4rem] bg-white pt-10 px-8 pb-10">
                  <div className="flex flex-col items-center text-center mb-6">
                    {/* Popular badge */}
                    {plan.badge && (
                      <div className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#00A3A8] to-[#0461A8] px-4 py-1.5 text-[14px] font-bold text-white shadow-[0_4px_14px_rgba(0,163,168,0.3)] mb-4 ring-2 ring-[#00A3A8]/20 ring-offset-2">
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {plan.badge}
                      </div>
                    )}
                    <h3
                      className={`text-[28px] font-bold mb-2 ${isFeatured ? "bg-gradient-to-r from-[#00A3A8] to-[#0461A8] bg-clip-text text-transparent" : "text-[#1a1a1a]"}`}
                    >
                      {plan.name}
                    </h3>
                    <p className="text-[15px] text-[#5f5f5f]">
                      {plan.subtitle}
                    </p>
                  </div>

                  <div className="w-full flex justify-center mb-6">
                    <div className="w-2/3 border-t border-gray-100" />
                  </div>

                  {/* Price */}
                  <div className="flex justify-center items-end gap-1 mb-8">
                    <span className="text-[34px] font-bold text-[#1a1a1a] leading-none">
                      {plan.price}
                    </span>
                    <span className="text-[15px] font-medium text-[#1a1a1a] mb-1">
                      / شهرياً
                    </span>
                  </div>

                  {/* Features label for Free Plan */}
                  {isFreePlan && (
                    <div className="w-full bg-[#f4faf9] py-3 px-4 rounded-xl mb-6 text-center">
                      <span className="text-[16px] font-bold text-[#1a1a1a]">
                        المعلومات الأساسية
                      </span>
                    </div>
                  )}

                  {/* Feature list */}
                  <ul className="flex-1 space-y-4 mb-10 w-full mt-2">
                    {plan.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start justify-start gap-3"
                      >
                        <span className="mt-[4px] text-[#00A3A8]">
                          <CheckmarkIcon />
                        </span>
                        <span className="text-[14px] font-medium text-[#5f5f5f] leading-snug text-right text-balance">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <div className="mt-auto pt-4 w-full">
                    {isFeatured ? (
                      <Button
                        variant="filled"
                        className="w-full justify-center rounded-xl h-[46px] text-[15px] font-semibold bg-[#0070B8] hover:bg-[#005a96] border-none"
                      >
                        {plan.cta}
                      </Button>
                    ) : (
                      <button className="w-full justify-center rounded-xl h-[46px] text-[15px] font-semibold flex items-center border border-[#00A3A8] bg-[#eef8fb] text-[#00A3A8] hover:bg-[#e0f2f7] transition-colors">
                        {plan.cta}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
