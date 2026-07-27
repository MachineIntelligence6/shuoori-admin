import Button from "../common/Button";
import HeroVisual from "./HeroVisual";
import type { Locale } from "../../i18n";
import { motion } from "framer-motion";

type HeroSectionProps = {
  locale: Locale;
  t: {
    title: string;
    highlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
};

const HeroSection = ({ t }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden bg-[#f0f8ff] pb-0 pt-20">
      {/* Text Content */}
      <motion.div
        className="mx-auto max-w-6xl px-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="leading-[1.3] text-[56px] md:text-[64px] font-[800] pb-4">
          <span className="bg-gradient-to-l from-[#00A3A8] to-[#0461A8] bg-clip-text text-transparent inline-block">
            رحلتك{" "}
          </span>
          <span className="text-[#1A1A1A]"> نحو وعي ذاتي أعمق</span>
          <br />
          <span className="bg-gradient-to-l from-[#00A3A8] to-[#0461A8] bg-clip-text text-transparent inline-block mt-2">
            تبدأ هنا
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[18px] text-[#4C535A] leading-relaxed font-medium pb-4">
          {t.subtitle}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="filled"
            size="lg"
            className="!min-w-[200px] !px-8 !text-[16px] !rounded-[8px] !shadow-none"
          >
            <span className="btn-text">{t.ctaPrimary}</span>
            <svg
              className="btn-icon h-5 w-5 shrink-0"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 10H5M5 10L10 5M5 10L10 15" />
            </svg>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="!min-w-[200px] !px-8 !text-[16px] !rounded-[8px] !bg-[#F0F9FA] !text-[#18181A] !border-[#00A3A8] !border-[1.5px] !shadow-none"
          >
            <span className="btn-text">{t.ctaSecondary}</span>
          </Button>
        </div>
      </motion.div>

      {/* Hero Dashboard Visual */}
      <div className="relative mx-auto mt-8 max-w-6xl px-0 md:px-6 w-full">
        <HeroVisual />
      </div>
    </section>
  );
};

export default HeroSection;
