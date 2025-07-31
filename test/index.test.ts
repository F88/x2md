import { describe, it, expect } from 'vitest';
import {
  toHeader,
  toList,
  toListItem,
  toYamlFrontMatter,
  toTomlFrontMatter,
  toFrontMatter,
} from '../src/index.js';

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

  it('should export the toYamlFrontMatter function', () => {
    expect(toYamlFrontMatter).toBeDefined();
    expect(typeof toYamlFrontMatter).toBe('function');
  });

  it('should export the toTomlFrontMatter function', () => {
    expect(toTomlFrontMatter).toBeDefined();
    expect(typeof toTomlFrontMatter).toBe('function');
  });

  it('should export the toFrontMatter function', () => {
    expect(toFrontMatter).toBeDefined();
    expect(typeof toFrontMatter).toBe('function');
  });
});
