/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
 theme: {
  extend: {
    colors: {
      primary: "#0B1F4D",
      secondary: "#D4AF37",
      accent: "#2563EB",
      background: "#F8FAFC",
      dark: "#111827",
      light: "#FFFFFF",
      muted: "#6B7280",
    },

    borderRadius: {
      xl2: "24px",
      xl3: "32px",
    },

    boxShadow: {
      premium:
        "0 20px 60px rgba(0,0,0,.08)",

      glass:
        "0 10px 40px rgba(0,0,0,.12)",
    },
  },
},
  plugins: [],
};
