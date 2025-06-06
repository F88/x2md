/**
 * Converts a string to a Markdown header.
 *
 * The output format is {@link https://spec.commonmark.org/0.31.2/#atx-headings | ATX headings}.
 *
 * @param value - The text to convert into a header.
 * @param level - The level of the header (1-6). If less than 1, it is treated as 1. If greater than 6, it is treated as 6.
 * @returns A string formatted as a Markdown header.
 *
 * @remarks
 * This function generates a Markdown header by repeating the `#` character according to the specified level, followed by a space and the provided text.
 * The level must be between 1 and 6, where 1 is the highest level (largest header) and 6 is the lowest level (smallest header).
 * If the level is less than 1, it is treated as 1. If the level is greater than 6, it is treated as 6.
 *
 * @example
 * ```typescript
 * import { toHeader } from 'x2md';
 * const header = toHeader('Header Level 1'); // "# Header Level 1\n"
 * const header0 = toHeader('Header Level 0', 0); // "# Header Level 0\n"
 * const header1 = toHeader('Header Level 1', 1); // "# Header Level 1\n"
 * const header2 = toHeader('Header Level 2', 2); // "## Header Level 2\n"
 * const header6 = toHeader('Header Level 6', 6); // "###### Header Level 6\n"
 * const header7 = toHeader('Header Level 7', 7); // "###### Header Level 7\n"
 * ```
 *
 * @public
 */
export function toHeader(value: string, level: number = 1): string {
  const normalizedLevel = Math.max(1, Math.min(level, 6));
  return `${'#'.repeat(normalizedLevel)} ${value}\n`;
}
