import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ImageMetadata } from "astro";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

interface ImageImport {
  default: ImageMetadata;
}

const imageModules = import.meta.glob<ImageImport>(
  "/src/assets/**/*.{jpeg,jpg,png,gif,webp}",
  { eager: true }
);

export function getImageByPath(path: string): ImageMetadata | undefined {
  const key = Object.keys(imageModules).find((k) => k.includes(path));
  return key ? imageModules[key].default : undefined;
}
