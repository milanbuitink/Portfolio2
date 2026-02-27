import { blurPlaceholders } from "@/data/image-placeholders";

/**
 * Get the blur placeholder data URL for a given image URL.
 * Works for local images referenced via `new URL('../../images/X.webp', import.meta.url).href`
 */
export function getBlurPlaceholder(imageUrl: string): string | undefined {
  // Extract the filename without extension from the URL
  // Handles both "/assets/Timbertunes-abc123.webp" (built) and blob/data URLs
  for (const [name, dataUrl] of Object.entries(blurPlaceholders)) {
    if (imageUrl.includes(name)) {
      return dataUrl;
    }
  }
  return undefined;
}
