import { useEffect } from "preact/hooks";

function App() {
  useEffect(() => {
    function onResize() {
      document.documentElement.style.setProperty(
        "--vH",
        `${window.innerHeight / 100}px`
      );
    }

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <></>;
}

export { App };
