import { useState, useEffect, AnimationEvent } from "react";
import { Presence, VStack } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";

import { requestTimeout, cancelTimeout, joinClassNames } from "@/utils/common";

import "./styles.css";

type StartupPhase = "waiting" | "too-long" | "finished";

export function Overlay() {
  const [initState, setInitState] = useState<StartupPhase>("waiting");
  const [isVisible, setIsVisible] = useState(true);
  const [isOfflineModeAccepted, setOfflineModeAccepted] = useState(false);

  useEffect(() => {
    const timeout = requestTimeout(() => setInitState("too-long"), 2000);
    const finishTimeout = requestTimeout(() => setInitState("finished"), 10000);

    return () => {
      cancelTimeout(timeout);
      cancelTimeout(finishTimeout);
    };
  }, []);

  const handleAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (initState === "finished" && e.animationName === "scale-down")
      setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={joinClassNames(
        "overlay",
        (initState === "finished" || isOfflineModeAccepted) && "animated",
      )}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="logo-container">
        <svg
          width="96px"
          height="96px"
          viewBox="0 0 208 208"
          preserveAspectRatio="xMidYMid meet"
          className={joinClassNames(
            "logo",
            initState === "too-long" && !isOfflineModeAccepted && "animated",
          )}
        >
          <circle cx="50%" cy="50%" r="50%" fill="#fff" />
          <use x="12px" y="12px" xlinkHref="logo/sunbear.svg#icon" />
        </svg>
      </div>
      <div className="details-container">
        <Presence
          present={initState === "waiting"}
          animationName={{
            _open: "slide-from-top, fade-in",
            _closed: "slide-to-bottom, fade-out",
          }}
          animationDuration="moderate"
          lazyMount
          unmountOnExit
        >
          Make awesome things that matter.
        </Presence>
        <Presence
          className="small"
          present={initState === "too-long"}
          animationName={{
            _open: "slide-from-top, fade-in",
            _closed: "slide-to-bottom, fade-out",
          }}
          animationDuration="moderate"
          lazyMount
          unmountOnExit
        >
          <VStack>
            <small>
              <div>Still loading, huh</div>
              <div>Seems like our free server is asleep</div>
              <div>Wait a second, we will wake it up</div>
            </small>
            <Button
              variant="surface"
              onClick={() => setOfflineModeAccepted(true)}
            >
              I'll play offline
            </Button>
          </VStack>
        </Presence>
      </div>
    </div>
  );
}
