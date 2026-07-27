import Button from "../common/Button";
import type { copy } from "../../i18n";

type NavbarProps = {
  t: (typeof copy)["ar"]["common"];
};

const Navbar = ({ t }: NavbarProps) => {
  const appUrl = "https://app.shuoori.com/";
  const links = [
    { label: t.landingNav.home, href: "#" },
    { label: t.landingNav.features, href: "#features" },
    { label: t.landingNav.about, href: "#what-is" },
    { label: t.landingNav.references, href: "#trusted" },
    { label: t.landingNav.contact, href: "#contact" },
  ];

  return (
    <header className="navbar sticky top-0 z-50 transition-all duration-300 bg-header">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 h-[80px]">
        {/* Logo on the start (visually right in RTL) */}
        <div className="flex items-center w-[200px]">
          <a href="#" className="flex items-center gap-2">
            {/* Shuoory Logo Graphic Placeholder */}
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 5C11.716 5 5 11.716 5 20C5 28.284 11.716 35 20 35C28.284 35 35 28.284 35 20C35 11.716 28.284 5 20 5Z"
                fill="var(--color-primary)"
                fillOpacity="0.2"
              />
              <path
                d="M20 10C23 10 25.5 12.5 25.5 15.5C25.5 20 20 25 20 25C20 25 14.5 20 14.5 15.5C14.5 12.5 17 10 20 10Z"
                fill="var(--color-accent)"
              />
              <path
                d="M12 28C15 26 25 26 28 28"
                stroke="var(--color-primary)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[22px] font-[800] text-accent ml-1">
              Shuoory
            </span>
          </a>
        </div>

        {/* Centered Nav Links */}
        <nav className="hidden flex-1 items-center justify-center lg:gap-8 gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[16px] font-bold text-[#4C535A] transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA Button on the end (visually left in RTL) */}
        <div className="flex items-center justify-end w-[200px]">
          <Button
            variant="filled"
            size="md"
            className="!px-6 !text-[15px] !font-bold !rounded-[6px] !shadow-none hover:bg-opacity-90 transition-all"
            onClick={() => window.location.href = appUrl}
          >
            {t.landingNav.startNow}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
