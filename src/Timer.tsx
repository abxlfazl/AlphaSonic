import cn from "classnames";
import { forwardRef } from "preact/compat";
import { useEffect, useImperativeHandle, useRef } from "preact/hooks";

interface Props {
  isTyping: boolean;
  isFinished: boolean;
}

export interface TimerRef {
  reset: VoidFunction;
  finish: VoidFunction;
}

export const Timer = forwardRef<TimerRef, Props>(
  ({ isTyping, isFinished }, ref) => {
    const timerSecRef = useRef<HTMLSpanElement>(null);
    const timerMillisecondRef = useRef<HTMLSpanElement>(null);
    const timestamp = useRef<number | null>(null);

    useImperativeHandle(ref, () => {
      return {
        reset: () => {
          timerSecRef.current!.textContent = "00";
          timerMillisecondRef.current!.textContent = "00";
        },
        finish: () => {
          if (timestamp.current != null) clearTimeout(timestamp.current);
        },
      };
    });

    useEffect(() => {
      if (isTyping) {
        let elapsedTime = 0;
        const startTime = Date.now() - elapsedTime;

        timestamp.current = setInterval(() => {
          if (timerSecRef.current && timerMillisecondRef.current) {
            elapsedTime = Date.now() - startTime;
            const [sec, milliSeconds] = `${elapsedTime / 1000}`.split(".");

            timerSecRef.current.textContent =
              Number(sec) < 10 ? `0${sec}` : sec;
            timerMillisecondRef.current.textContent = `${milliSeconds}`.slice(
              0,
              2
            );
          }
        });
      }
    }, [isTyping]);

    return (
      <div
        className={cn(
          "em:text-7xl z-50 w-max mx-auto flex transition-transform duration-700 ease-out text-center",
          {
            "em:-translate-y-10 scale-150": isFinished,
          }
        )}
      >
        <span ref={timerSecRef} className="em:w-6">
          00
        </span>
        <span>:</span>
        <span ref={timerMillisecondRef} className="em:w-6">
          00
        </span>
      </div>
    );
  }
);
