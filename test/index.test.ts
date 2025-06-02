import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('f', () => {
  it("should return 'Hello, world!'", () => {
    expect(f()).toBe('Hello, world!');
  });
});
