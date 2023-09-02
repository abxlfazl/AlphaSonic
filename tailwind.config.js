/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: ({ colors }) => ({
      inherit: colors.inherit,
      current: colors.current,
      transparent: colors.transparent,
      main: {
        light: "#23252ec2",
        DEFAULT: "#23252E",
      },
      white: "#ffffff",
      red: "#FF7575",
      green: "#9AFECE",
    }),
    fontFamily: {
      base: "Rajdhani",
    },
    extend: {
      backgroundImage: (theme) => ({
        "gradient-primary": `linear-gradient(to right, ${theme(
          "colors.main.DEFAULT"
        )}, transparent calc(50% - 0.5em), transparent calc(50% + 0.5em) ,${theme(
          "colors.main.DEFAULT"
        )})`,
      }),
      minHeight: {
        screen: "calc(var(--vH,1vh)*100)",
      },
      height: {
        screen: "calc(var(--vH,1vh)*100)",
      },
    },
  },
  plugins: [
    require("tailwindcss/plugin")(function ({ addVariant }) {
      addVariant("em", ({ container }) => {
        container.walkRules((rule) => {
          rule.selector = `.em\\:${rule.selector.slice(1)}`;
          rule.walkDecls((decl) => {
            decl.value = decl.value.replace("rem", "em");
          });
        });
      });
    }),
  ],
};
