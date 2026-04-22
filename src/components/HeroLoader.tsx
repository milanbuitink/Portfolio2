import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import "./HeroLoader.css";

const LOADER_TITLE = "MILAN BUITINK";

type HeroLoaderProps = {
  onReveal?: () => void;
  onComplete: () => void;
};

const HeroLoader = ({ onReveal, onComplete }: HeroLoaderProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);

  const images = useMemo(
    () => [
      "/animation/files/img/sloterdijkaxo.webp",
      "/animation/files/img/Timbertunes.webp",
      "/animation/files/img/10a.webp",
      "/animation/files/img/graduation.webp",
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

    const frames = Array.from(
      rootEl.querySelectorAll<HTMLDivElement>(".hero-loader__image-frame"),
    );
    const frameImages = Array.from(
      rootEl.querySelectorAll<HTMLImageElement>(".hero-loader__image-frame img"),
    );

    let revealed = false;
    let completed = false;

    const revealOnce = () => {
      if (revealed) return;
      revealed = true;
      onReveal?.();
    };

    const completeOnce = () => {
      if (completed) return;
      completed = true;
      onComplete();
    };

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      const nudgeTitleToHeader = () => {
        const headerTitleEl = document.querySelector<HTMLElement>("[data-site-title]");
        if (!headerTitleEl) return;

        const headerRect = headerTitleEl.getBoundingClientRect();
        const currentRect = titleEl.getBoundingClientRect();

        if (currentRect.width <= 0 || currentRect.height <= 0) return;

        const widthScaleFix = headerRect.width / currentRect.width;

        if (Number.isFinite(widthScaleFix) && Math.abs(widthScaleFix - 1) > 0.001) {
          const currentScale = Number(gsap.getProperty(titleEl, "scale")) || 1;
          gsap.set(titleEl, { scale: currentScale * widthScaleFix });
        }

        const rectAfterScale = titleEl.getBoundingClientRect();
        const dx = headerRect.left - rectAfterScale.left;
        const dy = headerRect.top - rectAfterScale.top;

        if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
          const currentX = Number(gsap.getProperty(titleEl, "x")) || 0;
          const currentY = Number(gsap.getProperty(titleEl, "y")) || 0;
          gsap.set(titleEl, { x: currentX + dx, y: currentY + dy });
        }
      };

      gsap.set(progressEl, {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(frames, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      });
      gsap.set(frameImages, { scale: 1.8 });
      gsap.set(copyEl, { autoAlpha: 0, y: 24 });
      gsap.set(titleEl, {
        x: 0,
        y: 0,
        scale: 1,
        transformOrigin: "top left",
        willChange: "transform",
      });

      const headerTitleEl = document.querySelector<HTMLElement>("[data-site-title]");
      const titleRect = titleEl.getBoundingClientRect();
      const headerRect = headerTitleEl?.getBoundingClientRect();

      const canSnapToHeader =
        Boolean(headerRect) &&
        titleRect.width > 0 &&
        titleRect.height > 0 &&
        (headerRect?.width ?? 0) > 0 &&
        (headerRect?.height ?? 0) > 0;

      const snapX = canSnapToHeader ? (headerRect!.left - titleRect.left) : 0;
      const snapY = canSnapToHeader ? (headerRect!.top - titleRect.top) : 0;
      const snapScale = canSnapToHeader
        ? headerRect!.width / titleRect.width
        : 0.35;

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
          x: snapX,
          y: snapY,
          scale: snapScale,
          duration: 1.3,
          ease: "power4.out",
          onComplete: nudgeTitleToHeader,
        })
        // As soon as the title has landed in its final spot,
        // reveal the real header underneath for a seamless handoff.
        .add(revealOnce)
        .to(
          titleEl,
          {
            autoAlpha: 0,
            duration: 0.25,
            ease: "power2.out",
          },
          "+=0.05",
        )
        .to(
          panelEl,
          {
            autoAlpha: 0,
            duration: 0.55,
            ease: "power2.out",
          },
          "<",
        )
        .to(rootEl, {
          autoAlpha: 0,
          duration: 0.2,
        })
        .add(completeOnce);
    }, rootEl);

    return () => ctx.revert();
  }, [onReveal, onComplete]);

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
