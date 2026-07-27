type FooterSectionProps = {
  t: {
    brand: string;
    description: string;
    fastLinksTitle: string;
    links: string[];
    contactTitle: string;
    email: string;
    phone: string;
    address: string;
    rights: string;
  };
};

const FooterSection = ({ t }: FooterSectionProps) => {
  return (
    <footer
      className="bg-[#fcfdfd] border-t border-gray-100 pt-20 pb-8 relative"
      dir="rtl"
    >
      <div className="mx-auto max-w-[1240px] px-6 lg:px-12 flex flex-col md:flex-row justify-between items-start gap-12 lg:gap-8 mb-16">
        {/* Visual Right (RTL right) - Logo & Description */}
        <div className="flex flex-col items-start md:items-start text-right max-w-sm md:w-1/3">
          {/* Logo Area */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-gradient-to-r from-[#00A3A8] to-[#0461A8] text-white shadow-soft shrink-0 relative overflow-hidden">
              {/* Temporary stand-in for the complex logo shape in design */}
              <span
                className="text-2xl font-bold italic relative z-10"
                style={{ fontFamily: "serif" }}
              >
                S
              </span>
              <div className="absolute inset-0 bg-white/20 rounded-full w-20 h-20 -top-6 -right-6 blur-md pointer-events-none"></div>
            </div>
            <span className="text-2xl font-bold text-[#00A3A8] tracking-tight">
              {t.brand}
            </span>
          </div>

          <p className="text-[15px] leading-[1.8] text-[#5f5f5f]">
            {t.description}
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-8">
            {/* LinkedIn */}
            <a
              href="#"
              className="flex items-center justify-center w-[34px] h-[34px] bg-[#00A3A8] hover:opacity-80 transition-opacity rounded-[8px] text-white"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            {/* Facebook */}
            <a
              href="#"
              className="flex items-center justify-center w-[34px] h-[34px] bg-[#00A3A8] hover:opacity-80 transition-opacity rounded-[8px] text-white"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            {/* Twitter */}
            <a
              href="#"
              className="flex items-center justify-center w-[34px] h-[34px] bg-[#00A3A8] hover:opacity-80 transition-opacity rounded-[8px] text-white"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="#"
              className="flex items-center justify-center w-[34px] h-[34px] border-2 border-[#00A3A8] hover:bg-[#00A3A8] hover:text-white transition-colors rounded-[8px] text-[#00A3A8]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>

        {/* Center - Fast Links */}
        <div className="flex flex-col items-start md:items-center text-right md:w-1/3 mt-8 md:mt-0">
          <h3 className="text-[17px] font-bold text-[#1a1a1a] mb-6">
            {t.fastLinksTitle}
          </h3>
          <ul className="flex flex-col gap-4">
            {t.links.map((link, idx) => (
              <li key={idx}>
                <a
                  href="#"
                  className="text-[15px] text-[#5f5f5f] hover:text-[#00A3A8] transition-colors inline-block text-right"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Visual Left (RTL left) - Contact Info */}
        <div className="flex flex-col items-start md:items-start text-right md:w-1/3 mt-8 md:mt-0 w-full">
          <h3 className="text-[17px] font-bold text-[#1a1a1a] mb-6">
            {t.contactTitle}
          </h3>
          <ul className="flex flex-col gap-6 items-start w-full">
            {/* Email */}
            <li
              className="flex items-center justify-start gap-4 w-full group cursor-pointer"
              style={{ direction: "rtl" }}
            >
              <div className="text-[#00A3A8] shrink-0">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <span
                className="text-[16px] text-[#5f5f5f] group-hover:text-[#00A3A8] transition-colors"
                style={{ direction: "ltr" }}
              >
                {t.email}
              </span>
            </li>

            {/* Phone */}
            <li
              className="flex items-center justify-start gap-4 w-full group cursor-pointer"
              style={{ direction: "rtl" }}
            >
              <div className="text-[#00A3A8] shrink-0">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transform: "scaleX(-1)" }}
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <span
                className="text-[16px] text-[#5f5f5f] group-hover:text-[#00A3A8] transition-colors"
                style={{ direction: "ltr" }}
              >
                {t.phone}
              </span>
            </li>

            {/* Address */}
            <li
              className="flex items-start justify-start gap-4 w-full group cursor-pointer"
              style={{ direction: "rtl" }}
            >
              <div className="text-[#00A3A8] shrink-0 mt-0.5">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <span
                className="text-[15px] text-[#5f5f5f] group-hover:text-[#00A3A8] transition-colors text-right"
                style={{ direction: "ltr", textAlign: "right" }}
              >
                {t.address}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-gray-200">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-12 py-6 text-center">
          <p className="text-[14px] text-[#6b7280]">{t.rights}</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
