import { describe, expect, it } from 'vitest';
import {
  convertForMarkdown,
  DataRow,
  type DelimiterRow,
  escapeSpecialChars,
  HeaderRow,
  replaceForTable,
  toTable,
  toTableDataRow,
  toTableDataRows,
  toTableDelimiter,
  toTableHeader,
  validateTable,
} from '../src/table.js';

const Specials = {
  object: {
    header: ['|PIPE|CHANNEL|', '\\?\\', ' Space alian '] as HeaderRow,
    data: [['|PIPE|X|', '\\TR\\UE\\', ' Space Cat ']] as DataRow[],
  },
  markdown: {
    header: '| \\|PIPE\\|CHANNEL\\| | \\\\?\\\\ |  Space alian  |\n',
    data: '| \\|PIPE\\|X\\| | \\\\TR\\\\UE\\\\ |  Space Cat  |\n',
  },
} as const;

describe('table.ts', () => {
  describe('escapeSpecialChars', () => {
    it('should handle empty strings', () => {
      expect(escapeSpecialChars('')).toBe('');
    });
    it('should not escape normal text', () => {
      expect(escapeSpecialChars('foo')).toBe('foo');
    });
    it('should escape pipe character', () => {
      expect(escapeSpecialChars('foo|bar')).toBe('foo\\|bar');
    });
    it('should escape backslash', () => {
      expect(escapeSpecialChars('foo\\bar')).toBe('foo\\\\bar');
    });
    it('should escape all at once', () => {
      expect(escapeSpecialChars('|foo\\bar|')).toBe('\\|foo\\\\bar\\|');
    });

    it('should handle strings with only special characters', () => {
      expect(escapeSpecialChars('|\\')).toBe('\\|\\\\');
    });
    it('should handle strings with special characters and spaces', () => {
      expect(escapeSpecialChars(' |foo| bar\\ ')).toBe(' \\|foo\\| bar\\\\ ');
    });
  });

  describe('replaceForTable', () => {
    it('should replace newline with <br />', () => {
      expect(replaceForTable('foo\nbar')).toBe('foo<br />bar');
    });
    it('should not change text without newlines', () => {
      expect(replaceForTable('foo bar')).toBe('foo bar');
    });
    it('should handle multiple newlines', () => {
      expect(replaceForTable('foo\nbar\nbaz')).toBe('foo<br />bar<br />baz');
    });
    it('should handle empty strings', () => {
      expect(replaceForTable('')).toBe('');
    });
    it('should handle strings with only newlines', () => {
      expect(replaceForTable('\n\n')).toBe('<br /><br />');
    });
    it('should handle strings with leading and trailing newlines', () => {
      expect(replaceForTable('\nfoo\n')).toBe('<br />foo<br />');
    });
  });

  describe('convertForMarkdown', () => {
    it('should escape special characters and replace newlines', () => {
      expect(convertForMarkdown('foo|bar\nbaz')).toBe('foo\\|bar<br />baz');
    });
    it('should escape special characters without newlines', () => {
      expect(convertForMarkdown('foo|bar')).toBe('foo\\|bar');
    });
    it('should handle empty strings', () => {
      expect(convertForMarkdown('')).toBe('');
    });
  });

  describe('toTableHeader', () => {
    it('should handle empty header', () => {
      const header: string[] = [];
      expect(toTableHeader(header)).toBe('');
    });
    it('should handle a single cell', () => {
      const header = ['Only'];
      expect(toTableHeader(header)).toBe('| Only |\n');
    });
    it('should format a header with multiple cells', () => {
      const header = ['Column1', 'Column2', 'Column3'];
      expect(toTableHeader(header)).toBe('| Column1 | Column2 | Column3 |\n');
    });
    it('should format a header with empty cells', () => {
      const header = ['Column1', '', 'Column3'];
      expect(toTableHeader(header)).toBe('| Column1 |  | Column3 |\n');
    });
    it('should format a header with special characters', () => {
      const header = ['Name|Pipe', 'Age\\Backslash'];
      expect(toTableHeader(header)).toBe(
        '| Name\\|Pipe | Age\\\\Backslash |\n',
      );
    });
    it('should format a header with newlines', () => {
      const header = ['Name\nNewline', 'Age'];
      expect(toTableHeader(header)).toBe('| Name<br />Newline | Age |\n');
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
      const row = ['Alice', '30'];
      expect(toTableDataRow(row)).toBe('| Alice | 30 |\n');
    });
    it('should format a single header row contains special characters', () => {
      const row = Specials.object.data[0];
      expect(toTableHeader(row)).toBe(Specials.markdown.data);
    });
    it('should handle a single cell', () => {
      const row = ['Only'];
      expect(toTableDataRow(row)).toBe('| Only |\n');
    });
    it('should handle empty row', () => {
      const row = [] as string[];
      expect(toTableDataRow(row)).toBe('');
    });
    it('should handle a row with empty cells', () => {
      const row = ['Column1', '', 'Column3'];
      expect(toTableDataRow(row)).toBe('| Column1 |  | Column3 |\n');
    });
    it('should format a row with special characters', () => {
      const row = ['Name|Pipe', 'Age\\Backslash'];
      expect(toTableDataRow(row)).toBe('| Name\\|Pipe | Age\\\\Backslash |\n');
    });
    it('should format a row with newlines', () => {
      const row = ['Name\nNewline', 'Age'];
      expect(toTableDataRow(row)).toBe('| Name<br />Newline | Age |\n');
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
      console.log(toTable(table));
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

    it('should format a valid table with only spaces', () => {
      const table = {
        header: [' ', '  '],
        delimiter: [{}, {}],
        data: [['  ', '   ']],
      };
      console.log(toTable(table));
      expect(toTable(table)).toBe('|   |    |\n| --- | --- |\n|    |     |\n');
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
