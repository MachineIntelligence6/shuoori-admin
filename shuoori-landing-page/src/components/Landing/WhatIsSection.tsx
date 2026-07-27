import { Brain, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeading from "../common/SectionHeading";

type WhatIsSectionProps = {
  t: {
    title: string;
    body: string;
    cards: Array<{ title: string; description: string }>;
  };
  highlight: string;
};

const ICONS_BY_TITLE: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  علمي: Brain,
  متقدم: Sparkles,
  آمن: ShieldCheck,
};

/* Card order from design (RTL, so index 0 is rightmost = آمن, index 1 = متقدم, index 2 = علمي) */
const WhatIsSection = ({ t, highlight }: WhatIsSectionProps) => {
  return (
    <section id="what-is" className="bg-[#f7f7f7] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title={t.title}
          highlight={highlight}
          subtitle={t.body}
          align="center"
          showBackdrop={false}
          titleClassName="text-[44px] md:text-[56px] font-[800] text-[#121212]"
          className="mb-10"
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {t.cards.map((card, idx) => {
            const Icon = ICONS_BY_TITLE[card.title] ?? ShieldCheck;
            return (
              <motion.div
                key={card.title}
                className="flex flex-col items-center rounded-[20px] border border-[#e6e6e6] bg-white px-7 py-10 text-center shadow-[0_6px_24px_rgba(0,0,0,0.06)]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                {/* Icon circle */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#06c7cd40] bg-[#06c7cd12] text-primary">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-lg font-bold text-text-base">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#6b6b6b]">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatIsSection;
