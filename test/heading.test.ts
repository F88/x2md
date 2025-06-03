import { describe, it, expect } from 'vitest';
import { toHeader } from '../src/heading.js';

describe('heading.ts.ts', () => {
  describe('toHeader', () => {
    it('should convert text to a level 1 header by default', () => {
      expect(toHeader('Hello World')).toBe('# Hello World\n');
    });

    it('should convert text to a specified valid header level', () => {
      expect(toHeader('Title', 1)).toBe('# Title\n');
      expect(toHeader('Subtitle', 2)).toBe('## Subtitle\n');
      expect(toHeader('Section', 3)).toBe('### Section\n');
      expect(toHeader('Subsection', 4)).toBe('#### Subsection\n');
      expect(toHeader('Minor heading', 5)).toBe('##### Minor heading\n');
      expect(toHeader('Smallest heading', 6)).toBe('###### Smallest heading\n');
    });

    it('should treat level 0 as 1', () => {
      expect(toHeader('Level Zero', 0)).toBe('# Level Zero\n');
    });

    it('should treat negative level as 1', () => {
      expect(toHeader('Negative Level', -1)).toBe('# Negative Level\n');
      expect(toHeader('Another Negative', -5)).toBe('# Another Negative\n');
    });

    it('should treat level greater than 6 as 6', () => {
      expect(toHeader('Level Seven', 7)).toBe('###### Level Seven\n');
      expect(toHeader('Level Ten', 10)).toBe('###### Level Ten\n');
    });

    it('should handle an empty string value', () => {
      expect(toHeader('', 1)).toBe('# \n');
      expect(toHeader('')).toBe('# \n');
      expect(toHeader('', 3)).toBe('### \n');
    });

    it('should handle text with special markdown characters correctly', () => {
      expect(toHeader('Text with *asterisks*', 2)).toBe(
        '## Text with *asterisks*\n',
      );
      expect(toHeader('Text with _underscores_', 1)).toBe(
        '# Text with _underscores_\n',
      );
    });

    it('should handle text with leading/trailing spaces in value (spaces are preserved)', () => {
      expect(toHeader('  Spaced Out  ', 1)).toBe('#   Spaced Out  \n');
    });
  });
});
