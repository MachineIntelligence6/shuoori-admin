import { motion } from "framer-motion";

type StatItem = {
  value: string;
  label: string;
};

type StatsBarProps = {
  stats: StatItem[];
};

const StatsBar = ({ stats }: StatsBarProps) => {
  return (
    <section className="py-10">
      <motion.div
        className="mx-auto max-w-6xl px-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="rounded-[20px] bg-gradient-to-r from-[#00A3A8] to-[#0461A8] p-[1.5px] shadow-[0_8px_30px_rgba(4,97,168,0.04)]">
          <div className="rounded-[18px] bg-white px-10 py-8">
            <div className="grid grid-cols-3 divide-x divide-[#d9d9d9] rtl:divide-x-reverse">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  className="flex flex-col items-center gap-2 px-4 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <span className="text-[32px] font-semibold bg-gradient-to-r from-[#00A3A8] to-[#0461A8] bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                  <span className="text-[14px] font-medium text-[#737373]">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default StatsBar;
