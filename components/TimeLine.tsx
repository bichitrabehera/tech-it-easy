"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const totalFrames = 761;
const SCROLL_DISTANCE = totalFrames * 16;

const TimeLine = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const imageCache = useRef<Record<number, HTMLImageElement>>({});
  const lastIndexRef = useRef(-1);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let currentWidth = 0;
    let currentHeight = 0;

    // ✅ Load image
    const loadImage = (index: number): HTMLImageElement => {
      if (imageCache.current[index]) return imageCache.current[index];

      const img = new Image();
      const frame = String(index + 1).padStart(4, "0");
      img.src = `/ani/frame_${frame}.jpeg`;
      img.decoding = "async";

      imageCache.current[index] = img;
      return img;
    };

    // ✅ Setup canvas once per resize
    const setupCanvas = (width: number, height: number) => {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    };

    // ✅ Draw frame
    const draw = (img: HTMLImageElement) => {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth || window.innerWidth;
      const height = parent?.clientHeight || window.innerHeight;

      if (width !== currentWidth || height !== currentHeight) {
        setupCanvas(width, height);
        currentWidth = width;
        currentHeight = height;
      }

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

    // ✅ Render frame
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

    // ✅ Progressive preload (no freezing)
    const progressivePreload = () => {
      let i = 1;

      const loadChunk = () => {
        for (let j = 0; j < 10 && i < totalFrames; j++, i++) {
          loadImage(i);
        }
        if (i < totalFrames) {
          requestIdleCallback(loadChunk);
        }
      };

      requestIdleCallback(loadChunk);
    };

    // ✅ Init
    render(0);
    progressivePreload();

    // ✅ ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top top",
      end: `+=${SCROLL_DISTANCE}`,
      scrub: true,
      pin: true,
      pinSpacing: true, // ✅ ensures scroll space exists
      onUpdate: (self) => {
        const progress = Math.min(self.progress, 1);
        const index = Math.round(progress * (totalFrames - 1));

        if (index !== lastIndexRef.current) {
          render(index);
        }
      },
      onLeave: () => {
        render(totalFrames - 1);
      },
    });

    const handleResize = () => {
      if (lastIndexRef.current >= 0) {
        render(lastIndexRef.current);
      }
    };

    window.addEventListener("resize", handleResize);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", handleResize);
      trigger.kill();
    };
  }, []);

  return (
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