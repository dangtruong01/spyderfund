import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const fetcherWithHeaders = (url: string, options: RequestInit) =>
  fetch(url, options).then((res) => {
    if (!res.ok) {
      throw new Error("Network error");
    }
    return res.json();
  });