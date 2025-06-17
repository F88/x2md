/**
 * Converts a URL to a Markdown link.
 *
 * The output format follows {@link https://spec.commonmark.org/0.31.2/#links | CommonMark link specification}.
 *
 * @param textOrUrl - When `url` is provided, this is the text to display for the link. When `url` is not provided, this is the URL to use as both text and destination.
 * @param url - Optional URL destination for the link. If not provided, `textOrUrl` will be used as both text and destination.
 * @returns A string formatted as a Markdown link.
 *
 * @remarks
 * This function generates a Markdown link in the format `[text](url)`. When called with one parameter,
 * the URL serves as both the link text and the destination. When called with two parameters,
 * the first parameter is the link text and the second is the destination URL.
 *
 * @example
 * ```typescript
 * import { toLink } from 'x2md';
 * // Single parameter: URL as both text and destination
 * const link1 = toLink('https://example.com'); // "[https://example.com](https://example.com)"
 * const link2 = toLink('mailto:user@example.com'); // "[mailto:user@example.com](mailto:user@example.com)"
 *
 * // Two parameters: custom text and URL
 * const link3 = toLink('Example Website', 'https://example.com'); // "[Example Website](https://example.com)"
 * const link4 = toLink('Contact Us', 'mailto:support@example.com'); // "[Contact Us](mailto:support@example.com)"
 * ```
 *
 * @public
 */
export function toLink(textOrUrl: string, url?: string): string {
  if (url === undefined) {
    // Single parameter case: use URL as both text and destination
    return `[${textOrUrl}](${textOrUrl})`;
  } else {
    // Two parameter case: use text and URL
    return `[${textOrUrl}](${url})`;
  }
}
