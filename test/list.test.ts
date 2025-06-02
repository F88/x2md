import { describe, it, expect } from 'vitest';
import { toListItem, toList } from '../src/list.js';

describe('toListItem', () => {
  it('should convert text to a list item with no indentation by default', () => {
    expect(toListItem('First item')).toBe('- First item');
  });

  it('should convert text to a list item with specified indentation level', () => {
    expect(toListItem('Item at level 0', 0)).toBe('- Item at level 0');
    expect(toListItem('Item at level 1', 1)).toBe('    - Item at level 1');
    expect(toListItem('Item at level 2', 2)).toBe('        - Item at level 2');
  });

  it('should default to indentation level 0 if level is negative', () => {
    expect(toListItem('Negative indent', -1)).toBe('- Negative indent');
    expect(toListItem('Another negative indent', -5)).toBe(
      '- Another negative indent',
    );
  });

  it('should handle an empty string value', () => {
    expect(toListItem('', 0)).toBe('- ');
    expect(toListItem('')).toBe('- '); // Default indent level 0
    expect(toListItem('', 1)).toBe('    - ');
  });

  it('should handle text with special markdown characters correctly', () => {
    expect(toListItem('Item with *asterisks*', 0)).toBe(
      '- Item with *asterisks*',
    );
    expect(toListItem('Item with _underscores_', 1)).toBe(
      '    - Item with _underscores_',
    );
  });

  it('should handle text with leading/trailing spaces in value (spaces are preserved)', () => {
    expect(toListItem('  Spaced Out  ', 0)).toBe('-   Spaced Out  ');
    expect(toListItem('  Spaced Out  ', 1)).toBe('    -   Spaced Out  ');
  });
});

describe('toList', () => {
  it('should return an empty string for an empty array of items', () => {
    expect(toList([])).toBe('');
    expect(toList([], 1)).toBe('');
  });

  it('should convert an array of strings to a Markdown list with no indentation by default', () => {
    const items = ['Item 1', 'Item 2', 'Item 3'];
    const expected = '- Item 1\n- Item 2\n- Item 3\n';
    expect(toList(items)).toBe(expected);
  });

  it('should convert an array of strings to a Markdown list with specified indentation level', () => {
    const items = ['Apple', 'Banana'];
    expect(toList(items, 0)).toBe('- Apple\n- Banana\n');
    expect(toList(items, 1)).toBe('    - Apple\n    - Banana\n');
    expect(toList(items, 2)).toBe('        - Apple\n        - Banana\n');
  });

  it('should default to indentation level 0 for the list if level is negative', () => {
    const items = ['Cherry', 'Date'];
    const expected = '- Cherry\n- Date\n';
    expect(toList(items, -1)).toBe(expected);
    expect(toList(items, -5)).toBe(expected);
  });

  it('should handle an array with a single item', () => {
    expect(toList(['Single'])).toBe('- Single\n');
    expect(toList(['Single Indented'], 1)).toBe('    - Single Indented\n');
  });

  it('should handle items with special markdown characters correctly', () => {
    const items = ['*Important*', '_Emphasized_'];
    const expected = '- *Important*\n- _Emphasized_\n';
    expect(toList(items)).toBe(expected);

    const expectedIndented = '    - *Important*\n    - _Emphasized_\n';
    expect(toList(items, 1)).toBe(expectedIndented);
  });

  it('should handle items with leading/trailing spaces (spaces are preserved)', () => {
    const items = ['  Item A  ', 'Item B  '];
    const expected = '-   Item A  \n- Item B  \n';
    expect(toList(items)).toBe(expected);

    const expectedIndented = '    -   Item A  \n    - Item B  \n';
    expect(toList(items, 1)).toBe(expectedIndented);
  });

  it('should handle an array with empty strings as items', () => {
    const items = ['', 'Not Empty', ''];
    const expected = '- \n- Not Empty\n- \n';
    expect(toList(items)).toBe(expected);

    const expectedIndented = '    - \n    - Not Empty\n    - \n';
    expect(toList(items, 1)).toBe(expectedIndented);
  });
});
