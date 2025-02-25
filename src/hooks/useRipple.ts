import { useEffect } from "react";

export function useRipple() {
  useEffect(() => {
    const clickHandler = (ev: MouseEvent) => {
      const rippleNode = document.querySelector(".ripple");
      const clonedNode = rippleNode?.cloneNode(true) as HTMLDivElement;
      if (rippleNode && clonedNode && ev.detail > 0) {
        clonedNode.style.left = `${ev.clientX - 5}px`;
        clonedNode.style.top = `${ev.clientY - 5}px`;
        rippleNode.replaceWith(clonedNode);
      }
    };

    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, []);
}
