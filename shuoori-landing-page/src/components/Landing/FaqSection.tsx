import { useState } from "react";
import faqImage from "../../assets/faq.png";
import { motion } from "framer-motion";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqSectionProps = {
  t: {
    title: string;
    subtitle: string;
    items: FaqItem[];
  };
  highlight?: string;
};

const FaqSection = ({ t, highlight }: FaqSectionProps) => {
  // Split title to highlight the specific word
  const parts = highlight ? t.title.split(highlight) : [t.title];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#f5fbff] py-24 relative overflow-hidden" dir="rtl">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-12 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[44px] font-bold text-[#1a1a1a] mb-4">
            {highlight && parts.length > 1 ? (
              <>
                {parts[0]}
                <span className="text-[#00A3A8]">{highlight}</span>
                {parts[1]}
              </>
            ) : (
              t.title
            )}
          </h2>
          <p className="text-[17px] text-[#5f5f5f] max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual Right in RTL (Image is Left, Accordion is Right)
                        Because it's grid and dir="rtl", col 1 is visual right, col 2 is visual left.
                    */}

          {/* Visual Right (Accordion) */}
          <motion.div
            className="flex flex-col gap-4 order-2 lg:order-1"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t.items.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-lg transition-all duration-300 overflow-hidden bg-white border ${
                    isOpen
                      ? "border-[#00a3a8] shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <button
                    onClick={() => toggleOpen(idx)}
                    className="w-full flex items-center p-5 text-right focus:outline-none"
                  >
                    <span className="text-[16px] font-bold text-[#00A3A8] flex-1 leading-tight">
                      {item.question}
                    </span>
                    <div className="ml-0 mr-4 shrink-0">
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#00A3A8]" : "text-gray-400"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Answer Dropdown */}
                  <div
                    className={`px-5 text-[#5f5f5f] text-[15px] leading-relaxed transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "max-h-[500px] pb-5 opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    <p>{item.answer}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Visual Left (Image) */}
          <motion.div
            className="flex justify-center lg:justify-end order-1 lg:order-2 w-full"
            initial={{ opacity: 0, scale: 0.9, x: -30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.img
              src={faqImage}
              alt="FAQ illustration"
              className="w-full max-w-[500px] object-contain drop-shadow-sm"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
