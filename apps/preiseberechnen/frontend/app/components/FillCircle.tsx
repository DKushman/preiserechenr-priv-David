"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FillCircleProps = {
  sectionId: string;
};

export function FillCircle({ sectionId }: FillCircleProps) {
  const progressRef = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;

    const r = el.r.baseVal.value;
    const circumference = 2 * Math.PI * r;

    el.style.strokeDasharray = `${circumference}`;
    el.style.strokeDashoffset = `${circumference}`;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: `#${sectionId}`,
          start: "top 70%",
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, [sectionId]);

  return (
    <div
      id="preiseberechnen-feature-circle"
      className="w-[clamp(8rem,18vw,14rem)] aspect-square relative"
      aria-hidden="true"
    >
      <svg
        id="preiseberechnen-feature-circle-svg"
        viewBox="0 0 120 120"
        className="w-full h-full"
      >
        <circle
          id="preiseberechnen-feature-circle-track"
          cx="60"
          cy="60"
          r="46"
          fill="none"
          stroke="rgba(0,0,0,0.12)"
          strokeWidth="18"
        />
        <circle
          id="preiseberechnen-feature-circle-progress"
          ref={progressRef}
          cx="60"
          cy="60"
          r="46"
          fill="none"
          stroke="#0a0a0a"
          strokeWidth="18"
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
      </svg>
    </div>
  );
}

