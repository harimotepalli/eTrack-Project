import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper function to merge tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
