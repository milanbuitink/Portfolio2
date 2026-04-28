import { useLocation, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

type HeaderProps = {
  showPlusOnHome?: boolean;
};

const Header = ({ showPlusOnHome = true }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const goHome = () => {
    if (!isHome) {
      navigate("/");
    }
  };

  const showPlus = showPlusOnHome || !isHome;

  return (
    <header className="relative z-50 p-6 md:p-8">
      <div className="flex items-start justify-between">
        {showPlus ? (
          <button
            type="button"
            onClick={goHome}
            className="text-foreground hover:opacity-60 transition-opacity duration-300"
            aria-label={isHome ? "Ga naar home" : "Terug naar home"}
          >
            <Plus className="w-6 h-6" strokeWidth={1.5} />
          </button>
        ) : (
          <div className="w-6 h-6" aria-hidden="true" />
        )}

        <button
          type="button"
          data-site-title
          onClick={goHome}
          className="absolute left-1/2 top-8 -translate-x-1/2 inline-block w-max max-w-none whitespace-nowrap leading-none text-[0.75rem] sm:text-[0.8rem] md:text-base font-bold tracking-[0.09em] sm:tracking-[0.11em] md:tracking-widest uppercase hover:opacity-60 transition-opacity duration-300"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {siteConfig.name}
        </button>

        <div className="w-6 h-6" aria-hidden="true" />
      </div>
    </header>
  );
};

export default Header;
