import { useState, useRef, useEffect, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "placeholder"> {
  /** Show blur placeholder while loading */
  blurDataURL?: string;
  /** Mark as high-priority (eager loading, high fetch priority) — use for hero/above-fold images */
  priority?: boolean;
}

/**
 * OptimizedImage — a React equivalent of Next.js <Image> for Vite projects.
 * Features:
 * - Native lazy loading (unless priority=true)
 * - Blur placeholder with smooth fade-in transition
 * - High-priority fetch for hero/above-fold images
 * - Progressive enhancement (works without JS for the img tag)
 */
const OptimizedImage = ({
  src,
  alt = "",
  className,
  blurDataURL,
  priority = false,
  style,
  ...rest
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // If the image is already cached/complete by the time we mount, mark loaded
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  return (
    <div className="relative overflow-hidden">
      {/* Blur placeholder backdrop */}
      {blurDataURL && (
        <img
          src={blurDataURL}
          alt=""
          aria-hidden="true"
          className={cn(
            "absolute inset-0 w-full h-full object-cover filter blur-lg scale-110 transition-opacity duration-500",
            isLoaded ? "opacity-0" : "opacity-100"
          )}
          style={{ zIndex: 1 }}
        />
      )}

      {/* Actual image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "block w-full h-auto transition-opacity duration-500",
          className,
          blurDataURL && !isLoaded ? "opacity-0" : "opacity-100"
        )}
        style={{ position: "relative", zIndex: 2, ...style }}
        {...rest}
      />
    </div>
  );
};

export default OptimizedImage;
