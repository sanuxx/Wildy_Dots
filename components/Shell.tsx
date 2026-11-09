import Nav from "./Nav";
import Footer from "./Footer";
import Providers from "./Providers";
import ThemeScope from "./ThemeScope";

/** Page frame: skip link, navigation, content and footer. Native scrolling — no scroll-jacking. */
export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <ThemeScope>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </ThemeScope>
    </Providers>
  );
}
