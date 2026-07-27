import { motion } from "framer-motion";
import SectionHeading from "../common/SectionHeading";

type StepItem = {
  number: string;
  title: string;
  description?: string;
};

type HowItWorksSectionProps = {
  t: {
    title: string;
    subtitle: string;
    items: StepItem[];
  };
  highlight: string;
};

const HowItWorksSection = ({ t, highlight }: HowItWorksSectionProps) => {
  return (
    <section className="bg-[#f0f4f8] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title={t.title}
          highlight={highlight}
          subtitle={t.subtitle}
          align="center"
        />

        <div
          className="relative mt-16 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-0"
          dir="rtl"
        >
          {t.items.map((step, idx) => {
            const isLast = idx === t.items.length - 1;

            return (
              <motion.div
                key={step.number}
                className="relative flex flex-1 flex-col items-center w-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
              >
                {/* Circle */}
                <div className="relative z-20 flex h-52 w-52 p-[2px] rounded-full bg-gradient-to-r from-[#00A3A8] to-[#0461A8] shadow-[0_14px_36px_rgba(0,0,0,0.08)]">
                  <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white px-4 text-center">
                    <span className="text-[36px] font-bold leading-none bg-gradient-to-r from-[#00A3A8] to-[#0461A8] bg-clip-text text-transparent">
                      {step.number}
                    </span>
                    <div className="mt-4">
                      <div className="text-[15px] font-semibold text-[#1a1a1a] leading-snug">
                        {step.title}
                      </div>
                      {step.description && (
                        <div className="mt-2 text-[12px] leading-relaxed text-[#5f5f5f]">
                          {step.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile Down Arrow */}
                {!isLast && (
                  <div className="lg:hidden flex items-center justify-center my-6">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#1a1a1a"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  </div>
                )}

                {/*
                                    Arrow sits at the LEFT edge of the circle gap.
                                    - Perfectly smooth hand-drawn cursive loops
                                    Position: vertically centered between circles
                                */}
                {!isLast && (
                  <div
                    className="absolute z-30 hidden lg:flex items-center justify-center pointer-events-none"
                    style={{
                      top: "60%",
                      left: "-15%" /* Gap is between circles, adjusted to reduce width */,
                      width:
                        "30%" /* Reduced width so it doesn't overlap borders */,
                      height: "60px",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <svg
                      viewBox="0 0 100 30"
                      fill="none"
                      className="w-full h-full overflow-visible"
                      preserveAspectRatio="none"
                    >
                      {/* Hand-drawn smooth cursive loops */}
                      <path
                        d="M 90 15 
                                                   C 75 0 80 30 65 15
                                                   C 50 0 55 30 40 15
                                                   C 25 0 25 15 15 15"
                        stroke="#1a1a1a"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                      {/* Arrowhead pointing left - Filled triangle matching design */}
                      <polygon
                        points="18,8 10,15 18,22"
                        fill="#1a1a1a"
                        stroke="#1a1a1a"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
