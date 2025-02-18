import { ComponentPropsWithRef } from "react";

interface ProgressCircleProps
  extends Omit<ComponentPropsWithRef<"svg">, "width" | "height"> {
  value: number;
  size?: number;
  trackWidth?: number;
}

export function ProgressCircle({
  value,
  size = 75,
  trackWidth = 10,
  children,
  ...props
}: ProgressCircleProps) {
  const radius = size - trackWidth;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 150 150"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="75"
        cy="75"
        r={radius}
        fill="none"
        stroke="var(--chakra-colors-purple-muted)"
        strokeWidth="10"
      />
      <circle
        cx="75"
        cy="75"
        r={radius}
        fill="none"
        stroke="var(--chakra-colors-purple-solid)"
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - (circumference * value) / 100}
        strokeLinecap="round"
        transform="rotate(-90 75 75)"
        style={{
          transition: `stroke-dashoffset linear ${Math.min(100 - value, 100 - (100 - value)) <= 1 ? "0s" : ".125s"}`,
        }}
      />
      {children && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fill="#fff"
          style={{ fontSize: size * 0.5 }}
        >
          {children}
        </text>
      )}
    </svg>
  );
}
