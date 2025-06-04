import { describe, expect, it } from 'vitest';
import {
  type DelimiterRow,
  toTable,
  toTableDataRow,
  toTableDataRows,
  toTableDelimiter,
  toTableHeader,
  validateTable,
  escapeSpecialChars,
  HeaderRow,
  DataRow,
} from '../src/table.js';

const Specials = {
  object: {
    header: ['|PIPE|CHANNEL|', '\\?\\', ' Space alian '] as HeaderRow,
    data: [['|PIPE|X|', '\\TR\\UE\\', ' Space Cat ']] as DataRow[],
  },
  markdown: {
    header: '| \\|PIPE\\|CHANNEL\\| | \\\\?\\\\ | \\ Space alian\\  |\n',
    data: '| \\|PIPE\\|X\\| | \\\\TR\\\\UE\\\\ | \\ Space Cat\\  |\n',
  },
} as const;

describe('table.ts', () => {
  describe('escapeSpecialChars', () => {
    it('should escape pipe character', () => {
      expect(escapeSpecialChars('foo|bar')).toBe('foo\\|bar');
    });
    it('should escape backslash', () => {
      expect(escapeSpecialChars('foo\\bar')).toBe('foo\\\\bar');
    });
    it('should escape leading spaces', () => {
      expect(escapeSpecialChars('  foo')).toBe('\\ \\ foo');
    });
    it('should escape trailing spaces', () => {
      expect(escapeSpecialChars('foo  ')).toBe('foo\\ \\ ');
    });
    it('should escape both leading and trailing spaces', () => {
      expect(escapeSpecialChars('  foo  ')).toBe('\\ \\ foo\\ \\ ');
    });
    it('should escape all at once', () => {
      expect(escapeSpecialChars(' |foo\\bar| ')).toBe('\\ \\|foo\\\\bar\\|\\ ');
    });
    it('should not escape normal text', () => {
      expect(escapeSpecialChars('foo')).toBe('foo');
    });
  });

  describe('toTableHeader', () => {
    it('should format a single header row', () => {
      const header = ['Name', 'Age'];
      expect(toTableHeader(header)).toBe('| Name | Age |\n');
    });
    it('should format a single header row contains special characters', () => {
      const header = Specials.object.header;
      expect(toTableHeader(header)).toBe(Specials.markdown.header);
    });
    it('should handle a single cell', () => {
      const header = ['Only'];
      expect(toTableHeader(header)).toBe('| Only |\n');
    });
    it('should handle empty header', () => {
      const header: string[] = [];
      expect(toTableHeader(header)).toBe('');
    });
  });

  describe('toTableDelimiter', () => {
    it('should format a single delimiter row', () => {
      const delimiter: DelimiterRow = [
        { alignment: 'left' },
        { alignment: 'center' },
      ];
      expect(toTableDelimiter(delimiter)).toBe('| :--- | :---: |\n');
    });

    it('should handle a single cell with default alignment', () => {
      const delimiter: DelimiterRow = [{}];
      expect(toTableDelimiter(delimiter)).toBe('| --- |\n');
    });

    it('should handle multiple cells with different alignments', () => {
      const delimiter: DelimiterRow = [
        { alignment: 'left' },
        { alignment: 'center' },
        { alignment: 'right' },
      ];
      expect(toTableDelimiter(delimiter)).toBe('| :--- | :---: | ---: |\n');
    });

    it('should handle empty delimiter row', () => {
      const delimiter: DelimiterRow = [];
      expect(toTableDelimiter(delimiter)).toBe('');
    });
  });

  describe('toTableDataRow', () => {
    it('should format a data row', () => {
      const row: string[] = ['Alice', '30'];
      expect(toTableDataRow(row)).toBe('| Alice | 30 |\n');
    });
    it('should format a single header row contains special characters', () => {
      const row = Specials.object.data[0];
      expect(toTableHeader(row)).toBe(Specials.markdown.data);
    });
    it('should handle a single cell', () => {
      const row: string[] = ['Only'];
      expect(toTableDataRow(row)).toBe('| Only |\n');
    });
    it('should handle empty row', () => {
      const row: string[] = [];
      expect(toTableDataRow(row)).toBe('');
    });
  });

  describe('toTableDataRows', () => {
    it('should format multiple data rows', () => {
      const rows: string[][] = [
        ['Alice', '30'],
        ['Bob', '25'],
      ];
      expect(toTableDataRows(rows)).toBe('| Alice | 30 |\n| Bob | 25 |\n');
    });
    it('should format multiple data rows contains special characters', () => {
      const rows = [Specials.object.data[0], Specials.object.data[0]];
      const expected = Specials.markdown.data + Specials.markdown.data;
      expect(toTableDataRows(rows)).toBe(expected);
    });
    it('should handle a single row', () => {
      const rows: string[][] = [['Single', 'Row']];
      expect(toTableDataRows(rows)).toBe('| Single | Row |\n');
    });
    it('should handle a single cell', () => {
      const rows: string[][] = [['Only']];
      expect(toTableDataRows(rows)).toBe('| Only |\n');
    });
    it('should return empty string for empty data', () => {
      const rows: string[][] = [];
      expect(toTableDataRows(rows)).toBe('');
    });
    it('should return empty string for a row with no cells', () => {
      const rows: string[][] = [[]];
      expect(toTableDataRows(rows)).toBe('');
    });
  });

  describe('validateTable', () => {
    it('should return true for a valid table', () => {
      const table = {
        header: ['Name', 'Age'],
        delimiter: [
          { alignment: 'left' as const },
          { alignment: 'right' as const },
        ],
        data: [
          ['Alice', '30'],
          ['Bob', '25'],
        ],
      };
      expect(validateTable(table)).toStrictEqual({ isValid: true });
    });

    it('should return false if header and delimiter lengths mismatch', () => {
      const table = {
        header: ['Name', 'Age'],
        delimiter: [{ alignment: 'left' as const }],
        data: [['Alice', '30']],
      };
      expect(validateTable(table)).toStrictEqual({
        isValid: false,
        message: 'Table header and delimiter lengths do not match',
      });
    });

    it('should return false if data row length mismatches header', () => {
      const table = {
        header: ['Name', 'Age'],
        delimiter: [
          { alignment: 'left' as const },
          { alignment: 'right' as const },
        ],
        data: [
          ['Alice'],
          ['Bob', '25'],
          ['Charlie', '30', 'true'],
          ['David', '28'],
          ['Eve', '22', 'false'],
          ['Frank', '35'],
        ],
      };
      expect(validateTable(table)).toStrictEqual({
        isValid: false,
        message:
          'Data row length does not match header length at line(s): 1, 3, 5',
      });
    });

    it('should return false for empty table', () => {
      const table = {
        header: [],
        delimiter: [],
        data: [],
      };
      expect(validateTable(table)).toStrictEqual({
        isValid: false,
        message: 'Table header is empty',
      });
    });
  });

  describe('toTable', () => {
    it('should format a valid table', () => {
      const table = {
        header: ['Name', 'Age'],
        delimiter: [{}, {}],
        data: [
          ['Alice', '30'],
          ['Bob', '25'],
        ],
      };
      expect(toTable(table)).toBe(
        '| Name | Age |\n| --- | --- |\n| Alice | 30 |\n| Bob | 25 |\n',
      );
    });

    it('should format a valid table with custom delimiter alignments', () => {
      const table = {
        header: ['Name', 'Age'],
        delimiter: [{}, {}],
        data: [
          ['Alice', '30'],
          ['Bob', '25'],
        ],
      };
      const customDelimiter: DelimiterRow = [
        { alignment: 'left' },
        { alignment: 'right' },
      ];
      expect(toTable(table, customDelimiter)).toBe(
        '| Name | Age |\n| :--- | ---: |\n| Alice | 30 |\n| Bob | 25 |\n',
      );
    });

    it('should throw on invalid table (header/delimiter mismatch)', () => {
      const table = {
        header: ['Name', 'Age'],
        delimiter: [{ alignment: 'left' as const }],
        data: [['Alice', '30']],
      };
      expect(() => toTable(table)).toThrow('Invalid table structure');
    });

    it('should throw on invalid table (data row mismatch)', () => {
      const table = {
        header: ['Name', 'Age'],
        delimiter: [
          { alignment: 'left' as const },
          { alignment: 'right' as const },
        ],
        data: [['Alice']],
      };
      expect(() => toTable(table)).toThrow('Invalid table structure');
    });

    it('should throw on empty table', () => {
      const table = {
        header: [],
        delimiter: [],
        data: [],
      };
      expect(() => toTable(table)).toThrow('Invalid table structure');
    });
  });
});
