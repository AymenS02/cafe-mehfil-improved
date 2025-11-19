"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    let isMobile = window.innerWidth <= 900;

    const getScrollSettings = (mobile) =>
      mobile
        ? {
            duration: 1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: "vertical",
            gestureDirection: "vertical",
            smooth: true,
            smoothTouch: true,
            touchMultiplier: 1.5,
            infinite: false,
            lerp: 0.05,
            wheelMultiplier: 1,
            orientation: "vertical",
            smoothWheel: true,
            syncTouch: true,
          }
        : {
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: "vertical",
            gestureDirection: "vertical",
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
            lerp: 0.1,
            wheelMultiplier: 1,
            orientation: "vertical",
            smoothWheel: true,
            syncTouch: true,
          };

    let lenis = new Lenis(getScrollSettings(isMobile));

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const handleResize = () => {
      const wasMobile = isMobile;
      isMobile = window.innerWidth <= 900;

      if (wasMobile !== isMobile) {
        lenis.destroy();
        lenis = new Lenis(getScrollSettings(isMobile));
        lenis.on("scroll", ScrollTrigger.update);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
