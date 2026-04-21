import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import "./HeroLoader.css";

const LOADER_TITLE = "MILAN BUITINK";

type HeroLoaderProps = {
  onComplete: () => void;
};

const HeroLoader = ({ onComplete }: HeroLoaderProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const imageRefs = useRef<HTMLDivElement[]>([]);

  const images = useMemo(
    () => [
      "/animation/files/img/img1.jpg",
      "/animation/files/img/img2.jpg",
      "/animation/files/img/img3.jpg",
      "/animation/files/img/img4.jpg",
    ],
    [],
  );

  useLayoutEffect(() => {
    const rootEl = rootRef.current;
    const panelEl = panelRef.current;
    const progressEl = progressRef.current;
    const titleEl = titleRef.current;
    const copyEl = copyRef.current;

    if (!rootEl || !panelEl || !progressEl || !titleEl || !copyEl) {
      onComplete();
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Still show the loader very briefly so the layout doesn't flash.
      const timeout = globalThis.setTimeout(onComplete, 250);
      return () => globalThis.clearTimeout(timeout);
    }

    const frames = imageRefs.current.filter(Boolean);
    const frameImages = frames
      .map((frame) => frame.querySelector("img"))
      .filter((img): img is HTMLImageElement => Boolean(img));

    if (frames.length === 0) {
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete,
      });

      gsap.set(progressEl, {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(frames, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      });
      gsap.set(frameImages, { scale: 1.8 });
      gsap.set(copyEl, { autoAlpha: 0, y: 24 });

      timeline
        .to(progressEl, {
          scaleX: 1,
          duration: 2.5,
          ease: "power2.inOut",
        })
        .set(progressEl, { transformOrigin: "right center" })
        .to(progressEl, {
          scaleX: 0,
          duration: 0.8,
          ease: "power2.in",
        })
        .to(
          frames,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.9,
            stagger: 0.35,
          },
          "-=2.6",
        )
        .to(
          frameImages,
          {
            scale: 1,
            duration: 1.3,
            stagger: 0.35,
          },
          "-=2.8",
        )
        .to(
          copyEl,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
          },
          "-=1.8",
        )
        .to(
          copyEl,
          {
            autoAlpha: 0,
            y: -24,
            duration: 0.8,
          },
          "+=0.6",
        )
        .to(titleEl, {
          y: "2rem",
          scale: 0.35,
          duration: 1.3,
          ease: "power4.out",
        })
        .to(
          panelEl,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 1.2,
            ease: "power4.inOut",
          },
          "-=0.6",
        )
        .to(
          rootEl,
          {
            autoAlpha: 0,
            duration: 0.35,
          },
          "-=0.2",
        );
    }, rootEl);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={rootRef} className="hero-loader" aria-hidden="true">
      <div className="hero-loader__title-wrap">
        <span ref={titleRef} className="hero-loader__title">
          {LOADER_TITLE}
        </span>
      </div>

      <div ref={panelRef} className="hero-loader__panel">
        <div ref={progressRef} className="hero-loader__progress" />

        <div className="hero-loader__images">
          {images.map((src, index) => (
            <div
              key={src}
              ref={(el) => {
                if (!el) return;
                imageRefs.current[index] = el;
              }}
              className="hero-loader__image-frame"
            >
              <img src={src} alt={`Loader visual ${index + 1}`} />
            </div>
          ))}
        </div>

        <p ref={copyRef} className="hero-loader__copy">
          A visual storyteller focused on shaping timeless fashion narratives
          through bold composition and refined tone.
        </p>
      </div>
    </div>
  );
};

export default HeroLoader;
