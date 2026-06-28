/**
 * Simple Classname Merger
 * Combines classes dynamically, filtering out falsy values (like active/inactive conditional classes).
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
export default cn;
