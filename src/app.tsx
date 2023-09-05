import cn from "classnames";
import { useEffect, useRef, useState } from "preact/hooks";

import { alphabets } from "./constants/Alphabets";
import { Timer, TimerRef } from "./Timer";

type Status = "idle" | "typing" | "finished";

function App() {
  const step = useRef(0);
  const [mistakes, setMistakes] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lettersEle = useRef<Array<HTMLSpanElement>>();
  const timer = useRef<TimerRef>(null);
  const isIdle = status === "idle";
  const isTyping = status === "typing";
  const isFinished = status === "finished";
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    lettersEle.current = Array.from(
      wrapperRef.current?.children as HTMLCollectionOf<HTMLSpanElement>
    );

    setIsMobile(window.matchMedia("screen and (hover: none)").matches);

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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    const key = target.value.slice(-1);
    const letter = key.toLowerCase();
    const index = letter.charCodeAt(0) - 97;

    if (isFinished || !(index >= 0 && letter === alphabets[index])) return;

    ++step.current;

    wrapperRef.current?.style.setProperty(
      "--step",
      `${Math.min(step.current, alphabets.length - 1)}`
    );

    if (step.current === index + 1) {
      lettersEle.current![index].style.setProperty("color", "#9AFECE");
    } else {
      lettersEle.current![step.current - 1].style.setProperty(
        "color",
        "#FF7575"
      );
      setMistakes((prevState) => ++prevState);
    }

    if (step.current === alphabets.length) {
      setStatus("finished");
      timer.current?.finish();
      target.blur();
      target.value = "";
    } else if (!isTyping) {
      setStatus("typing");
    }
  };

  function onBlur() {
    if (!isMobile) inputRef.current?.focus();
  }

  function handlePlayOrReset() {
    if (!isIdle) {
      step.current = 0;
      setMistakes(0);
      setStatus("idle");
      timer.current?.finish();
      wrapperRef.current?.style.setProperty("--step", "0");
      lettersEle.current?.forEach((el) => {
        el.style.setProperty("color", "");
      });
      timer.current?.reset();
    } else {
      inputRef.current?.focus();
    }
  }

  return (
    <main className="text-[3vw] landscape:text-[1.17vw] h-screen flex flex-col justify-center">
      <div class="flex text-[15em] relative justify-center">
        <div className="w-full h-full absolute z-10 bg-gradient-primary" />
        <div className="w-[calc(50%+0.5em)] ml-auto z-10">
          <div
            ref={wrapperRef}
            className={cn(
              "flex w-max text-center -translate-x-[calc(1em*var(--step,0))] duration-300 transition-[opacity] ease-out",
              {
                "opacity-0": isFinished,
                "duration-300 transition-[transform]": isTyping && !isFinished,
              }
            )}
          >
            {alphabets.map((letter) => (
              <span key={letter} className="em:w-4 uppercase">
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
                "translate-y-0 duration-700": isFinished,
                "text-red": mistakes > 0,
                "translate-y-full duration-0": !isFinished,
                "text-green": mistakes == 0,
              }
            )}
          >
            {mistakes > 0 ? `Mistakes : ${mistakes}` : "Perfect"}
          </span>
        </div>
        <input
          value=""
          autoFocus
          ref={inputRef}
          onBlur={onBlur}
          onChange={onChange}
          maxLength={alphabets.length}
          className=" absolute top-1/2 h-[0.2em] left-0 right-0  opacity-0"
        />
      </div>
      <Timer isFinished={isFinished} isTyping={isTyping} ref={timer} />
      <button
        className={cn("mx-auto em:mt-7 flex items-center justify-center", {
          "pointer-events-none": isIdle && !isMobile,
        })}
        onClick={handlePlayOrReset}
      >
        {!isMobile && (
          <span
            className={cn("em:text-3xl absolute", {
              "opacity-0": !isIdle,
            })}
          >
            press A
          </span>
        )}
        <img
          className={cn("em:w-10", {
            "opacity-0": !isMobile && isIdle,
          })}
          src={isMobile && isIdle ? "./play.png" : "./refresh.png"}
        />
      </button>
    </main>
  );
}

export { App };
