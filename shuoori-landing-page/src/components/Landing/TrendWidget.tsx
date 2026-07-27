import { useState, useEffect } from "react"
import { motion } from "framer-motion"

type TrendWidgetProps = {
    locale: "ar" | "en"
    t?: (en: string, ar: string) => string
}

export const TrendWidget = ({ locale, t }: TrendWidgetProps) => {
    const isRtl = locale === "ar";
    const resolve = t ?? ((en: string, ar: string) => (isRtl ? ar : en));
    
    const [activeIndex, setActiveIndex] = useState(0);

    const filters = [
        resolve("Severity", "الحدة"),
        resolve("Contrast", "التباين"),
        resolve("Change", "التغيّر"),
        resolve("Diversity", "التنوّع"),
        resolve("Places", "الأماكن"),
        resolve("Factors", "العوامل")
    ];

    // Mock bar data profiles for each filter state
    const dataProfiles = [
        [4.5, 2, 0, 0, 8.5, 6.5, 0], // Severity
        [2, 6, 8, 4, 1, 3, 5],       // Contrast
        [1, 2, 4, 7, 9, 8, 4],       // Change
        [8, 6, 9, 3, 2, 4, 1],       // Diversity
        [3, 3, 5, 8, 6, 5, 2],       // Places
        [6, 8, 0, 2, 4, 7, 5]        // Factors
    ];

    const days = [
        resolve("Sunday", "الأحد"),
        resolve("Monday", "الإثنين"),
        resolve("Tuesday", "الثلاثاء"),
        resolve("Wednesday", "الأربعاء"),
        resolve("Thursday", "الخميس"),
        resolve("Friday", "الجمعة"),
        resolve("Saturday", "السبت"),
    ];

    // Auto-cycle filters every 3.5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % filters.length);
        }, 3500);
        return () => clearInterval(timer);
    }, [filters.length]);

    const currentData = dataProfiles[activeIndex];

    return (
        <div className="flex flex-col gap-[20px] rounded-[24px] bg-white p-[24px] lg:p-[28px] shadow-[0_12px_32px_rgba(0,0,0,0.08)] border border-[#f3f4f6] w-full max-w-[420px]">
            <div className="flex items-start justify-between gap-[12px]">
                <p className="text-[20px] font-bold leading-[28px] text-[#101827]">{resolve("Trend", "الاتجاه")}</p>
                <div className="flex flex-none items-center gap-[6px] rounded-[12px] border border-[#E4E4E7] bg-white px-[14px] py-[8px] text-[14px] font-medium leading-[20px] text-[#101827] cursor-pointer hover:bg-gray-50 transition-colors">
                    {resolve("Weekly", "أسبوعي")}
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6L8 10L12 6" stroke="#4A5462" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {/* Auto-cycling Trend graph options */}
            <div className={`grid grid-cols-3 gap-y-[16px] gap-x-[12px] mt-[4px] ${isRtl ? "text-right" : "text-left"}`}>
                {filters.map((name, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                        <div 
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`flex items-center gap-[6px] rounded-[20px] px-[8px] py-[6px] w-fit cursor-pointer transition-all duration-300 ${isActive ? 'border border-[#2EB8AA] opacity-100' : 'border border-transparent px-[0px] opacity-70 hover:opacity-100'}`}
                        >
                            <motion.div 
                                layout
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className={`w-[14px] h-[14px] rounded-full border-[1.5px] ${isActive ? 'border-[4px] border-[#2EB8AA]' : 'border-[#E4E6EA]'}`}
                            ></motion.div>
                            <span className="text-[13px] font-bold text-[#101827]">{name}</span>
                        </div>
                    );
                })}
            </div>

            {/* DOM Bar Chart animated by Framer Motion */}
            <div className={`w-full mt-[16px] h-[180px] flex gap-[8px] ${isRtl ? "pr-[20px]" : "pl-[20px]"} relative`}>
                {/* Horizontal Grid lines and Y-Axis */}
                <div className={`absolute ${isRtl ? "right-[-5px]" : "left-[-5px]"} top-0 bottom-[40px] w-full flex flex-col justify-between z-0`}>
                    {[10, 6, 3, 0].map((val) => (
                        <div key={val} className="flex items-center gap-[8px] w-full relative">
                            <span className={`text-[#6A727F] text-[11px] font-medium w-[12px] ${isRtl ? "text-left" : "text-right"}`}>{val}</span>
                            <div className="h-[1px] w-full border-t border-dashed border-[#E4E6EA]"></div>
                        </div>
                    ))}
                    
                    {/* Vertical grid lines roughly aligned to columns */}
                    <div className={`absolute top-0 bottom-0 ${isRtl ? "right-[24px] left-0" : "left-[24px] right-0"} flex justify-between pointer-events-none z-0`}>
                        {[0,1,2,3,4,5,6].map((idx) => (
                            <div key={`v-${idx}`} className="w-[1px] h-full border-l border-dashed border-[#E4E6EA] translate-x-[12px]"></div>
                        ))}
                    </div>
                </div>

                {/* X-Axis and Bars */}
                <div className={`relative w-full h-full flex items-end justify-between ${isRtl ? "pr-[12px]" : "pl-[12px]"} pb-[40px] z-10`}>
                    {days.map((day, idx) => {
                        const val = currentData[idx];
                        const isHighlighted = val >= 6.5; 
                        return (
                            <div key={idx} className="flex flex-col items-center justify-end h-full relative flex-1 group">
                                {/* Bar */}
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(val / 10) * 100}%` }}
                                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                    className={`w-[16px] sm:w-[20px] rounded-t-[4px] ${isHighlighted ? 'bg-[#2EB8AA]' : 'bg-[#E4E6EA]'}`}
                                ></motion.div>
                                
                                {/* X Axis Label */}
                                <span className="absolute bottom-[-32px] text-[#6A727F] text-[10px] whitespace-nowrap -rotate-[50deg] origin-top-left font-medium select-none">
                                    {day}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
