module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#5932EA",
        region: "#E5E7EB",
      },
      textColor: {
        main: "#5932EA",
        white: "#FFFFFF",
        gray: "#6B7280",
        dark: "#374151",
      },
      backgroundColor: {
        main: "#5932EA",
        white: "#FFFFFF",
        gray: "#F3F4F6",
        "gray-hover": "#E5E7EB",
      },
      fontFamily: {
        pre: ["Pretendard", "sans-serif"],
      },
    },
    fontSize: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "24px",
      "2xl": "32px",
      "3xl": "48px",
      "4xl": "64px",
      "5xl": "80px",
      "6xl": "96px",
      "7xl": "112px",
      "8xl": "128px",
      "9xl": "144px",
    },
  },
  plugins: [],
};
