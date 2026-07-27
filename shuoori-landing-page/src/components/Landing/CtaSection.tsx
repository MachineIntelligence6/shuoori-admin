import { motion } from "framer-motion";
import Button from "../common/Button";

type CtaSectionProps = {
  t: {
    title: string;
    subtitle: string;
    primary: string;
    secondary: string;
  };
};

const CtaSection = ({ t }: CtaSectionProps) => {
  return (
    <section
      id="contact"
      className="py-20"
      style={{
        background:
          "linear-gradient(94.74deg, rgba(0, 163, 168, 0.85) -3.52%, #0381DF 100.64%)",
      }}
    >
      <motion.div
        className="mx-auto max-w-6xl px-6 text-center"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold text-white">{t.title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/80">
          {t.subtitle}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="filled"
            size="lg"
            className="!bg-white !text-primary hover:!opacity-95"
            style={{ background: "white" }}
          >
            {t.primary}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="!border-white !text-white hover:!bg-white/10"
          >
            {t.secondary}
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default CtaSection;
