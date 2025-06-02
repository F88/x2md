import { describe, it, expect } from 'vitest';
import { toHeader, toList, toListItem } from '../src/index.js';

describe('Index Exports', () => {
  it('should export the toHeader function', () => {
    expect(toHeader).toBeDefined();
    expect(typeof toHeader).toBe('function');
  });

  it('should export the toList function', () => {
    expect(toList).toBeDefined();
    expect(typeof toList).toBe('function');
  });

  it('should export the toListItem function', () => {
    expect(toListItem).toBeDefined();
    expect(typeof toListItem).toBe('function');
  });
});
