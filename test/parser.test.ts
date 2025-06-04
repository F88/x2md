import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';
import { parseTsv } from '../src/parser.js';
import { DataRow, HeaderRow } from '../src/table.js';

const Specials = {
  tsv: {
    header: '|PIPE|CHANNEL|\t\\?\\\t Space alian \n',
    data: '|PIPE|X|\t\\TR\\UE\\\t Space Cat \n',
  },
  object: {
    header: ['|PIPE|CHANNEL|', '\\?\\', ' Space alian '] as HeaderRow,
    data: [['|PIPE|X|', '\\TR\\UE\\', ' Space Cat ']] as DataRow[],
  },
} as const;

describe('parser.ts', () => {
  describe('parseTsv', () => {
    it('should parse TSV into Table structure', () => {
      const tsv = 'Name\tAge\nAlice\t30\nBob\t25';
      const table = parseTsv(tsv);
      expect(table.header).toEqual(['Name', 'Age']);
      expect(table.data).toEqual([
        ['Alice', '30'],
        ['Bob', '25'],
      ]);
      expect(table.delimiter).toStrictEqual([{}, {}]);
    });

    it('should parse TSV contains special characters into Table structure', () => {
      const tsv = Specials.tsv.header + Specials.tsv.data;
      const table = parseTsv(tsv);
      expect(table.header).toEqual(Specials.object.header);
      expect(table.data).toEqual(Specials.object.data);
      expect(table.delimiter).toStrictEqual([{}, {}, {}]);
    });

    it('should handle single row TSV', () => {
      const tsv = 'Only\nValue';
      const table = parseTsv(tsv);
      expect(table.header).toEqual(['Only']);
      expect(table.data).toEqual([['Value']]);
      expect(table.delimiter).toStrictEqual([{}]);
    });

    it('should handle empty TSV', () => {
      const tsv = '';
      const table = parseTsv(tsv);
      expect(table.header).toEqual([]);
      expect(table.data).toEqual([]);
      expect(table.delimiter).toEqual([]);
    });

    it('should parse large TSV', () => {
      const path2File = join(__dirname, 'fixtures', 'weather.tsv');
      const data = readFileSync(path2File, 'utf-8');

      const start = Date.now();
      const actual = parseTsv(data);
      const end = Date.now();
      console.info(
        `Execution time in loading 366 lines TSV: ${String(end - start)} ms`,
      );

      expect(end - start).toBeLessThan(3_000); // Ensure it runs within 3 seconds

      expect(actual.header.length).toBe(22);
      expect(actual.header).toStrictEqual([
        'MinTemp',
        'MaxTemp',
        'Rainfall',
        'Evaporation',
        'Sunshine',
        'WindGustDir',
        'WindGustSpeed',
        'WindDir9am',
        'WindDir3pm',
        'WindSpeed9am',
        'WindSpeed3pm',
        'Humidity9am',
        'Humidity3pm',
        'Pressure9am',
        'Pressure3pm',
        'Cloud9am',
        'Cloud3pm',
        'Temp9am',
        'Temp3pm',
        'RainToday',
        'RISK_MM',
        'RainTomorrow',
      ]);

      expect(actual.delimiter.length).toBe(22);
      expect(actual.delimiter).toStrictEqual([
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
      ]);

      expect(actual.data.length).toBe(366);
    });
  });
});
