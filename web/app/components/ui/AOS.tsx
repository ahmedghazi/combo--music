"use client";

import React, { ReactNode, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: ReactNode;
  duration?: number;
  delay?: number;
  y?: number;
  opacity?: boolean;
};

const AOS = ({
  children,
  duration = 0.4,
  delay = 0,
  opacity = true,
  y = 20,
}: Props) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    gsap.set(element, {
      opacity: opacity ? 0 : 1,
      y: y,
    });

    gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: duration,
      delay: delay,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        // start: "top 50%",
        start: "top 96%",
        once: true,
        markers: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [duration, delay, opacity, y]);

  return (
    <div className='aos'>
      <div ref={elementRef}>{children}</div>
    </div>
  );
};

export default AOS;
