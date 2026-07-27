import Button from "../common/Button";
import relaxingWoman from "../../assets/relax.jpg";
import { motion } from "framer-motion";

type WhyChooseSectionProps = {
  t: {
    title: string;
    body: string;
    bullets: string[];
    cta: string;
  };
  highlight: string;
};

const WhyChooseSection = ({ t, highlight }: WhyChooseSectionProps) => {
  // Split the title precisely to separate 'لماذا تختار' from 'منصة شعوري؟'
  const parts = t.title.split(highlight);

  return (
    <section className="bg-[#f5fbff] py-24 relative overflow-hidden" dir="rtl">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text Side (Right in RTL, so order-1) */}
          <motion.div
            className="order-1 flex flex-col items-start text-right lg:pr-12"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="text-[44px] font-bold leading-tight text-[#1a1a1a]">
              {parts[0]}
              <span className="inline-block bg-gradient-to-r from-[#00A3A8] to-[#0461A8] bg-clip-text text-transparent">
                {highlight}
              </span>
              {parts[1]}
            </h2>
            <p className="mt-4 text-[16px] text-[#5f5f5f] max-w-[450px]">
              {t.body}
            </p>

            <ul className="mt-12 space-y-6">
              {t.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-center justify-start gap-4"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border border-[#00A3A8] text-[#00A3A8]">
                    <svg
                      viewBox="0 0 14 14"
                      fill="none"
                      className="h-3.5 w-3.5"
                    >
                      <path
                        d="M3 7.5L5.5 10L11 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-[17px] font-semibold text-[#1a1a1a]">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-12 w-full flex justify-start">
              <Button
                variant="filled"
                size="lg"
                className="rounded-xl px-7 h-12 text-[16px]"
              >
                <span className="flex items-center gap-2">
                  {t.cta}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5 mr-1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ direction: "ltr", transform: "scaleX(-1)" }}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </Button>
            </div>
          </motion.div>

          {/* Image Side (Left in RTL, so order-2) */}
          <motion.div
            className="relative order-2 flex justify-center lg:justify-start lg:pl-4"
            initial={{ opacity: 0, scale: 0.95, x: -40 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative w-full max-w-[440px]">
              {/* Thin tilted border frame around the image */}
              <div className="absolute -inset-3 -rotate-[4deg] rounded-lg border-[1.5px] border-[#00A3A8] pointer-events-none" />

              {/* Image (straight or slightly tilted) */}
              <div className="relative z-10 overflow-hidden rounded-lg bg-white shadow-soft">
                <img
                  src={relaxingWoman}
                  alt="Shuoory platform experience"
                  className="h-[460px] w-full object-cover rounded-sm"
                />
                {/* Decorative wave overlay over the image as exactly in design */}
                <div className="absolute inset-0 top-1/2 -translate-y-[40%] flex w-full items-center justify-center opacity-80 pointer-events-none">
                  <svg
                    viewBox="0 0 400 300"
                    className="h-full w-full scale-[1.3]"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    <path
                      d="M-50 150 Q50 50 200 150 T450 150"
                      stroke="#00A3A8"
                      strokeWidth="1"
                      fill="none"
                      opacity="0.6"
                    />
                    <path
                      d="M-50 160 Q50 60 200 160 T450 160"
                      stroke="#ffffff"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.8"
                    />
                    <path
                      d="M-50 170 Q50 70 200 170 T450 170"
                      stroke="#eab308"
                      strokeWidth="1.5"
                      fill="none"
                      opacity="0.5"
                    />
                    <path
                      d="M-50 140 Q50 40 200 140 T450 140"
                      stroke="#ffffff"
                      strokeWidth="1"
                      fill="none"
                      opacity="0.4"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
