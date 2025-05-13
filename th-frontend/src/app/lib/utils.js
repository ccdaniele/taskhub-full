import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

/**
 * Merges multiple class name strings into a single string.
 *
 * @param {...(string|object|Array)} inputs - A list of class name strings, objects, or arrays.
 * @returns {string} - A single string containing all the merged class names.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
