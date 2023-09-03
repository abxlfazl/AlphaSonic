import cn from "classnames";
import { useEffect, useRef, useState } from "preact/hooks";

import { alphabets } from "./constants/Alphabets";
import { Timer, TimerRef } from "./Timer";

function App() {
  const step = useRef(0);
  const [mistakes, setMistakes] = useState(0);
  const [isFinish, setIsFinish] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const letters = useRef<Array<HTMLSpanElement>>();
  const timer = useRef<TimerRef>(null);

  useEffect(() => {
    letters.current = Array.from(
      wrapperRef.current?.children as HTMLCollectionOf<HTMLSpanElement>
    );

    function onResize() {
      document.documentElement.style.setProperty(
        "--vH",
        `${window.innerHeight * 0.01}px`
      );
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
      )
        return;

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
        timer.current?.finish();
      } else if (!isTyping) {
        setIsTyping(true);
      }
    }

    window.addEventListener("keydown", handleTyping);

    return () => {
      window.removeEventListener("keydown", handleTyping);
    };
  }, [isTyping, isFinish]);

  function handlePlayOrRefresh(): void {
    if (isTyping) {
      step.current = 0;
      setMistakes(0);
      setIsTyping(false);
      setIsFinish(false);
      timer.current?.finish();
      wrapperRef.current?.style.setProperty("--step", "0");
      letters.current?.forEach((el) => {
        el.style.setProperty("color", "");
      });
      timer.current?.reset();
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
              "flex w-max text-center -translate-x-[calc(1em*var(--step,0))] duration-300 transition-[opacity] ease-out",
              {
                "opacity-0": isFinish,
                "duration-300 transition-[transform]": isTyping && !isFinish,
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
              "tracking-[0.2em] block transition-transform ease-out",
              {
                "translate-y-0 duration-700": isFinish,
                "text-red": mistakes > 0,
                "translate-y-full duration-0": !isFinish,
                "text-green": mistakes == 0,
              }
            )}
          >
            {mistakes > 0 ? `Mistakes : ${mistakes}` : "Perfect"}
          </span>
        </div>
      </div>
      <Timer isFinish={isFinish} isTyping={isTyping} ref={timer} />

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
