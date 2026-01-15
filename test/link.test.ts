import { describe, it, expect } from 'vitest';
import { toLink } from '../src/link.js';

describe('link.ts', () => {
  describe('toLink', () => {
    describe('single parameter (URL only)', () => {
      it('should convert a simple URL to a markdown link', () => {
        expect(toLink('https://example.com')).toBe(
          '[https://example.com](https://example.com)',
        );
      });

      it('should handle HTTP URLs', () => {
        expect(toLink('http://example.com')).toBe(
          '[http://example.com](http://example.com)',
        );
      });

      it('should handle HTTPS URLs', () => {
        expect(toLink('https://secure.example.com')).toBe(
          '[https://secure.example.com](https://secure.example.com)',
        );
      });

      it('should handle URLs with paths', () => {
        const url = 'https://example.com/path/to/page';
        expect(toLink(url)).toBe(`[${url}](${url})`);
      });

      it('should handle URLs with query parameters', () => {
        const url = 'https://example.com?param=value&other=test';
        expect(toLink(url)).toBe(`[${url}](${url})`);
      });

      it('should handle URLs with fragments', () => {
        const url = 'https://example.com/page#section';
        expect(toLink(url)).toBe(`[${url}](${url})`);
      });

      it('should handle mailto URLs', () => {
        const url = 'mailto:user@example.com';
        expect(toLink(url)).toBe(`[${url}](${url})`);
      });

      it('should handle ftp URLs', () => {
        const url = 'ftp://files.example.com/file.txt';
        expect(toLink(url)).toBe(`[${url}](${url})`);
      });

      it('should handle empty string', () => {
        expect(toLink('')).toBe('[]()');
      });

      it('should handle URLs with special characters', () => {
        const url = 'https://example.com/path with spaces';
        expect(toLink(url)).toBe(`[${url}](${url})`);
      });

      it('should handle relative URLs', () => {
        const url = '/relative/path';
        expect(toLink(url)).toBe(`[${url}](${url})`);
      });

      it('should handle URLs with ports', () => {
        const url = 'https://example.com:8080/path';
        expect(toLink(url)).toBe(`[${url}](${url})`);
      });
    });

    describe('two parameters (text and URL)', () => {
      it('should convert text and URL to a markdown link', () => {
        expect(toLink('Example Website', 'https://example.com')).toBe(
          '[Example Website](https://example.com)',
        );
      });

      it('should handle empty text', () => {
        expect(toLink('', 'https://example.com')).toBe(
          '[](https://example.com)',
        );
      });

      it('should handle empty URL', () => {
        expect(toLink('Example', '')).toBe('[Example]()');
      });

      it('should handle both empty text and URL', () => {
        expect(toLink('', '')).toBe('[]()');
      });

      it('should handle text with special characters', () => {
        expect(toLink('Text with *asterisks*', 'https://example.com')).toBe(
          '[Text with *asterisks*](https://example.com)',
        );
        expect(toLink('Text with _underscores_', 'https://example.com')).toBe(
          '[Text with _underscores_](https://example.com)',
        );
        expect(toLink('Text with [brackets]', 'https://example.com')).toBe(
          '[Text with [brackets]](https://example.com)',
        );
      });

      it('should handle text with leading/trailing spaces', () => {
        expect(toLink('  Spaced Text  ', 'https://example.com')).toBe(
          '[  Spaced Text  ](https://example.com)',
        );
      });

      it('should handle different URL schemes', () => {
        expect(toLink('Email Me', 'mailto:user@example.com')).toBe(
          '[Email Me](mailto:user@example.com)',
        );
        expect(
          toLink('Download File', 'ftp://files.example.com/file.txt'),
        ).toBe('[Download File](ftp://files.example.com/file.txt)');
        expect(toLink('Local File', 'file:///path/to/file.txt')).toBe(
          '[Local File](file:///path/to/file.txt)',
        );
      });

      it('should handle complex URLs with all components', () => {
        const url =
          'https://user:password@example.com:8080/path/to/page?param=value&other=test#section';
        expect(toLink('Complex Link', url)).toBe(`[Complex Link](${url})`);
      });

      it('should handle relative URLs', () => {
        expect(toLink('Relative Link', '/relative/path')).toBe(
          '[Relative Link](/relative/path)',
        );
        expect(toLink('Another Relative', '../parent/path')).toBe(
          '[Another Relative](../parent/path)',
        );
        expect(toLink('Current Dir', './current/path')).toBe(
          '[Current Dir](./current/path)',
        );
      });

      it('should handle URLs with special characters that need no encoding', () => {
        const url = 'https://example.com/path with spaces and (parentheses)';
        expect(toLink('Special Chars', url)).toBe(`[Special Chars](${url})`);
      });

      it('should handle multiline text (newlines preserved)', () => {
        const text = 'Line 1\nLine 2';
        expect(toLink(text, 'https://example.com')).toBe(
          '[Line 1\nLine 2](https://example.com)',
        );
      });
    });
  });
});
