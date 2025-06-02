import { describe, it, expect } from 'vitest';
import { toHeader } from '../src/heading.js';

describe('toHeader', () => {
  it('should convert text to a level 1 header by default', () => {
    expect(toHeader('Hello World')).toBe('# Hello World');
  });

  it('should convert text to a specified valid header level', () => {
    expect(toHeader('Title', 1)).toBe('# Title');
    expect(toHeader('Subtitle', 2)).toBe('## Subtitle');
    expect(toHeader('Section', 3)).toBe('### Section');
    expect(toHeader('Subsection', 4)).toBe('#### Subsection');
    expect(toHeader('Minor heading', 5)).toBe('##### Minor heading');
    expect(toHeader('Smallest heading', 6)).toBe('###### Smallest heading');
  });

  it('should default to level 1 if level is 0', () => {
    expect(toHeader('Level Zero', 0)).toBe('# Level Zero');
  });

  it('should default to level 1 if level is less than 0', () => {
    expect(toHeader('Negative Level', -1)).toBe('# Negative Level');
    expect(toHeader('Another Negative', -5)).toBe('# Another Negative');
  });

  it('should default to level 6 if level is greater than 6', () => {
    expect(toHeader('Level Seven', 7)).toBe('###### Level Seven');
    expect(toHeader('Level Ten', 10)).toBe('###### Level Ten');
  });

  it('should handle an empty string value', () => {
    expect(toHeader('', 1)).toBe('# ');
    expect(toHeader('')).toBe('# ');
    expect(toHeader('', 3)).toBe('### ');
  });

  it('should handle text with special markdown characters correctly', () => {
    expect(toHeader('Text with *asterisks*', 2)).toBe(
      '## Text with *asterisks*',
    );
    expect(toHeader('Text with _underscores_', 1)).toBe(
      '# Text with _underscores_',
    );
  });

  it('should handle text with leading/trailing spaces in value (spaces are preserved)', () => {
    expect(toHeader('  Spaced Out  ', 1)).toBe('#   Spaced Out  ');
  });
});
