/**
 * Converts a string to a list item with a specified indentation level.
 *
 * @param value - The text content of the list item.
 * @param indentLevel - The indentation level of the list item. Defaults to 0. If negative, it is treated as 0.
 * @returns A string formatted as a Markdown list item.
 *
 * @remarks
 * This function ensures that the `indentLevel` is non-negative; negative values are treated as 0.
 * It adds a hyphen (`-`) and a space before the provided text to create a list item.
 * The `indentLevel` parameter controls the number of spaces before the hyphen, with each level adding 4 spaces.
 *
 * @example
 * ```typescript
 * import { toListItem } from '@msn088/x2md';
 * const item1 = toListItem('First item'); // "- First item"
 * const item2 = toListItem('Second item', 1); // "    - Second item"
 * const item3 = toListItem('Third item', 2); // "        - Third item"
 * ```
 *
 * @public
 */
export function toListItem(value: string, indentLevel: number = 0): string {
  const normalizedIndentLevel = Math.max(0, indentLevel);
  const indent = ' '.repeat(4 * normalizedIndentLevel);
  return `${indent}- ${value}`;
}

/**
 * Converts an array of strings into a Markdown list.
 *
 * @param items - An array of strings, where each string represents a list item.
 * @param indentLevel - The indentation level for the entire list. Defaults to 0. If negative, it will be treated as 0 by the underlying `toListItem` calls.
 * @returns A string formatted as a Markdown list.
 *
 * @remarks
 * This function iterates through the provided array of strings and converts each string into a list item using the `toListItem` function.
 * Each list item is placed on a new line. The `toListItem` function ensures that negative `indentLevel` values are treated as 0.
 * The `indentLevel` parameter applies the same indentation to all items in the list.
 *
 * @example
 * ```typescript
 * import { toList } from '@msn088/x2md';
 * const listItems = ['Item 1', 'Item 2', 'Item 3'];
 * const markdownList = toList(listItems);
 * // Output:
 * // - Item 1
 * // - Item 2
 * // - Item 3
 *
 * const indentedList = toList(listItems, 1);
 * // Output:
 * //     - Item 1
 * //     - Item 2
 * //     - Item 3
 * ```
 *
 * @public
 */
export function toList(items: string[], indentLevel: number = 0): string {
  if (!Array.isArray(items) || items.length === 0) {
    return '';
  }
  // toListItem handles normalization of indentLevel
  const s =
    items.map((item) => toListItem(item, indentLevel)).join('\n') + '\n';
  return s;
}
