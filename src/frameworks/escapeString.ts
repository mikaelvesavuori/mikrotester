/**
 * @description Escape a string.
 */
export function escapeString(value: any) {
  if (typeof value === 'string') return value;
  return JSON.stringify(value).replace(/\s/g, '%20').replace(/"/gi, '\\"');
}
