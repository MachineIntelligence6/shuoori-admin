import { useMemo, useState } from "react"
import Header from "../../components/Landing/Header"
import type { Locale } from "../../i18n"

const assets = {
  en: {
    background: "https://www.figma.com/api/mcp/asset/5f9fb69e-0bc6-4178-a151-0f429bf98ec5",
  },
  ar: {
    background: "https://www.figma.com/api/mcp/asset/c415dc5f-e881-4b94-81d8-c38d8278ad12",
  },
}

type ContactPageProps = {
  locale: Locale
  setLocale: (l: Locale) => void
}

export default function ContactPage({ locale, setLocale }: ContactPageProps) {
  const isRtl = locale === "ar"
  const t = (en: string, ar: string) => (isRtl ? ar : en)
  const [expandedFaq, setExpandedFaq] = useState<number>(0)
  const faqIcons = {
    upRight: "https://www.figma.com/api/mcp/asset/884fc360-1046-4fc2-9f8a-b9aeef6f4900",
    up: "https://www.figma.com/api/mcp/asset/4549a32c-0852-4a0b-bc78-9911f2201a47",
    down: "https://www.figma.com/api/mcp/asset/0045cce4-0795-4d2e-9bab-3aa79f6622b7",
  }
  const content = useMemo(
    () => ({
      badge: isRtl ? "اتصل بنا" : "Contact Us",
      title: isRtl ? "تواصل معنا" : "Get in touch with us",
      description: isRtl
        ? "نحن هنا لدعم رحلتك نحو الصحة النفسية. سواء كان لديك سؤال أو ملاحظات أو كنت بحاجة إلى مساعدة في استخدام التطبيق، فإن فريقنا على أتم الاستعداد لمساعدتك."
        : "We’re here to support your emotional wellness journey. Whether you have a question, feedback, or need help using the app our team is ready to assist you.",
      form: {
        name: isRtl ? "اسم" : "Name",
        namePlaceholder: isRtl ? "اسمك" : "Your name",
        email: isRtl ? "عنوان البريد الإلكتروني" : "Email Address",
        emailPlaceholder: "you@gmail.com",
        subject: isRtl ? "موضوع" : "Subject",
        subjectPlaceholder: isRtl ? "موضوع رسالتك" : "Subject of your message",
        category: isRtl ? "فئة" : "Category",
        categoryPlaceholder: isRtl ? "اختر الفئة" : "Select category",
        message: isRtl ? "رسالة" : "Message",
        messagePlaceholder: isRtl ? "صف استفسارك هنا..." : "Describe you query here...",
        button: isRtl ? "أرسل رسالة" : "Send message",
        note: isRtl
          ? "سيتم استخدام معلوماتك فقط للرد على طلبك."
          : "Your information will only be used to respond to your request.",
      },
      faqBadge: isRtl ? "الأسئلة" : "Questions",
      faqTitle: isRtl ? "الأسئلة الشائعة" : "Frequently asked questions",
      faqDesc: isRtl ? "كل ما تحتاج معرفته عن Shuoori." : "Everything you need to know about Shuoori.",
      footer: {
        left: isRtl ? "© 2026 Shuoori. صُمّم بعناية من أجل صحتك النفسية." : "© 2026 Shuoori. Made with care for your wellbeing.",
        nav: isRtl
          ? ["الأسئلة الشائع", "الأسعار", "القصص", "كيف يعمل", "الميزات"]
          : ["Features", "How it works", "Stories", "Pricing", "FAQ"],
      },
    }),
    [isRtl]
  )

  return (
    <div className="relative min-h-screen bg-[#FCFBF8] overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-[-627px] h-[1500px] w-[1500px] -translate-x-1/2">
        <img src={assets[locale].background} alt="" className="h-full w-full object-cover opacity-100" />
      </div>

      <Header locale={locale} setLocale={setLocale} linkPrefix="/" showLocaleToggle={true} sticky={false} />

      <main className="relative">
        <section className="mx-auto w-full max-w-[1280px] px-6 pt-[162px]">
          <div className="flex flex-col items-center gap-[24px] text-center">
            <span className="inline-flex items-center justify-center rounded-full border-2 border-[#2EB8AA] bg-[#F2FBF9] px-[18px] py-[8px] text-[16px] font-normal text-[#1C6964]">
              {content.badge}
            </span>
            <h1 className="text-[60px] font-semibold leading-[1.1] tracking-[-2.4px] text-[#101827]">
              {isRtl ? (
                <>
                  تواصل <span className="text-[#2EB8AA]">معنا</span>
                </>
              ) : (
                <>
                  Get in touch <span className="text-[#2EB8AA]">with us</span>
                </>
              )}
            </h1>
            <p className="max-w-[855px] text-[20px] leading-[30px] text-[#4A5462]">
              {content.description}
            </p>
          </div>
        </section>

        <section className="mx-auto mt-[32px] w-full max-w-[768px] rounded-[12px] bg-white p-[32px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.12)]">
          <div className="flex flex-col gap-[16px]">
            <div className={`flex flex-col gap-[16px] md:flex-row ${isRtl ? "md:flex-row-reverse" : ""}`}>
              <div className="flex flex-1 flex-col gap-[8px]">
                <label className={`text-[14px] font-medium text-[#101827] ${isRtl ? "text-right" : ""}`}>{content.form.name}</label>
                <input
                  className={`h-[40px] rounded-[12px] border border-[#E4E6EA] px-[12px] text-[14px] text-[#101827] placeholder:text-[#6A727F] ${isRtl ? "text-right" : ""}`}
                  placeholder={content.form.namePlaceholder}
                />
              </div>
              <div className="flex flex-1 flex-col gap-[8px]">
                <label className={`text-[14px] font-medium text-[#101827] ${isRtl ? "text-right" : ""}`}>{content.form.email}</label>
                <input
                  className={`h-[40px] rounded-[12px] border border-[#E4E6EA] px-[12px] text-[14px] text-[#101827] placeholder:text-[#6A727F] ${isRtl ? "text-right" : ""}`}
                  placeholder={content.form.emailPlaceholder}
                />
              </div>
            </div>

            <div className={`flex flex-col gap-[16px] md:flex-row ${isRtl ? "md:flex-row-reverse" : ""}`}>
              <div className="flex flex-1 flex-col gap-[8px]">
                <label className={`text-[14px] font-medium text-[#101827] ${isRtl ? "text-right" : ""}`}>{content.form.subject}</label>
                <input
                  className={`h-[40px] rounded-[12px] border border-[#E4E6EA] px-[12px] text-[14px] text-[#101827] placeholder:text-[#6A727F] ${isRtl ? "text-right" : ""}`}
                  placeholder={content.form.subjectPlaceholder}
                />
              </div>
              <div className="flex flex-1 flex-col gap-[8px]">
                <label className={`text-[14px] font-medium text-[#101827] ${isRtl ? "text-right" : ""}`}>{content.form.category}</label>
                <div className="relative">
                  <select
                    className={`h-[40px] w-full appearance-none rounded-[12px] border border-[#E4E6EA] bg-white px-[12px] pr-[28px] text-[14px] text-[#101827] ${isRtl ? "text-right" : ""}`}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      {content.form.categoryPlaceholder}
                    </option>
                    <option>{isRtl ? "الدعم الفني" : "Support"}</option>
                    <option>{isRtl ? "الاشتراكات" : "Subscriptions"}</option>
                    <option>{isRtl ? "ملاحظات" : "Feedback"}</option>
                  </select>
                  <span className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[#6A727F] ${isRtl ? "left-[12px]" : "right-[12px]"}`}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className={`text-[14px] font-medium text-[#101827] ${isRtl ? "text-right" : ""}`}>{content.form.message}</label>
              <textarea
                className={`min-h-[80px] resize-none rounded-[12px] border border-[#E4E6EA] px-[12px] py-[8px] text-[14px] text-[#101827] placeholder:text-[#6A727F] ${isRtl ? "text-right" : ""}`}
                placeholder={content.form.messagePlaceholder}
              />
            </div>

            <div className="flex flex-col gap-[12px]">
              <button className="h-[40px] rounded-[12px] bg-[#2EB8AA] text-[14px] font-medium text-white">
                {content.form.button}
              </button>
              <p className="text-center text-[14px] leading-[20px] text-[#4A5462]">{content.form.note}</p>
            </div>
          </div>
        </section>

        <section id="faq" className="bg-[#FCFBF8] py-[96px]">
          <div
            dir={isRtl ? "ltr" : undefined}
            className={`mx-auto flex w-full max-w-[1200px] lg:max-w-[1280px] xl:max-w-[1360px] 2xl:max-w-[1480px] flex-col gap-[64px] px-6 lg:px-[96px] lg:flex-row`}
          >
            <div className={`flex flex-1 flex-col gap-[64px] ${isRtl ? "text-right items-start lg:order-2" : "text-left items-start"}`}>
              <div className={`flex flex-col gap-[12px] ${isRtl ? "items-start text-right" : "items-start text-left"}`}>
                <div className="flex w-fit items-center justify-center rounded-full border border-[#2EB8AA] bg-[#F2FBF9] px-[16px] py-[6px] text-[14px] font-medium text-[#1C6964]">
                  {t("Questions", "الأسئلة")}
                </div>
                <h2 className="text-[48px] font-semibold leading-[1.1] tracking-[-1.92px] text-[#101827]">
                  {t("Frequently asked ", "الأسئلة ")}
                  <span className="text-[#2EB8AA]">{t("questions", "الشائعة")}</span>
                </h2>
                <p className="text-[18px] leading-[28px] text-[#4A5462]">{t("Everything you need to know about EmotionFlow.", "كل ما تحتاج لمعرفته عن EmotionFlow.")}</p>
              </div>
              <div className="rounded-[12px] bg-white p-[24px]">
                <h3 className="text-[24px] font-semibold leading-[32px] text-[#101827]">{t("Can’t find answers?", "لم تجد الإجابة؟")}</h3>
                <p className="mt-[8px] text-[18px] leading-[28px] text-[#4A5462]">
                  {t(
                    "We are here to help you out whenever you need! Get in touch with our dedicated support team for personalized assistance anytime.",
                    "نحن هنا لمساعدتك متى احتجت! تواصل مع فريق الدعم المتخصص للحصول على مساعدة مخصصة في أي وقت."
                  )}
                </p>
                <a href="/contact" className="mt-[24px] inline-flex h-[44px] items-center gap-[8px] rounded-[12px] bg-[#2EB8AA] px-[32px] text-[16px] font-medium text-white">
                  {t("Contact us", "تواصل معنا")}
                  <img src={faqIcons.upRight} alt="" className="h-[16px] w-[16px]" />
                </a>
              </div>
            </div>
            <div className={`flex flex-1 flex-col gap-[24px] ${isRtl ? "text-left items-start lg:order-1" : "text-left items-start"}`}>
              {[
                {
                  question: t("Is my emotional data private and secure?", "هل بيانات مشاعري خاصة وآمنة؟"),
                  answer: t(
                    "Absolutely. Your data is encrypted end-to-end and stored securely. We never sell, share, or use your emotional data for advertising. EmotionFlow is a private sanctuary your entries are yours alone.",
                    "نعم تماماً. بياناتك مشفرة بالكامل وتُخزن بأمان. لا نبيع أو نشارك بياناتك ولا نستخدمها للإعلانات. مدخلاتك ملك لك وحدك."
                  ),
                },
                {
                  question: t("How long does it take to log an emotion?", "كم يستغرق تسجيل المشاعر؟"),
                  answer: t("Most people log an emotion in under 60 seconds. You can tap, add context, and save quickly.", "أغلب المستخدمين يسجلون شعوراً خلال أقل من 60 ثانية. يمكنك الاختيار وإضافة السياق والحفظ بسرعة."),
                },
                {
                  question: t("Is EmotionFlow a replacement for therapy?", "هل EmotionFlow بديل عن العلاج النفسي؟"),
                  answer: t("No. EmotionFlow is a supportive self‑reflection tool and does not replace professional care.", "لا. EmotionFlow أداة للتأمل الذاتي ولا تُغني عن الرعاية المتخصصة."),
                },
                {
                  question: t("Can I export my data?", "هل يمكنني تصدير بياناتي؟"),
                  answer: t("Yes, you can export your data anytime from the settings section.", "نعم، يمكنك تصدير بياناتك في أي وقت من الإعدادات."),
                },
                {
                  question: t("What platforms is EmotionFlow available on?", "على أي منصات يتوفر EmotionFlow؟"),
                  answer: t("EmotionFlow is available on iOS, Android, and the web.", "EmotionFlow متوفر على iOS و Android والويب."),
                },
                {
                  question: t("Can I cancel my subscription at any time?", "هل يمكنني إلغاء اشتراكي في أي وقت؟"),
                  answer: t("Yes, you can cancel anytime from your account settings.", "نعم، يمكنك الإلغاء في أي وقت من إعدادات حسابك."),
                },
              ].map((item, idx) => {
                const isOpen = expandedFaq === idx
                return (
                  <button
                    key={item.question}
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? -1 : idx)}
                    className="w-full rounded-[12px] bg-white p-[24px] text-left"
                  >
                    <div className="flex items-start justify-between gap-[24px]">
                      <div className="flex-1">
                        <p className="text-[18px] font-medium leading-[28px] text-[#101827]">{item.question}</p>
                        {isOpen ? (
                          <p className="mt-[8px] text-[16px] leading-[24px] text-[#4A5462]">
                            {item.answer}
                          </p>
                        ) : null}
                      </div>
                      <div className={`${isOpen ? "bg-[#2EB8AA]" : "border border-[#E4E6EA] bg-white"} flex h-[40px] w-[40px] items-center justify-center rounded-[12px]`}>
                        <img src={isOpen ? faqIcons.up : faqIcons.down} alt="" className="h-[16px] w-[16px]" />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#F8F9FB] pb-[96px] pt-[64px]">
        <div className="relative mx-auto flex w-full max-w-[1200px] lg:max-w-[1280px] xl:max-w-[1360px] 2xl:max-w-[1480px] flex-col items-center gap-[64px] px-6 lg:px-[96px]">
          <div className={`flex w-full flex-col gap-[24px] lg:items-center lg:justify-between text-[14px] text-[#4A5462] ${isRtl ? "lg:flex-row-reverse text-right" : "lg:flex-row text-left"}`}>
            <p>{t("© 2026 EmotionFlow. Made with for your wellbeing.", "© 2026 EmotionFlow. صُنع بعناية من أجل رفاهك.")}</p>
            <div className={`flex flex-wrap items-center gap-[24px] lg:gap-[32px] font-medium ${isRtl ? "flex-row-reverse" : ""}`}>
              <a href="/#features" className="hover:text-[#101827] transition-colors">{t("Features", "الميزات")}</a>
              <a href="/#how" className="hover:text-[#101827] transition-colors">{t("How it works", "كيف يعمل")}</a>
              <a href="/#stories" className="hover:text-[#101827] transition-colors">{t("Stories", "قصص")}</a>
              <a href="/#pricing" className="hover:text-[#101827] transition-colors">{t("Pricing", "الأسعار")}</a>
              <a href="/#faq" className="hover:text-[#101827] transition-colors">{t("FAQ", "الأسئلة الشائعة")}</a>
            </div>
          </div>
          <div className="flex justify-center w-full max-w-[400px] opacity-20 mix-blend-multiply">
            <img src="/logo.png" alt="Shuoori" className="w-full object-contain" />
          </div>
        </div>
      </footer>
    </div>
  )
}
