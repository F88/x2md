import {
  DataRow,
  DelimiterCell,
  DelimiterRow,
  HeaderRow,
  MarkdownTable,
} from './table.js';

export function parseTsv(tsv: string): MarkdownTable {
  const lines = tsv
    // .trim() /* DO NOT TRIM */
    .split(/\r?\n|\r/)
    .map((line) => {
      return line;
    });

  const source = lines.filter((e) => e !== ''); // Filter out empty lines

  const header = source.length > 0 ? (source[0].split('\t') as HeaderRow) : [];

  const delimiter: DelimiterRow = [
    ...header.map(() => {
      const cell: DelimiterCell = {};
      return cell;
    }),
  ];

  const data =
    source.length > 1
      ? source.slice(1).map((line) => line.split('\t') as DataRow)
      : [];

  const ret: MarkdownTable = {
    header,
    delimiter,
    data,
  };
  return ret;
}
