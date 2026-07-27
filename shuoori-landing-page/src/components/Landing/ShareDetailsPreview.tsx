import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import type { Locale } from "../../i18n"

type ShareDetailsPreviewProps = {
    locale: Locale
}

type Prompt = {
    en: string
    ar: string
}

const JOURNAL_LINES: Prompt[] = [
    {
        en: "What happened? I felt lighter after finally slowing down.",
        ar: "ماذا حدث؟ شعرت بخفة بعد أن تمهلت أخيراً.",
    },
    {
        en: "I noticed this feeling started after talking with my family.",
        ar: "لاحظت أن هذا الشعور بدأ بعد التحدث مع عائلتي.",
    },
    {
        en: "A short walk helped me feel more calm and present.",
        ar: "ساعدني المشي القصير على الشعور بمزيد من الهدوء والحضور.",
    },
]

const PROMPTS: Prompt[] = [
    { en: "What triggered this feeling?", ar: "ما الذي أثار هذا الشعور؟" },
    { en: "How intense is it right now?", ar: "ما مدى شدته الآن؟" },
    { en: "What would help me feel better?", ar: "ما الذي قد يساعدني على الشعور بشكل أفضل؟" },
    { en: "What can I learn from this?", ar: "ماذا يمكنني أن أتعلم من هذا؟" },
]

function getText(prompt: Prompt, isRtl: boolean) {
    return isRtl ? prompt.ar : prompt.en
}

type BrowserSpeechRecognitionEvent = Event & {
    resultIndex: number
    results: SpeechRecognitionResultList
}

type BrowserSpeechRecognitionErrorEvent = Event & {
    error: string
}

type BrowserSpeechRecognition = {
    lang: string
    continuous: boolean
    interimResults: boolean
    onstart: (() => void) | null
    onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null
    onerror: ((event: BrowserSpeechRecognitionErrorEvent) => void) | null
    onend: (() => void) | null
    start: () => void
    abort: () => void
}

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition

// Declare browser speech recognition types
declare global {
    interface Window {
        SpeechRecognition?: BrowserSpeechRecognitionConstructor
        webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor
    }
}

export default function ShareDetailsPreview({ locale }: ShareDetailsPreviewProps) {
    const isRtl = locale === "ar"
    const [lineIndex, setLineIndex] = useState(0)
    const [typedLength, setTypedLength] = useState(0)
    const [activePromptIndex, setActivePromptIndex] = useState(0)

    // User-typed / voice text
    const [userText, setUserText] = useState("")
    const [isListening, setIsListening] = useState(false)
    const [interimText, setInterimText] = useState("")
    const [speechSupported, setSpeechSupported] = useState(true)
    const recognitionRef = useRef<BrowserSpeechRecognition | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    // Tracks whether we deliberately stopped (vs Safari auto-stopping)
    const shouldRestartRef = useRef(false)

    // Auto-type demo only runs when user hasn't typed anything
    const isAutoDemo = userText === "" && !isListening

    const activeLine = useMemo(() => getText(JOURNAL_LINES[lineIndex], isRtl), [isRtl, lineIndex])

    useEffect(() => {
        if (!isAutoDemo) return
        setTypedLength(0)
        const typing = window.setInterval(() => {
            setTypedLength((current) => {
                if (current >= activeLine.length) {
                    window.clearInterval(typing)
                    return current
                }
                return current + 1
            })
        }, 28)
        return () => window.clearInterval(typing)
    }, [activeLine, isAutoDemo])

    useEffect(() => {
        if (!isAutoDemo) return
        const lineCycle = window.setInterval(() => {
            setLineIndex((current) => (current + 1) % JOURNAL_LINES.length)
        }, 4200)
        const promptCycle = window.setInterval(() => {
            setActivePromptIndex((current) => (current + 1) % PROMPTS.length)
        }, 1800)
        return () => {
            window.clearInterval(lineCycle)
            window.clearInterval(promptCycle)
        }
    }, [isAutoDemo])

    // Detect browser capabilities once
    const isSafari = typeof navigator !== "undefined" &&
        /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    // Check speech API support
    useEffect(() => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SR) setSpeechSupported(false)
    }, [])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            shouldRestartRef.current = false
            recognitionRef.current?.abort()
        }
    }, [])

    /** Create and start a single recognition session */
    const startSession = () => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SR) return

        const recognition = new SR()
        recognitionRef.current = recognition

        recognition.lang = isRtl ? "ar-SA" : "en-US"

        // Safari: continuous & interimResults cause issues — disable them
        // Chrome/Edge: enable both for best UX
        recognition.continuous = !isSafari
        recognition.interimResults = !isSafari

        recognition.onstart = () => setIsListening(true)

        recognition.onresult = (event: BrowserSpeechRecognitionEvent) => {
            let interim = ""
            let final = ""
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript
                if (event.results[i].isFinal) {
                    final += transcript + " "
                } else {
                    interim += transcript
                }
            }
            if (final) setUserText((prev) => prev + final)
            setInterimText(interim)
        }

        recognition.onerror = (event: BrowserSpeechRecognitionErrorEvent) => {
            // "no-speech" on Safari — just restart silently if still supposed to be listening
            if (event.error === "no-speech" && shouldRestartRef.current) return
            shouldRestartRef.current = false
            setIsListening(false)
            setInterimText("")
        }

        recognition.onend = () => {
            setInterimText("")
            // Safari stops after each phrase — restart automatically if user hasn't tapped Stop
            if (shouldRestartRef.current) {
                try {
                    recognition.start()
                } catch {
                    // Already started — ignore
                }
            } else {
                setIsListening(false)
            }
        }

        try {
            recognition.start()
        } catch {
            setIsListening(false)
        }
    }

    const toggleListening = () => {
        if (!speechSupported) return

        if (isListening) {
            // User tapped Stop
            shouldRestartRef.current = false
            recognitionRef.current?.abort()
            setIsListening(false)
            setInterimText("")
            return
        }

        // User tapped Start
        shouldRestartRef.current = true
        startSession()
    }

    const handlePromptClick = (prompt: Prompt) => {
        const text = getText(prompt, isRtl)
        setUserText((prev) => (prev ? prev + " " + text : text))
        setTimeout(() => textareaRef.current?.focus(), 50)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-full max-w-[430px]"
        >
            <div className="pointer-events-none absolute inset-x-[8%] top-[14%] h-[72%] rounded-full bg-[#2EB8AA]/10 blur-3xl" />

            <div className="relative flex w-full flex-col items-center gap-[24px] rounded-[18px] bg-white p-[18px] shadow-[0_14px_34px_rgba(16,24,39,0.12)]">
                <div className="flex w-full flex-col gap-[8px]">
                    <p className="text-[14px] font-medium leading-none text-[#18181B]">
                        {isRtl ? "شارك المزيد من التفاصيل (اختياري)" : "Share more details (optional)"}
                    </p>

                    {/* Text area — controlled, supports both typing and voice */}
                    <div className="relative min-h-[160px] w-full rounded-[14px] border border-[#E4E6EA] bg-white px-[14px] py-[12px] transition-all focus-within:border-[#2EB8AA] focus-within:shadow-[0_0_0_3px_rgba(46,184,170,0.12)]">
                        {isAutoDemo ? (
                            /* Demo typewriter when user hasn't interacted yet */
                            <p className="text-[15px] leading-[24px] text-[#6A727F]">
                                {activeLine.slice(0, typedLength)}
                                <motion.span
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                                    className="ml-[1px] inline-block text-[#2EB8AA]"
                                >
                                    |
                                </motion.span>
                            </p>
                        ) : (
                            <textarea
                                ref={textareaRef}
                                value={userText + interimText}
                                onChange={(e) => {
                                    // When user edits directly, strip the interim portion
                                    setUserText(e.target.value.slice(0, e.target.value.length - interimText.length))
                                }}
                                placeholder={isRtl ? "اكتب أو تحدث هنا..." : "Type or speak here..."}
                                dir={isRtl ? "rtl" : "ltr"}
                                className="w-full resize-none bg-transparent text-[15px] leading-[24px] text-[#101827] outline-none placeholder:text-[#9ca3af]"
                                style={{ minHeight: 136 }}
                                rows={6}
                                autoFocus={!isAutoDemo}
                            />
                        )}

                        {/* Live interim text badge */}
                        <AnimatePresence>
                            {interimText && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.5 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[14px] italic text-[#6A727F]"
                                >
                                    {interimText}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex flex-wrap gap-[8px]">
                        {PROMPTS.map((prompt, index) => (
                            <button
                                key={prompt.en}
                                type="button"
                                onClick={() => handlePromptClick(prompt)}
                                className={`rounded-full px-[12px] py-[7px] text-[12px] font-medium transition-colors ${
                                    index === activePromptIndex
                                        ? "bg-[#E7F7F5] text-[#1C6964]"
                                        : "bg-[#F8F9FB] text-[#4A5462] hover:bg-[#EFF2F5]"
                                }`}
                            >
                                {getText(prompt, isRtl)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tap to Speak button */}
                <motion.button
                    onClick={toggleListening}
                    whileTap={{ scale: 0.96 }}
                    className={`relative flex h-[58px] w-full cursor-pointer items-center justify-center gap-[10px] rounded-[14px] border px-[32px] py-[8px] transition-all ${
                        isListening
                            ? "border-[#ef4444] bg-[#fef2f2]"
                            : "border-[#E4E6EA] bg-white hover:border-[#2EB8AA] hover:bg-[#f0fdfb]"
                    }`}
                    title={speechSupported ? "" : "Speech recognition not supported in this browser"}
                >
                    {/* Pulse ring when listening */}
                    <AnimatePresence>
                        {isListening && (
                            <motion.span
                                key="pulse"
                                initial={{ scale: 1, opacity: 0.4 }}
                                animate={{ scale: 2.2, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                                className="absolute h-[30px] w-[30px] rounded-full bg-[#ef4444]"
                            />
                        )}
                        {!isListening && (
                            <motion.span
                                key="idle-pulse"
                                animate={{ scale: [1, 1.18, 1], opacity: [0.22, 0.05, 0.22] }}
                                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute h-[30px] w-[30px] rounded-full bg-[#2EB8AA]"
                            />
                        )}
                    </AnimatePresence>

                    <motion.div
                        animate={isListening ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                        transition={isListening ? { duration: 0.7, repeat: Infinity } : {}}
                        className="relative z-10"
                    >
                        {isListening
                            ? <MicOff className="h-[20px] w-[20px] text-[#ef4444]" strokeWidth={2} />
                            : <Mic className="h-[20px] w-[20px] text-[#101827]" strokeWidth={2} />
                        }
                    </motion.div>
                    <p className={`relative z-10 text-[16px] font-medium leading-none ${isListening ? "text-[#ef4444]" : "text-[#101827]"}`}>
                        {isListening
                            ? (isRtl ? "اضغط للإيقاف" : "Tap to Stop")
                            : (isRtl ? "اضغط للتحدث" : "Tap to Speak")
                        }
                    </p>
                </motion.button>

                {/* Unsupported browser notice */}
                {!speechSupported && (
                    <p className="text-[12px] text-[#ef4444]">
                        {isRtl
                            ? "المتصفح لا يدعم التعرف على الصوت. جرّب Chrome."
                            : "Speech recognition not supported. Try Chrome."}
                    </p>
                )}


            </div>
        </motion.div>
    )
}
