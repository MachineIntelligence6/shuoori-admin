import { motion } from "framer-motion";
import SectionHeading from "../common/SectionHeading";

import logo1 from "../../assets/1.png";
import logo2 from "../../assets/2.png";
import logo3 from "../../assets/3.png";
import logo4 from "../../assets/4.png";

type TrustedSectionProps = {
  t: {
    title: string;
    subtitle: string;
  };
};

const TrustedSection = ({ t }: TrustedSectionProps) => {
  return (
    <section id="trusted" className="bg-[#f8fbff] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading title={t.title} subtitle={t.subtitle} align="center" />

        <div className="mt-14 flex flex-wrap items-center justify-center gap-6">
          {[{ img: logo1 }, { img: logo2 }, { img: logo3 }, { img: logo4 }].map(
            ({ img }, idx) => (
              <motion.div
                key={idx}
                className="flex h-20 w-40 items-center justify-center rounded-xl border border-[#d9e6f2] bg-white shadow-[0_6px_18px_rgba(4,97,168,0.08)] px-4"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <img
                  src={img}
                  alt={`Trusted Company ${idx + 1}`}
                  className="max-h-12 w-auto object-contain"
                />
              </motion.div>
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default TrustedSection;
