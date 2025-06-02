/**
 * Converts a string to a Markdown header.
 *
 * The output format is {@link https://spec.commonmark.org/0.31.2/#atx-headings | ATX headings}.
 *
 * @param value - The text to convert into a header.
 * @param level - The level of the header (1-6).
 * @returns A string formatted as a Markdown header.
 *
 * @remarks
 * This function generates a Markdown header by repeating the `#` character according to the specified level, followed by a space and the provided text.
 * * The level must be between 1 and 6, where 1 is the highest level (largest header) and 6 is the lowest level (smallest header).
 * * If the level is outside this range, it defaults to 1.
 *
 * @example
 * ```typescript
 * import { toHeader } from '@msn088/x2md';
 * const header1 = toHeader('Header Level 1'); // "# Header Level 1"
 * const header2 = toHeader('Header Level 2', 2); // "## Header Level 2"
 * const header3 = toHeader('Header Level 3', 3); // "### Header Level 3"
 * const header6 = toHeader('Header Level 6', 6); // "###### Header Level 6"
 * ```
 *
 * @public
 */
export function toHeader(value: string, level: number = 1): string {
  const normalizedLevel = 1 <= level && level <= 6 ? level : 1;
  return `${'#'.repeat(normalizedLevel)} ${value}`;
}
