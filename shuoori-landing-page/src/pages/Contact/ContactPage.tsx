import { useMemo, useState } from "react"
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react"
import Header from "../../components/Landing/Header"
import type { Locale } from "../../i18n"

type ContactPageProps = {
  locale: Locale
  setLocale: (l: Locale) => void
}

export default function ContactPage({ locale, setLocale }: ContactPageProps) {
  const isRtl = locale === "ar"
  const t = (en: string, ar: string) => (isRtl ? ar : en)
  const [expandedFaq, setExpandedFaq] = useState<number>(0)
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
      <Header locale={locale} setLocale={setLocale} linkPrefix="/" showLocaleToggle={true} sticky={false} />

      <main className="relative">
        <section className="mx-auto w-full max-w-[1200px] px-6 pt-[56px] sm:pt-[80px] lg:max-w-[1280px] lg:px-[96px] xl:max-w-[1360px] 2xl:max-w-[1480px]">
          <div className="flex flex-col items-center gap-[18px] text-center sm:gap-[24px]">
            <span className="inline-flex items-center justify-center rounded-full border-2 border-[#2EB8AA] bg-[#F2FBF9] px-[18px] py-[8px] text-[16px] font-normal text-[#1C6964]">
              {content.badge}
            </span>
            <h1 className="text-[36px] font-semibold leading-[1.12] tracking-[-0.8px] text-[#101827] sm:text-[48px] sm:tracking-[-1.4px] lg:text-[60px] lg:tracking-[-2.4px]">
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
            <p className="max-w-[855px] text-[16px] leading-[26px] text-[#4A5462] sm:text-[18px] sm:leading-[28px] lg:text-[20px] lg:leading-[30px]">
              {content.description}
            </p>
          </div>
        </section>

        <section className="relative z-10 mx-auto mb-[64px] mt-[32px] w-full max-w-[1200px] px-6 sm:mb-[96px] lg:max-w-[1280px] lg:px-[96px] xl:max-w-[1360px] 2xl:max-w-[1480px]">
          <div className="mx-auto flex w-full max-w-[768px] flex-col gap-[16px] rounded-[12px] bg-white p-[20px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.12)] sm:p-[32px]">
            <div className="flex flex-col gap-[16px] md:flex-row">
              <div className="flex flex-1 flex-col gap-[8px]">
                <label className={`text-[14px] font-medium text-[#101827] ${isRtl ? "text-right" : "text-left"}`}>{content.form.name}</label>
                <input
                  dir={isRtl ? "rtl" : "ltr"}
                  className={`h-[40px] rounded-[12px] border border-[#E4E6EA] px-[12px] text-[14px] text-[#101827] placeholder:text-[#6A727F] ${isRtl ? "text-right" : "text-left"}`}
                  placeholder={content.form.namePlaceholder}
                />
              </div>
              <div className="flex flex-1 flex-col gap-[8px]">
                <label className={`text-[14px] font-medium text-[#101827] ${isRtl ? "text-right" : "text-left"}`}>{content.form.email}</label>
                <input
                  dir="ltr"
                  className="h-[40px] rounded-[12px] border border-[#E4E6EA] px-[12px] text-left text-[14px] text-[#101827] placeholder:text-[#6A727F]"
                  placeholder={content.form.emailPlaceholder}
                />
              </div>
            </div>

            <div className="flex flex-col gap-[16px] md:flex-row">
              <div className="flex flex-1 flex-col gap-[8px]">
                <label className={`text-[14px] font-medium text-[#101827] ${isRtl ? "text-right" : "text-left"}`}>{content.form.subject}</label>
                <input
                  dir={isRtl ? "rtl" : "ltr"}
                  className={`h-[40px] rounded-[12px] border border-[#E4E6EA] px-[12px] text-[14px] text-[#101827] placeholder:text-[#6A727F] ${isRtl ? "text-right" : "text-left"}`}
                  placeholder={content.form.subjectPlaceholder}
                />
              </div>
              <div className="flex flex-1 flex-col gap-[8px]">
                <label className={`text-[14px] font-medium text-[#101827] ${isRtl ? "text-right" : "text-left"}`}>{content.form.category}</label>
                <div className="relative">
                  <select
                    dir={isRtl ? "rtl" : "ltr"}
                    className={`h-[40px] w-full appearance-none rounded-[12px] border border-[#E4E6EA] bg-white px-[12px] text-[14px] text-[#101827] ${isRtl ? "pl-[32px] text-right" : "pr-[32px] text-left"}`}
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
              <label className={`text-[14px] font-medium text-[#101827] ${isRtl ? "text-right" : "text-left"}`}>{content.form.message}</label>
              <textarea
                dir={isRtl ? "rtl" : "ltr"}
                className={`min-h-[96px] resize-none rounded-[12px] border border-[#E4E6EA] px-[12px] py-[8px] text-[14px] text-[#101827] placeholder:text-[#6A727F] ${isRtl ? "text-right" : "text-left"}`}
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

        <section id="faq" className="bg-[#FCFBF8] py-[64px] sm:py-[96px]">
          <div
            className="mx-auto flex w-full max-w-[1200px] flex-col gap-[36px] px-6 sm:gap-[64px] lg:max-w-[1280px] lg:flex-row lg:px-[96px] xl:max-w-[1360px] 2xl:max-w-[1480px]"
          >
            <div className={`flex flex-1 flex-col items-center gap-[32px] text-center sm:gap-[64px] ${isRtl ? "lg:items-start lg:text-right" : "lg:items-start lg:text-left"}`}>
              <div className={`flex flex-col items-center gap-[12px] text-center ${isRtl ? "lg:items-start lg:text-right" : "lg:items-start lg:text-left"}`}>
                <div className="flex w-fit items-center justify-center rounded-full border border-[#2EB8AA] bg-[#F2FBF9] px-[16px] py-[6px] text-[14px] font-medium text-[#1C6964]">
                  {t("Questions", "الأسئلة")}
                </div>
                <h2 className="text-[34px] font-semibold leading-[1.12] tracking-[-0.8px] text-[#101827] sm:text-[48px] sm:tracking-[-1.92px]">
                  {t("Frequently asked ", "الأسئلة ")}
                  <span className="text-[#2EB8AA]">{t("questions", "الشائعة")}</span>
                </h2>
                <p className="text-[16px] leading-[26px] text-[#4A5462] sm:text-[18px] sm:leading-[28px]">{t("Everything you need to know about Shuoori.", "كل ما تحتاج لمعرفته عن Shuoori.")}</p>
              </div>
              <div className="w-full rounded-[12px] bg-white p-[24px]">
                <h3 className="text-[24px] font-semibold leading-[32px] text-[#101827]">{t("Can’t find answers?", "لم تجد الإجابة؟")}</h3>
                <p className="mt-[8px] text-[18px] leading-[28px] text-[#4A5462]">
                  {t(
                    "We are here to help you out whenever you need! Get in touch with our dedicated support team for personalized assistance anytime.",
                    "نحن هنا لمساعدتك متى احتجت! تواصل مع فريق الدعم المتخصص للحصول على مساعدة مخصصة في أي وقت."
                  )}
                </p>
                <a href="/contact" className="mt-[24px] inline-flex h-[44px] items-center gap-[8px] rounded-[12px] bg-[#2EB8AA] px-[32px] text-[16px] font-medium text-white">
                  {t("Contact us", "تواصل معنا")}
                  <ArrowUpRight className="h-[16px] w-[16px]" strokeWidth={2} />
                </a>
              </div>
            </div>
            <div className={`flex flex-1 flex-col items-stretch gap-[24px] ${isRtl ? "text-right" : "text-left"}`}>
              {[
                {
                  question: t("Is my emotional data private and secure?", "هل بيانات مشاعري خاصة وآمنة؟"),
                  answer: t(
                    "Absolutely. Your data is encrypted end-to-end and stored securely. We never sell, share, or use your emotional data for advertising. Shuoori is a private sanctuary your entries are yours alone.",
                    "نعم تماماً. بياناتك مشفرة بالكامل وتُخزن بأمان. لا نبيع أو نشارك بياناتك ولا نستخدمها للإعلانات. مدخلاتك ملك لك وحدك."
                  ),
                },
                {
                  question: t("How long does it take to log an emotion?", "كم يستغرق تسجيل المشاعر؟"),
                  answer: t("Most people log an emotion in under 60 seconds. You can tap, add context, and save quickly.", "أغلب المستخدمين يسجلون شعوراً خلال أقل من 60 ثانية. يمكنك الاختيار وإضافة السياق والحفظ بسرعة."),
                },
                {
                  question: t("Is Shuoori a replacement for therapy?", "هل Shuoori بديل عن العلاج النفسي؟"),
                  answer: t("No. Shuoori is a supportive self‑reflection tool and does not replace professional care.", "لا. Shuoori أداة للتأمل الذاتي ولا تُغني عن الرعاية المتخصصة."),
                },
                {
                  question: t("Can I export my data?", "هل يمكنني تصدير بياناتي؟"),
                  answer: t("Yes, you can export your data anytime from the settings section.", "نعم، يمكنك تصدير بياناتك في أي وقت من الإعدادات."),
                },
                {
                  question: t("What platforms is Shuoori available on?", "على أي منصات يتوفر Shuoori؟"),
                  answer: t("Shuoori is available on iOS, Android, and the web.", "Shuoori متوفر على iOS و Android والويب."),
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
                    className={`w-full rounded-[12px] bg-white p-[24px] ${isRtl ? "text-right" : "text-left"}`}
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
                        {isOpen ? (
                          <ChevronUp className="h-[16px] w-[16px] text-white" strokeWidth={2.5} />
                        ) : (
                          <ChevronDown className="h-[16px] w-[16px] text-[#101827]" strokeWidth={2.5} />
                        )}
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
          <div className={`flex w-full flex-col items-center gap-[18px] text-center text-[14px] text-[#4A5462] lg:gap-[24px] lg:items-center lg:justify-between ${isRtl ? "lg:flex-row-reverse lg:text-right" : "lg:flex-row lg:text-left"}`}>
            <p className="w-full lg:w-auto">{t("© 2026 Shuoori. Made with care for your wellbeing.", "© 2026 Shuoori. صُنع بعناية من أجل رفاهك.")}</p>
            <div className="flex flex-wrap items-center justify-center gap-x-[18px] gap-y-[12px] font-medium sm:gap-x-[24px] lg:justify-start lg:gap-x-[32px]">
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
