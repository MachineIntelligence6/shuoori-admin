import test1 from "../../assets/test1.png";
import test2 from "../../assets/test2.png";
import { motion } from "framer-motion";

const imageMap: Record<string, string> = {
  test1,
  test2,
};

type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  image?: string;
};

type TestimonialsProps = {
  t: {
    title: string;
    subtitle: string;
    items: TestimonialItem[];
  };
};

const TestimonialsSection = ({ t }: TestimonialsProps) => {
  return (
    <section className="bg-[#f0f7fb] py-24 relative overflow-hidden" dir="rtl">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[44px] font-bold text-[#1a1a1a] mb-4">
            {t.title}
          </h2>
          <p className="text-[17px] text-[#5f5f5f] max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Carousel Container */}
        <motion.div
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Right arrow */}
          <button className="absolute -right-4 lg:-right-10 z-20 focus:outline-none hover:opacity-60 transition-opacity hidden md:flex text-[#1a1a1a]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Left arrow */}
          <button className="absolute -left-4 lg:-left-10 z-20 focus:outline-none hover:opacity-60 transition-opacity hidden md:flex text-[#1a1a1a]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full">
            {t.items.map((item, idx) => (
              <div
                key={idx}
                className="relative bg-white rounded-3xl border border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.06)] overflow-hidden flex"
                style={{ height: "240px" }}
              >
                {/* LEFT: person image — anchored top-left, full card height, no clip */}
                <div
                  className="relative flex-shrink-0"
                  style={{ width: "200px" }}
                >
                  {item.image && imageMap[item.image] && (
                    <img
                      src={imageMap[item.image]}
                      alt={item.name}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "top center",
                      }}
                    />
                  )}
                </div>

                {/* RIGHT: text content */}
                <div className="flex flex-col flex-1 px-8 lg:px-10 py-8 justify-between">
                  {/* Quote text */}
                  <p className="text-[15px] lg:text-[16px] font-medium leading-[1.85] text-[#555] text-right">
                    "{item.quote}"
                  </p>

                  {/* Bottom row: name+role right | quote icon left */}
                  <div className="flex items-end justify-between mt-4">
                    {/* Name & role */}
                    <div className="text-right">
                      <h4 className="text-[17px] font-bold text-[#1a1a1a] mb-0.5">
                        {item.name}
                      </h4>
                      <p className="text-[13px] text-[#5f5f5f]">{item.role}</p>
                    </div>

                    {/* Quote icon */}
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#a8f0ec"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0 opacity-90"
                    >
                      <path d="M10 11h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4q0 4-4 6z" />
                      <path d="M20 11h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4q0 4-4 6z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pagination dots */}
        <div className="flex items-center justify-center gap-2 mt-14">
          <div className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1] cursor-pointer hover:bg-gray-400 transition-colors" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1] cursor-pointer hover:bg-gray-400 transition-colors" />
          <div className="w-8 h-2.5 rounded-full bg-[#0070B8] cursor-pointer" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1] cursor-pointer hover:bg-gray-400 transition-colors" />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
