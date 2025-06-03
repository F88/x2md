import { describe, expect, it } from 'vitest';
import {
  type DelimiterRow,
  parseTsv,
  toTable,
  toTableDataRow,
  toTableDataRows,
  toTableDelimiter,
  toTableHeader,
  tsvToTable,
  validateTable,
} from '../src/table.js';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('table.ts', () => {
  describe('parseTsv', () => {
    it('should parse TSV into Table structure', () => {
      const tsv = 'Name\tAge\nAlice\t30\nBob\t25';
      const table = parseTsv(tsv);
      expect(table.header).toEqual(['Name', 'Age']);
      expect(table.data).toEqual([
        ['Alice', '30'],
        ['Bob', '25'],
      ]);
      expect(table.delimiter.length).toBe(2);
      expect(table.delimiter[0].alignment).toBeUndefined(); // Default alignment is left
      expect(table.delimiter[1].alignment).toBeUndefined(); // Default alignment is left
    });
    it('should handle single row TSV', () => {
      const tsv = 'Only\nValue';
      const table = parseTsv(tsv);
      expect(table.header).toEqual(['Only']);
      expect(table.data).toEqual([['Value']]);
      expect(table.delimiter.length).toBe(1);
    });
    it('should handle empty TSV', () => {
      const tsv = '';
      const table = parseTsv(tsv);
      expect(table.header).toEqual(['']);
      expect(table.data).toEqual([]);
      expect(table.delimiter.length).toBe(1);
    });
  });

  describe('toTableHeader', () => {
    it('should format a single header row', () => {
      const header = ['Name', 'Age'];
      expect(toTableHeader(header)).toBe('| Name | Age |\n');
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
        delimiter: [
          { alignment: 'left' as const },
          { alignment: 'right' as const },
        ],
        data: [
          ['Alice', '30'],
          ['Bob', '25'],
        ],
      };
      expect(toTable(table)).toBe(
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

  describe('tsvToTable', () => {
    it('should convert valid TSV to markdown table', () => {
      const tsv = 'Name\tAge\nAlice\t30\nBob\t25';
      const expected =
        '| Name | Age |\n' +
        '| --- | --- |\n' +
        '| Alice | 30 |\n' +
        '| Bob | 25 |\n';
      // left alignment is default for all columns
      expect(tsvToTable(tsv)).toBe(expected);
    });

    it('should handle single row TSV', () => {
      const tsv = 'Only\nValue';
      const expected = '| Only |\n' + '| --- |\n' + '| Value |\n';
      expect(tsvToTable(tsv)).toBe(expected);
    });

    it('should throw on empty TSV', () => {
      const tsv = '';
      expect(() => tsvToTable(tsv)).toThrow('Invalid table structure');
    });

    it('should throw if data row length mismatches header', () => {
      const tsv = 'A\tB\n1';
      expect(() => tsvToTable(tsv)).toThrow('Invalid table structure');
    });

    it('should convert a real TSV file 1 to markdown table', () => {
      const tsvPath = join(__dirname, 'fixtures', '1.tsv');
      const tsv = readFileSync(tsvPath, 'utf-8');
      const expected =
        '| Name | Age |\n' +
        '| --- | --- |\n' +
        '| Alice | 30 |\n' +
        '| Bob | 25 |\n';
      expect(tsvToTable(tsv)).toBe(expected);
    });

    it('should convert a real TSV file 2 to markdown table', () => {
      const tsvPath = join(__dirname, 'fixtures', '2.tsv');
      const tsv = readFileSync(tsvPath, 'utf-8');
      const expected =
        '| Name | Age |\n' +
        '| --- | --- |\n' +
        '| Alice | 30 |\n' +
        '| Bob | 25 |\n';
      expect(tsvToTable(tsv)).toBe(expected);
    });

    it('should convert a real TSV file 3 to markdown table', () => {
      const tsvPath = join(__dirname, 'fixtures', 'weather.tsv');
      const tsv = readFileSync(tsvPath, 'utf-8');
      const expected =
        '| MinTemp | MaxTemp | Rainfall | Evaporation | Sunshine | WindGustDir | WindGustSpeed | WindDir9am | WindDir3pm | WindSpeed9am | WindSpeed3pm | Humidity9am | Humidity3pm | Pressure9am | Pressure3pm | Cloud9am | Cloud3pm | Temp9am | Temp3pm | RainToday | RISK_MM | RainTomorrow |\n' +
        '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n' +
        '| 8 | 24.3 | 0 | 3.4 | 6.3 | NW | 30 | SW | NW | 6 | 20 | 68 | 29 | 1019.7 | 1015 | 7 | 7 | 14.4 | 23.6 | No | 3.6 | Yes |\n' +
        '| 14 | 26.9 | 3.6 | 4.4 | 9.7 | ENE | 39 | E | W | 4 | 17 | 80 | 36 | 1012.4 | 1008.4 | 5 | 3 | 17.5 | 25.7 | Yes | 3.6 | Yes |\n' +
        '| 13.7 | 23.4 | 3.6 | 5.8 | 3.3 | NW | 85 | N | NNE | 6 | 6 | 82 | 69 | 1009.5 | 1007.2 | 8 | 7 | 15.4 | 20.2 | Yes | 39.8 | Yes |\n' +
        '| 13.3 | 15.5 | 39.8 | 7.2 | 9.1 | NW | 54 | WNW | W | 30 | 24 | 62 | 56 | 1005.5 | 1007 | 2 | 7 | 13.5 | 14.1 | Yes | 2.8 | Yes |\n' +
        '| 7.6 | 16.1 | 2.8 | 5.6 | 10.6 | SSE | 50 | SSE | ESE | 20 | 28 | 68 | 49 | 1018.3 | 1018.5 | 7 | 7 | 11.1 | 15.4 | Yes | 0 | No |\n' +
        '| 6.2 | 16.9 | 0 | 5.8 | 8.2 | SE | 44 | SE | E | 20 | 24 | 70 | 57 | 1023.8 | 1021.7 | 7 | 5 | 10.9 | 14.8 | No | 0.2 | No |\n' +
        '| 6.1 | 18.2 | 0.2 | 4.2 | 8.4 | SE | 43 | SE | ESE | 19 | 26 | 63 | 47 | 1024.6 | 1022.2 | 4 | 6 | 12.4 | 17.3 | No | 0 | No |\n' +
        '| 8.3 | 17 | 0 | 5.6 | 4.6 | E | 41 | SE | E | 11 | 24 | 65 | 57 | 1026.2 | 1024.2 | 6 | 7 | 12.1 | 15.5 | No | 0 | No |\n' +
        '| 8.8 | 19.5 | 0 | 4 | 4.1 | S | 48 | E | ENE | 19 | 17 | 70 | 48 | 1026.1 | 1022.7 | 7 | 7 | 14.1 | 18.9 | No | 16.2 | Yes |\n' +
        '| 8.4 | 22.8 | 16.2 | 5.4 | 7.7 | E | 31 | S | ESE | 7 | 6 | 82 | 32 | 1024.1 | 1020.7 | 7 | 1 | 13.3 | 21.7 | Yes | 0 | No |\n' +
        '| 9.1 | 25.2 | 0 | 4.2 | 11.9 | N | 30 | SE | NW | 6 | 9 | 74 | 34 | 1024.4 | 1021.1 | 1 | 2 | 14.6 | 24 | No | 0.2 | No |\n' +
        '| 8.5 | 27.3 | 0.2 | 7.2 | 12.5 | E | 41 | E | NW | 2 | 15 | 54 | 35 | 1023.8 | 1019.9 | 0 | 3 | 16.8 | 26 | No | 0 | No |\n' +
        '| 10.1 | 27.9 | 0 | 7.2 | 13 | WNW | 30 | S | NW | 6 | 7 | 62 | 29 | 1022 | 1017.1 | 0 | 1 | 17 | 27.1 | No | 0 | No |\n' +
        '| 12.1 | 30.9 | 0 | 6.2 | 12.4 | NW | 44 | WNW | W | 7 | 20 | 67 | 20 | 1017.3 | 1013.1 | 1 | 4 | 19.7 | 30.7 | No | 0 | No |\n' +
        '| 10.1 | 31.2 | 0 | 8.8 | 13.1 | NW | 41 | S | W | 6 | 20 | 45 | 16 | 1018.2 | 1013.7 | 0 | 1 | 18.7 | 30.4 | No | 0 | No |\n' +
        '| 12.4 | 32.1 | 0 | 8.4 | 11.1 | E | 46 | SE | WSW | 7 | 9 | 70 | 22 | 1017.9 | 1012.8 | 0 | 3 | 19.1 | 30.7 | No | 0 | No |\n' +
        '| 13.8 | 31.2 | 0 | 7.2 | 8.4 | ESE | 44 | WSW | W | 6 | 19 | 72 | 23 | 1014.4 | 1009.8 | 7 | 6 | 20.2 | 29.8 | No | 1.2 | Yes |\n' +
        '| 11.7 | 30 | 1.2 | 7.2 | 10.1 | S | 52 | SW | NE | 6 | 11 | 59 | 26 | 1016.4 | 1013 | 1 | 5 | 20.1 | 28.6 | Yes | 0.6 | No |\n';

      const table = tsvToTable(tsv);
      const line_1_20 = table.split('\n').splice(0, 20).join('\n') + '\n';

      // console.error(line_1_20);

      expect(line_1_20).toBe(expected);
    });

    it('should throw an error for a TSV file with only headers and no data', () => {
      const tsv = 'Header1\tHeader2\tHeader3';
      expect(() => tsvToTable(tsv)).toThrow('Invalid table structure');
    });

    it('should throw an error for a TSV file with extra trailing tabs', () => {
      const tsv = 'A\tB\tC\n1\t2\t3\t\n4\t5\t6';
      expect(() => tsvToTable(tsv)).toThrow('Invalid table structure');
    });

    it('should convert a TSV file with empty cells', () => {
      const tsv = 'A\tB\n1\t\n\t2';
      const expected =
        '| A | B |\n' + '| --- | --- |\n' + '| 1 |  |\n' + '|  | 2 |\n';
      expect(tsvToTable(tsv)).toBe(expected);
    });

    it('should convert a TSV file with special characters', () => {
      const tsv = 'Name\tNote\nAlice\tHello, world!\nBob\t"Quoted"';
      const expected =
        '| Name | Note |\n' +
        '| --- | --- |\n' +
        '| Alice | Hello, world! |\n' +
        '| Bob | "Quoted" |\n';
      expect(tsvToTable(tsv)).toBe(expected);
    });

    it('should convert a TSV file with numeric and boolean values', () => {
      const tsv = 'ID\tActive\n1\ttrue\n2\tfalse';
      const expected =
        '| ID | Active |\n' +
        '| --- | --- |\n' +
        '| 1 | true |\n' +
        '| 2 | false |\n';
      expect(tsvToTable(tsv)).toBe(expected);
    });

    it('should convert TSV to markdown table with custom delimiter alignments', () => {
      const tsv = [
        'First Name\tLast Name\tAge\tTitle\tArea',
        'Alice\tSmith\t30\tEngineer\tNorth',
        'Bob\tJohnson\t25\tDesigner\tSouth',
        'Charlie\tBrown\t35\tManager\tEast',
        'David\tWilliams\t28\tDeveloper\tWest',
        'Eve\tJones\t22\tIntern\tCentral',
      ].join('\n');

      // Set custom alignments: left, center, right
      const delimiter: DelimiterRow = [
        { alignment: 'left' },
        { alignment: 'center' },
        { alignment: 'right' },
        {},
        { alignment: undefined },
      ];

      const expected =
        '| First Name | Last Name | Age | Title | Area |\n' +
        '| :--- | :---: | ---: | --- | --- |\n' +
        '| Alice | Smith | 30 | Engineer | North |\n' +
        '| Bob | Johnson | 25 | Designer | South |\n' +
        '| Charlie | Brown | 35 | Manager | East |\n' +
        '| David | Williams | 28 | Developer | West |\n' +
        '| Eve | Jones | 22 | Intern | Central |\n';

      expect(tsvToTable(tsv, delimiter)).toBe(expected);
    });
  });

  describe('Use case', () => {
    it('should output a table with custom delimiter alignments', () => {
      const tsv = [
        'First Name\tLast Name\tAge\tTitle\tArea',
        'Alice\tSmith\t30\tEngineer\tNorth',
        'Bob\tJohnson\t25\tDesigner\tSouth',
        'Charlie\tBrown\t35\tManager\tEast',
        'David\tWilliams\t28\tDeveloper\tWest',
        'Eve\tJones\t22\tIntern\tCentral',
      ].join('\n');
      const table = parseTsv(tsv);

      const delimiter: DelimiterRow = [
        { alignment: 'left' },
        { alignment: 'center' },
        { alignment: 'right' },
        {},
        { alignment: undefined },
      ];

      // console.dir(delimiter, { depth: null });
      // Update delimiter
      const out = toTable({
        ...table,
        delimiter: delimiter,
      });

      // console.debug(out);

      expect(out).toBe(
        '| First Name | Last Name | Age | Title | Area |\n' +
          '| :--- | :---: | ---: | --- | --- |\n' +
          '| Alice | Smith | 30 | Engineer | North |\n' +
          '| Bob | Johnson | 25 | Designer | South |\n' +
          '| Charlie | Brown | 35 | Manager | East |\n' +
          '| David | Williams | 28 | Developer | West |\n' +
          '| Eve | Jones | 22 | Intern | Central |\n',
      );
    });
  });
});
