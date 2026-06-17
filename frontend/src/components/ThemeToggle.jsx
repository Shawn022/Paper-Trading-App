import { useThemeStore } from "../store/themeStore";

export default function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <button
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
      className="
        px-3 py-2 rounded-lg
        bg-gray-200 dark:bg-gray-700
        text-black dark:text-white
      "
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}