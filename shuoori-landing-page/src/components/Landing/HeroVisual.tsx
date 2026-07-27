"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Emotion Data Structure ──────────────────────────────────────────────────

const EMOTIONS = {
  joy: {
    color: "#eab308", // Yellow
    label: "سعادة",
    subs: [
      {
        label: "متحمس",
        color: "#f59e0b",
        subSubs: ["شغوف", "متشوق", "مفعم بالطاقة"],
      },
      { label: "فخور", color: "#d97706", subSubs: ["مهم", "واثق", "ناجح"] },
      {
        label: "متفائل",
        color: "#fcd34d",
        subSubs: ["مأمول", "ملهم", "منفتح"],
      },
    ],
  },
  trust: {
    color: "#22c55e", // Green
    label: "طمأنينة",
    subs: [
      { label: "ممتن", color: "#16a34a", subSubs: ["مقدر", "شاكر", "محظوظ"] },
      { label: "آمن", color: "#15803d", subSubs: ["مطمئن", "مرتاح", "محمي"] },
      {
        label: "متسامح",
        color: "#4ade80",
        subSubs: ["متفهم", "هادئ", "متقبل"],
      },
    ],
  },
  sadness: {
    color: "#3b82f6", // Blue
    label: "حزن",
    subs: [
      { label: "وحيد", color: "#2563eb", subSubs: ["منعزل", "متروك", "منبوذ"] },
      { label: "يائس", color: "#1d4ed8", subSubs: ["مكتئب", "حزين", "مستسلم"] },
      { label: "خائب", color: "#60a5fa", subSubs: ["مصدوم", "مخذول", "مستاء"] },
    ],
  },
  anger: {
    color: "#ef4444", // Red
    label: "غضب",
    subs: [
      { label: "محبط", color: "#dc2626", subSubs: ["منزعج", "غاضب", "مستفز"] },
      { label: "غيور", color: "#b91c1c", subSubs: ["حاقد", "حسود", "مستاء"] },
      { label: "مستاء", color: "#f87171", subSubs: ["ممتعض", "رافض", "مشمئز"] },
    ],
  },
  fear: {
    color: "#a855f7", // Purple
    label: "خوف",
    subs: [
      { label: "قلق", color: "#9333ea", subSubs: ["متوتر", "مضطرب", "مذعور"] },
      {
        label: "مرفوض",
        color: "#7e22ce",
        subSubs: ["مستبعد", "منبوذ", "مضطهد"],
      },
      { label: "مرعوب", color: "#c084fc", subSubs: ["مصدوم", "خائف", "مرتعب"] },
    ],
  },
};

const EMOTION_KEYS = Object.keys(EMOTIONS) as Array<keyof typeof EMOTIONS>;

// ─── Components ──────────────────────────────────────────────────────────────

export default function HeroVisual() {
  const [step, setStep] = useState<
    "idle" | "core" | "sub" | "subsub" | "calculating" | "result"
  >("idle");
  const [selectedCore, setSelectedCore] = useState<
    keyof typeof EMOTIONS | null
  >(null);
  const [selectedSub, setSelectedSub] = useState<number | null>(null);
  const [selectedSubSub, setSelectedSubSub] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  // Simulation Sequence
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const runSequence = async () => {
      // Reset
      setStep("idle");
      setSelectedCore(null);
      setSelectedSub(null);
      setSelectedSubSub(null);
      setProgress(0);

      await new Promise((r) => setTimeout(r, 1500));

      // Pick Core Emotion
      setStep("core");
      const randomCoreIdx = Math.floor(Math.random() * EMOTION_KEYS.length);
      const coreKey = EMOTION_KEYS[randomCoreIdx];
      setSelectedCore(coreKey);
      await new Promise((r) => setTimeout(r, 2000));

      // Pick Sub Emotion
      setStep("sub");
      const subsLen = EMOTIONS[coreKey].subs.length;
      const randomSubIdx = Math.floor(Math.random() * subsLen);
      setSelectedSub(randomSubIdx);
      await new Promise((r) => setTimeout(r, 2000));

      // Pick Sub-Sub Emotion
      setStep("subsub");
      const subSubsLen = EMOTIONS[coreKey].subs[randomSubIdx].subSubs.length;
      const randomSubSubIdx = Math.floor(Math.random() * subSubsLen);
      setSelectedSubSub(randomSubSubIdx);
      await new Promise((r) => setTimeout(r, 1500));

      // Calculating
      setStep("calculating");
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += Math.random() * 15;
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
          setProgress(100);
          setStep("result");
          // Loop back after showing result
          timeoutId = setTimeout(runSequence, 4000);
        } else {
          setProgress(currentProgress);
        }
      }, 150);
    };

    // Start initial sequence
    const initialDelay = setTimeout(runSequence, 500);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      className="relative w-full h-[500px] lg:h-[600px] max-w-2xl mx-auto flex items-center justify-center pointer-events-none"
      style={{ direction: "rtl" }}
    >
      {/* Dynamic Background Glow based on selected emotion */}
      <motion.div
        className="absolute inset-0 rounded-full blur-[100px] opacity-20 -z-10"
        animate={{
          backgroundColor: selectedCore
            ? EMOTIONS[selectedCore].color
            : "#00A3A8",
          scale: step === "calculating" || step === "result" ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 1.5,
          repeat: step === "calculating" ? Infinity : 0,
        }}
      />

      <div className="relative w-full max-w-[800px] h-[400px] bg-white/90 backdrop-blur-xl rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border-[4px] border-white overflow-hidden flex flex-col items-center">
        {/* App Header Mockup */}
        <div className="w-full h-16 bg-white/80 border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-20">
          <div className="w-8 h-8 rounded-full bg-gray-100" />
          <div className="text-[14px] font-bold text-gray-700">
            كيف تشعر الآن؟
          </div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </div>

        {/* Content Area */}
        <div className="relative flex-1 w-full bg-[#f8fafc] flex flex-col items-center justify-center p-6 object-cover">
          <AnimatePresence mode="wait">
            {/* ── WHEEL STAGES ── */}
            {(step === "idle" ||
              step === "core" ||
              step === "sub" ||
              step === "subsub") && (
              <motion.div
                key="wheel-view"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full flex flex-row items-center justify-evenly"
              >
                {/* Selected Emotion Label */}
                <div className="flex items-center justify-center">
                  <AnimatePresence mode="popLayout">
                    {selectedCore && (
                      <motion.div
                        key={
                          selectedSubSub !== null
                            ? "subsub"
                            : selectedSub !== null
                              ? "sub"
                              : "core"
                        }
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-center"
                      >
                        <div
                          className="text-[24px] font-[900]"
                          style={{ color: EMOTIONS[selectedCore].color }}
                        >
                          {selectedSubSub !== null
                            ? EMOTIONS[selectedCore].subs[selectedSub!].subSubs[
                                selectedSubSub
                              ]
                            : selectedSub !== null
                              ? EMOTIONS[selectedCore].subs[selectedSub].label
                              : EMOTIONS[selectedCore].label}
                        </div>
                        <div className="text-[12px] text-gray-400 mt-1">
                          {step === "core"
                            ? "مشاعر أساسية"
                            : step === "sub"
                              ? "مشاعر محددة"
                              : "شعور دقيق"}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Circular Visualization */}
                <div className="relative w-64 h-64 flex items-center justify-center">
                  {/* Outer Ring (Core Emotions) */}
                  <svg
                    viewBox="0 0 200 200"
                    className="absolute inset-0 w-full h-full -rotate-90"
                  >
                    {EMOTION_KEYS.map((key, i) => {
                      const isActive = selectedCore === key;
                      const isFaded = selectedCore && !isActive;
                      const circumference = 2 * Math.PI * 90;
                      const dashArray = circumference / EMOTION_KEYS.length - 4;

                      return (
                        <motion.circle
                          key={key}
                          cx="100"
                          cy="100"
                          r="90"
                          fill="none"
                          stroke={EMOTIONS[key].color}
                          strokeWidth={isActive ? 16 : 12}
                          strokeDasharray={`${dashArray} ${circumference}`}
                          strokeDashoffset={
                            -(circumference / EMOTION_KEYS.length) * i
                          }
                          animate={{
                            opacity: isFaded ? 0.2 : 1,
                            strokeWidth: isActive ? 16 : 12,
                          }}
                          transition={{ duration: 0.3 }}
                          className="transition-all"
                        />
                      );
                    })}
                  </svg>

                  {/* Middle Ring (Sub Emotions) */}
                  <AnimatePresence>
                    {selectedCore && (step === "sub" || step === "subsub") && (
                      <motion.svg
                        initial={{ opacity: 0, scale: 0.8, rotate: -120 }}
                        animate={{ opacity: 1, scale: 1, rotate: -90 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        viewBox="0 0 200 200"
                        className="absolute inset-0 w-full h-full"
                      >
                        {EMOTIONS[selectedCore].subs.map((sub, i) => {
                          const subsLen = EMOTIONS[selectedCore].subs.length;
                          const isActive = selectedSub === i;
                          const isFaded = selectedSub !== null && !isActive;
                          const circumference = 2 * Math.PI * 65;
                          const dashArray = circumference / subsLen - 4;

                          return (
                            <motion.circle
                              key={i}
                              cx="100"
                              cy="100"
                              r="65"
                              fill="none"
                              stroke={sub.color}
                              strokeWidth={isActive ? 22 : 16}
                              strokeDasharray={`${dashArray} ${circumference}`}
                              strokeDashoffset={-(circumference / subsLen) * i}
                              animate={{ opacity: isFaded ? 0.2 : 1 }}
                            />
                          );
                        })}
                      </motion.svg>
                    )}
                  </AnimatePresence>

                  {/* Inner Ring (Sub-Sub Emotions) */}
                  <AnimatePresence>
                    {selectedCore &&
                      selectedSub !== null &&
                      step === "subsub" && (
                        <motion.svg
                          initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                          animate={{ opacity: 1, scale: 1, rotate: -90 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          viewBox="0 0 200 200"
                          className="absolute inset-0 w-full h-full"
                        >
                          {EMOTIONS[selectedCore].subs[selectedSub].subSubs.map(
                            (_subSub, i) => {
                              const subSubsLen =
                                EMOTIONS[selectedCore].subs[selectedSub!]
                                  .subSubs.length;
                              const isActive = selectedSubSub === i;
                              const isFaded =
                                selectedSubSub !== null && !isActive;
                              const circumference = 2 * Math.PI * 35;
                              const dashArray = circumference / subSubsLen - 2;

                              return (
                                <motion.circle
                                  key={i}
                                  cx="100"
                                  cy="100"
                                  r="35"
                                  fill="none"
                                  stroke={
                                    EMOTIONS[selectedCore].subs[selectedSub!]
                                      .color
                                  }
                                  strokeWidth={isActive ? 30 : 26}
                                  strokeDasharray={`${dashArray} ${circumference}`}
                                  strokeDashoffset={
                                    -(circumference / subSubsLen) * i
                                  }
                                  animate={{
                                    opacity: isFaded ? 0.2 : isActive ? 1 : 0.7,
                                  }}
                                />
                              );
                            },
                          )}
                        </motion.svg>
                      )}
                  </AnimatePresence>

                  {/* Center Dot */}
                  <motion.div
                    className="w-12 h-12 bg-white rounded-full shadow-inner flex items-center justify-center relative z-10"
                    animate={{
                      scale: step === "subsub" ? 1.2 : 1,
                      backgroundColor: selectedCore
                        ? EMOTIONS[selectedCore].color
                        : "#fff",
                    }}
                  >
                    {selectedCore && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-4 h-4 rounded-full bg-white shadow-sm"
                      />
                    )}
                  </motion.div>

                  {/* Simulation Cursor */}
                  <motion.div
                    className="absolute w-6 h-6 z-50 pointer-events-none drop-shadow-md top-[45%] left-[50%]"
                    initial={{ x: 10, y: 70, opacity: 0 }}
                    animate={{
                      opacity: 1,
                      x:
                        step === "core"
                          ? 90
                          : step === "sub"
                            ? 40
                            : step === "subsub"
                              ? 10
                              : 80,
                      y:
                        step === "core"
                          ? 20
                          : step === "sub"
                            ? -40
                            : step === "subsub"
                              ? 10
                              : 120,
                      scale: [1, 0.9, 1], // click effect
                    }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="white"
                      stroke="#333"
                      strokeWidth="1.5"
                      className="w-full h-full drop-shadow-lg"
                    >
                      <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5H6a.5.5 0 0 0-.5.5z" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* ── CALCULATING STAGE ── */}
            {step === "calculating" && (
              <motion.div
                key="calc-view"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-row items-center justify-center gap-12 w-full h-full"
              >
                <div className="relative w-32 h-32">
                  <motion.svg
                    viewBox="0 0 100 100"
                    className="w-full h-full -rotate-90"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={
                        selectedCore ? EMOTIONS[selectedCore].color : "#00A3A8"
                      }
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="283"
                      animate={{
                        strokeDashoffset: 283 - (283 * progress) / 100,
                      }}
                    />
                  </motion.svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[24px] font-[900] text-gray-700">
                    {Math.floor(progress)}%
                  </div>
                </div>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-[14px] font-bold text-gray-500"
                >
                  جاري تحليل مشاعرك...
                </motion.div>
              </motion.div>
            )}

            {/* ── RESULT SUMMARY STAGE ── */}
            {step === "result" &&
              selectedCore &&
              selectedSub !== null &&
              selectedSubSub !== null && (
                <motion.div
                  key="result-view"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  className="flex flex-row items-center justify-between w-full h-full px-8 gap-8"
                >
                  <div className="flex flex-col items-center flex-1">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl"
                      style={{ backgroundColor: EMOTIONS[selectedCore].color }}
                    >
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </motion.div>

                    <h3 className="text-[24px] font-[900] text-gray-800 mb-2">
                      تم تسجيل شعورك
                    </h3>
                    <p className="text-[16px] text-gray-500 text-center">
                      تبدو اليوم
                      <span
                        className="font-bold mx-1"
                        style={{ color: EMOTIONS[selectedCore].color }}
                      >
                        {
                          EMOTIONS[selectedCore].subs[selectedSub].subSubs[
                            selectedSubSub
                          ]
                        }
                      </span>
                      بسبب بعض التحديات أو الإنجازات الخاصة.
                    </p>
                  </div>

                  <div className="w-[300px] shrink-0 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: EMOTIONS[selectedCore].color + "20",
                        }}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={EMOTIONS[selectedCore].color}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </div>
                      <div className="text-right flex-1">
                        <div className="text-[14px] text-gray-400 font-bold mb-1">
                          مؤشر الطاقة
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "75%" }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full rounded-full"
                            style={{
                              backgroundColor: EMOTIONS[selectedCore].color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
          </AnimatePresence>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-gray-300 rounded-full z-20" />
      </div>

      {/* Floating UI Elements Around Phone */}
      <motion.div
        className="absolute top-10 -right-8 lg:-right-12 bg-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-50 z-30"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-xl">😌</span>
        </div>
        <div className="text-right">
          <div className="text-[12px] font-bold text-gray-800">هدوء ويقظة</div>
          <div className="text-[10px] text-gray-400">+15 نقطة</div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-20 -left-8 lg:-left-12 bg-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-50 z-30"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      >
        <div className="w-10 h-10">
          <svg
            viewBox="0 0 36 36"
            className="w-full h-full -rotate-90 drop-shadow-md"
          >
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="4"
            />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="#00A3A8"
              strokeWidth="4"
              strokeDasharray="100"
              strokeDashoffset="25"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="text-right">
          <div className="text-[12px] font-bold text-gray-800">
            توازن الانفعالات
          </div>
          <div className="text-[10px] text-gray-400">ممتاز اليوم</div>
        </div>
      </motion.div>
    </div>
  );
}
