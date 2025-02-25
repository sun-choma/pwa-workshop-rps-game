import { useState, AnimationEvent, ReactNode } from "react";
import { Presence, VStack } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { joinClassNames } from "@/utils/common";
import type { GameContext } from "@/providers/game/types";

import "./styles.css";

interface OverlayProps {
  multiplayerState: GameContext["multiplayerState"];
  children: ReactNode;
}

export function Overlay({ multiplayerState, children }: OverlayProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isOfflineModeAccepted, setOfflineModeAccepted] = useState(false);

  const handleAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === "scale-down") setIsVisible(false);
  };

  return (
    <>
      {(multiplayerState === "ready" || isOfflineModeAccepted) && children}
      {isVisible && (
        <div
          className={joinClassNames(
            "overlay",
            (multiplayerState === "ready" || isOfflineModeAccepted) &&
              "animated",
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
                multiplayerState === "too-long" &&
                  !isOfflineModeAccepted &&
                  "animated",
              )}
            >
              <circle cx="50%" cy="50%" r="50%" fill="#fff" />
              <use x="12px" y="12px" xlinkHref="logo/sunbear.svg#icon" />
            </svg>
          </div>
          <div className="details-container">
            <Presence
              present={multiplayerState === "waiting"}
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
              present={multiplayerState === "too-long"}
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
      )}
    </>
  );
}
