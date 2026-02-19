import { projects } from "@/data/projects";
import { siteConfig } from "@/data/siteConfig";

const preloadedImages = new Set<string>();
const inFlightPreloads = new Map<string, Promise<void>>();
const retainedImages = new Map<string, HTMLImageElement>();

const normalizeUrl = (url: string) => url.trim();

const preloadImage = (url: string): Promise<void> => {
  const normalizedUrl = normalizeUrl(url);
  if (!normalizedUrl) {
    return Promise.resolve();
  }

  if (preloadedImages.has(normalizedUrl)) {
    return Promise.resolve();
  }

  const existingRequest = inFlightPreloads.get(normalizedUrl);
  if (existingRequest) {
    return existingRequest;
  }

  const request = new Promise<void>((resolve) => {
    const image = new Image();

    image.onload = () => {
      preloadedImages.add(normalizedUrl);
      retainedImages.set(normalizedUrl, image);
      inFlightPreloads.delete(normalizedUrl);
      resolve();
    };

    image.onerror = () => {
      inFlightPreloads.delete(normalizedUrl);
      resolve();
    };

    image.decoding = "async";
    image.fetchPriority = "high";
    image.src = normalizedUrl;

    if (image.complete) {
      preloadedImages.add(normalizedUrl);
      retainedImages.set(normalizedUrl, image);
      inFlightPreloads.delete(normalizedUrl);
      resolve();
    }
  });

  inFlightPreloads.set(normalizedUrl, request);
  return request;
};

const getAllSiteImageUrls = (): string[] => {
  const imageUrls = new Set<string>();

  if (siteConfig.about.portrait) {
    imageUrls.add(siteConfig.about.portrait);
  }

  for (const project of projects) {
    if (project.thumbnail) {
      imageUrls.add(project.thumbnail);
    }

    for (const image of project.images) {
      if (image.src) {
        imageUrls.add(image.src);
      }
    }
  }

  return [...imageUrls];
};

export const preloadAllSiteImages = async (): Promise<void> => {
  const urls = getAllSiteImageUrls();
  await Promise.all(urls.map((url) => preloadImage(url)));
};

export const startGlobalImagePreload = () => {
  const runPreload = () => {
    void preloadAllSiteImages();
  };

  const requestIdle = (window as Window & typeof globalThis & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  }).requestIdleCallback;

  if (requestIdle) {
    requestIdle(runPreload, { timeout: 1500 });
    return;
  }

  globalThis.setTimeout(runPreload, 0);
};
