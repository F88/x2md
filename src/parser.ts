import {
  DataRow,
  DelimiterCell,
  DelimiterRow,
  HeaderRow,
  MarkdownTable,
} from './table.js';

/**
 * Parses a TSV (Tab-Separated Values) string into a MarkdownTable structure.
 *
 * @param tsv - The TSV string to parse.
 * @returns A MarkdownTable object containing the header, delimiter, and data rows.
 *
 * @remarks
 * This function splits the input TSV string into lines, processes the header,
 * delimiter, and data rows, and returns a structured MarkdownTable object.
 * It does not trim the input string, allowing for leading or trailing whitespace
 * in the TSV data.
 * Empty lines are filtered out, and the header is expected to be the first line
 * of the TSV. The delimiter row is created with empty objects for each header cell.
 * The data rows are parsed from the remaining lines.
 *
 * @example
 * ```typescript
 * const tsv = 'Name\tAge\nAlice\t30\nBob\t25';
 * const table = parseTsv(tsv);
 * console.log(table.header); // ['Name', 'Age']
 * console.log(table.data); // [['Alice', '30'], ['Bob', '25']]
 * console.log(table.delimiter); // [{}, {}]
 * ```
 *
 * @beta
 */
export function parseTsv(tsv: string): MarkdownTable {
  const lines = tsv
    // .trim() /* DO NOT TRIM */
    .split(/\r?\n|\r/);

  const source = lines
    // .map((line) => {
    //   // nop
    //   return line;
    // })
    .filter((e) => e !== ''); // Filter out empty lines

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
