/**
 * The whole site uses the dark, photographic theme. Design tokens are redefined under
 * [data-theme="dark"] in globals.css, so every component follows automatically.
 * (Switch the attribute to "light" to bring back the original paper theme.)
 */
export default function ThemeScope({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="dark" className="theme-scope">
      {children}
    </div>
  );
}
