"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const totalFrames = 761;
// 761 frames ÷ ~60fps feel = need ~12000px of scroll to feel smooth end-to-end
const SCROLL_DISTANCE = totalFrames * 16; // 16px per frame = 12176px

const TimeLine = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);
  const imageCache = useRef<Record<number, HTMLImageElement>>({});
  const lastIndexRef = useRef(-1);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loadImage = (index: number): HTMLImageElement => {
      if (imageCache.current[index]) return imageCache.current[index];
      const img = new Image();
      const frame = String(index + 1).padStart(4, "0");
      img.src = `/ani/frame_${frame}.jpeg`;
      img.decoding = "async";
      imageCache.current[index] = img;
      return img;
    };

    const draw = (img: HTMLImageElement) => {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth || window.innerWidth;
      const height = parent?.clientHeight || window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const scale = Math.max(
        width / img.naturalWidth,
        height / img.naturalHeight
      );
      const drawWidth = img.naturalWidth * scale;
      const drawHeight = img.naturalHeight * scale;
      const offsetX = (width - drawWidth) / 2;
      const offsetY = (height - drawHeight) / 2;

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      canvas.style.opacity = "1";
    };

    const render = (index: number) => {
      const clamped = Math.max(0, Math.min(totalFrames - 1, index));
      lastIndexRef.current = clamped;
      const img = loadImage(clamped);

      if (!img.complete) {
        img.onload = () => draw(img);
      } else {
        draw(img);
      }
    };

    const prefetch = (from: number, to: number) => {
      const end = Math.min(to, totalFrames - 1);
      for (let i = from; i <= end; i++) loadImage(i);
    };

    const setupTimeline = () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;

      render(0);
      prefetch(1, 60);

      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => prefetch(61, totalFrames - 1));
      } else {
        setTimeout(() => prefetch(61, totalFrames - 1), 300);
      }

      const trigger = ScrollTrigger.create({
        trigger: triggerRef.current,
        start: "top top",
        end: `+=${SCROLL_DISTANCE}`,  // ✅ enough scroll for all 761 frames
        scrub: true,                   // ✅ scrub:true (not 0.5) — reaches frame 761 exactly
        pin: true,
        markers: false,
        onUpdate: (self) => {
          // ✅ Clamp progress to [0,1] to guarantee last frame is reachable
          const progress = Math.min(self.progress, 1);
          const index = Math.round(progress * (totalFrames - 1));
          if (index !== lastIndexRef.current) {
            render(index);
          }
        },
        onLeave: () => {
          // ✅ Force last frame when scroll passes the end
          render(totalFrames - 1);
        },
      });

      const handleResize = () => {
        if (lastIndexRef.current >= 0) render(lastIndexRef.current);
      };

      window.addEventListener("resize", handleResize);
      ScrollTrigger.refresh();

      cleanupRef.current = () => {
        window.removeEventListener("resize", handleResize);
        trigger.kill();
      };
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setupTimeline();
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "200px 0px",
        threshold: 0,
      }
    );

    if (triggerRef.current) observer.observe(triggerRef.current);

    return () => {
      observer.disconnect();
      cleanupRef.current?.();
    };
  }, []);

  return (
    // ✅ Outer wrapper height must match pin + scroll distance
    <div style={{ background: "black" }}>
      <div
        ref={triggerRef}
        style={{
          height: "100vh",
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>
    </div>
  );
};

export default TimeLine;