import { useEffect, useRef, useState } from "preact/hooks";
import cn from "classnames";

import { alphabets } from "./constants/Alphabets";

function App() {
  const step = useRef(0);
  const timestamp = useRef(0);
  const [mistakes, setMistakes] = useState(0);
  const timerRef = useRef<HTMLDivElement>(null);
  const [isFinish, setIsFinish] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const letters = useRef<Array<HTMLSpanElement>>();
  const timerSecRef = useRef<HTMLSpanElement>(null);
  const timerMilliSecRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    letters.current = Array.from(
      wrapperRef.current?.children as HTMLCollectionOf<HTMLSpanElement>
    );

    function onResize() {
      document.documentElement.style.setProperty(
        "--vH",
        `${window.innerHeight * 0.01}px`
      );
      console.log(window.innerHeight, window.outerHeight);
    }

    onResize();

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  useEffect(() => {
    function handleTyping({ key, ctrlKey }: { key: string; ctrlKey: boolean }) {
      const letter = key.toLowerCase();
      const index = letter.charCodeAt(0) - 97;

      if (
        ctrlKey ||
        isFinish ||
        !(index >= 0 && letter === alphabets[index].toLowerCase())
      ) {
        return;
      }

      ++step.current;

      wrapperRef.current?.style.setProperty(
        "--step",
        `${Math.min(step.current, 25)}`
      );

      if (step.current === index + 1) {
        letters.current![index].style.setProperty("color", "#9AFECE");
      } else {
        letters.current![step.current - 1].style.setProperty(
          "color",
          "#FF7575"
        );
        setMistakes((prevState) => ++prevState);
      }

      if (step.current > 25) {
        setIsFinish(true);
        clearTimeout(timestamp.current);
      } else if (!isTyping) {
        setIsTyping(true);
      }
    }

    window.addEventListener("keydown", handleTyping);

    if (isTyping && !isFinish) {
      let elapsedTime = 0;
      const startTime = Date.now() - elapsedTime;

      timestamp.current = setInterval(() => {
        if (timerSecRef.current && timerMilliSecRef.current) {
          elapsedTime = Date.now() - startTime;
          const [sec, milliSec] = `${(elapsedTime / 1000) % 60}`.split(".");

          timerSecRef.current.textContent = `0${sec}`.slice(-2);
          timerMilliSecRef.current.textContent = `0${milliSec}`.slice(-2);
        }
      });
    }

    return () => {
      window.removeEventListener("keydown", handleTyping);
    };
  }, [isTyping, isFinish]);

  function handlePlayOrRefresh(): void {
    if (isTyping) {
      step.current = 0;
      setIsTyping(false);
      setIsFinish(false);
      clearInterval(timestamp.current);
      wrapperRef.current?.style.setProperty("--step", "0");
      letters.current?.forEach((el) => {
        el.style.setProperty("color", "");
      });
      timerSecRef.current!.textContent = "00";
      timerMilliSecRef.current!.textContent = "00";
    } else {
      setIsTyping(true);
    }
  }

  return (
    <main className="text-[3vw] landscape:text-[1.17vw] h-screen flex flex-col justify-center">
      <div class="flex text-[15em] relative justify-center">
        <div className="w-full h-full absolute z-10 bg-gradient-primary" />
        <div className="w-[calc(50%+0.5em)] ml-auto">
          <div
            ref={wrapperRef}
            className={cn(
              "flex w-max text-center -translate-x-[calc(1em*var(--step,0))] transition-opacity duration-300 ease-out",
              {
                "opacity-0": isFinish,
              }
            )}
          >
            {alphabets.map((letter) => (
              <span key={letter} className="em:w-4">
                {letter}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden absolute z-50 bottom-0 text-[0.2em]">
          <span
            className={cn(
              "tracking-[0.2em] block transition-transform duration-700 ease-out",
              {
                "translate-y-0": isFinish,
                "text-red": mistakes > 0,
                "translate-y-full": !isFinish,
                "text-green": mistakes == 0,
              }
            )}
          >
            {mistakes > 0 ? `Mistakes : ${mistakes}` : "Perfect"}
          </span>
        </div>
      </div>
      <div
        ref={timerRef}
        className={cn(
          "em:text-7xl z-50 w-max mx-auto flex transition-transform duration-700 ease-out",
          {
            "em:-translate-y-10 scale-150": isFinish,
          }
        )}
      >
        <span ref={timerSecRef} className="em:w-8 text-right">
          00
        </span>
        <span className="em:mx-1">:</span>
        <span ref={timerMilliSecRef} className="em:w-8 text-left">
          00
        </span>
      </div>

      <button className="mx-auto em:mt-7" onClick={handlePlayOrRefresh}>
        <img
          className="em:w-10"
          src={isTyping ? "./refresh.png" : "./play.png"}
        />
      </button>
    </main>
  );
}

export { App };
