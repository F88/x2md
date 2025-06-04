/**
 * Markdown Table Utilities
 *
 * Provides functions to create and validate Markdown tables.
 */

/**
 * HeaderCell represents a single cell in the header row of a Markdown table.
 *
 * @public
 */
export type HeaderCell = string;

/**
 * HeaderRow represents a row of header cells in a Markdown table.
 *
 * @public
 */
export type HeaderRow = HeaderCell[];

/**
 * DelimiterCell represents a single cell in the delimiter row of a Markdown table.
 *
 * @public
 */
export interface DelimiterCell {
  /**
   * The alignment of the cell content.
   */
  alignment?: 'left' | 'center' | 'right';
}

/**
 * DelimiterRow represents a row of delimiter cells in a Markdown table.
 *
 * @public
 */
export type DelimiterRow = DelimiterCell[];

/**
 * DataCell represents a single cell in the data rows of a Markdown table.
 *
 * @public
 */
export type DataCell = string;

/**
 * DataRow represents a row of data cells in a Markdown table.
 *
 * @public
 */
export type DataRow = DataCell[];

/**
 * MarkdownTable represents a complete Markdown table structure.
 *
 * @public
 */
export interface MarkdownTable {
  /**
   * The header row of the table.
   */
  header: HeaderRow;

  /**
   * The delimiter row of the table, defining cell alignments.
   */
  delimiter: DelimiterRow;

  /**
   * The data rows of the table, containing the actual content.
   */
  data: DataRow[];
}

/**
 * Escape special characters in a string for use in Markdown tables.
 *
 * @param str - String to escape special characters for Markdown tables.
 * @returns Escaped string suitable for Markdown tables.
 *
 * @remarks
 * This function escapes the characters listed below.
 *
 * - Pipe (`|`)
 * - Backslash (`\`)
 *
 */
export function escapeSpecialChars(s: string): string {
  return s
    .replace(/\\/g, '\\\\') // Escape backslash
    .replace(/\|/g, '\\|'); // Escape pipe
  // .replace(/^\s+|\s+$/g, (s) => s.replace(/ /g, '\\ ')); // Not effective for Markdown tables
}

/**
 * Convert a string for display in a Markdown table.
 *
 * @param str - String to convert for Markdown table display.
 * @returns Converted string suitable for Markdown tables.
 *
 * @remarks
 * This function replaces string or character listed below.
 *
 * - Newline (`\n`) is replaced with `<br />`
 */
export function replaceForTable(s: string): string {
  return s.replace(/\n/g, '<br />'); // Convert newlines to <br /> for Markdown tables
}

/**
 * Convert a string for display in a Markdown table.
 *
 * @param str - String to convert for Markdown table display.
 * @returns Converted string suitable for Markdown tables.
 */
export function convertForMarkdown(s: string): string {
  return escapeSpecialChars(replaceForTable(s));
}

export function toTableHeader(header: HeaderRow): string {
  if (header.length === 0) {
    return '';
  }
  const headerRow = header
    .map((value) => convertForMarkdown(value))
    .join(' | ');
  const ret = `| ${headerRow} |\n`;
  return ret;
}

export function toTableDelimiter(delimiter: DelimiterRow): string {
  if (delimiter.length === 0) {
    return '';
  }
  const delimiterRow = delimiter
    .map((cell) => {
      switch (cell.alignment) {
        case 'left':
          return ':---';
        case 'center':
          return ':---:';
        case 'right':
          return '---:';
        default:
          return '---'; // Default to left alignment if not specified
      }
    })
    .join(' | ');

  const ret = `| ${delimiterRow} |\n`;
  return ret;
}

export function toTableDataRow(row: DataRow): string {
  if (row.length === 0) {
    return '';
  }
  const dataRowString = row.map((cell) => convertForMarkdown(cell)).join(' | ');
  const ret = `| ${dataRowString} |\n`;
  return ret;
}

export function toTableDataRows(rows: DataRow[]): string {
  if (rows.length === 0) {
    return '';
  }
  const data: string[] = [];
  for (const row of rows) {
    if (row.length === 0) {
      return '';
    }
    data.push(toTableDataRow(row));
  }
  const ret = data.join('');
  return ret;
}

export function validateTable(table: MarkdownTable): {
  isValid: boolean;
  message?: string;
} {
  if (table.header.length === 0) {
    return {
      isValid: false,
      message: 'Table header is empty',
    };
  }

  if (table.header.length !== table.delimiter.length) {
    return {
      isValid: false,
      message: 'Table header and delimiter lengths do not match',
    };
  }

  if (table.data.length === 0) {
    return {
      isValid: false,
      message: 'Table data is empty',
    };
  }

  const lineNo = [];
  for (let index = 0; index < table.data.length; index++) {
    const row = table.data[index];
    if (row.length !== table.header.length) {
      lineNo.push(index + +1);
    }
  }
  if (lineNo.length > 0) {
    const message = `Data row length does not match header length at line(s): ${lineNo.join(', ')}`;
    return {
      isValid: false,
      message: message,
    };
  }

  return { isValid: true };
}

/**
 * Convert a MarkdownTable to a string representation.
 *
 * @param table - The MarkdownTable to convert.
 * @param customDelimiter - Optional custom delimiter row.
 * @returns String representation of the MarkdownTable.
 * @throws Error if the table structure is invalid.
 *
 * @remarks
 * This function takes a `MarkdownTable` object and converts it into a string formatted as a Markdown table.
 * It validates the table structure before conversion, ensuring that the header, delimiter, and data rows are correctly formatted.
 * If the table structure is invalid, it throws an error with a message indicating the issue.
 *
 * The `customDelimiter` parameter allows you to specify a custom delimiter row for the table.
 * If provided, it overrides the default delimiter row in the table.
 *
 * @example
 * ```typescript
 * import { toTable } from '@msn088/x2md';
 * const table = {
 *   header: ['Name', 'Age'],
 *  delimiter: [
 *    { alignment: 'left' },
 *    { alignment: 'right' },
 *  ],
 *  data: [
 *    ['Alice', '30'],
 *    ['Bob', '25'],
 *  ],
 * };
 * const markdownTable = toTable(table);
 * console.log(markdownTable);
 * // Output:
 * * | Name  | Age |
 * * | :---  | ---: |
 * * | Alice | 30  |
 * * | Bob   | 25  |
 * ```
 *
 * @public
 */
export function toTable(
  table: MarkdownTable,
  customDelimiter?: DelimiterRow,
): string {
  const source = table;
  if (customDelimiter != null) {
    source.delimiter = customDelimiter;
  }

  const isValid = validateTable(source);
  if (!isValid.isValid) {
    throw new Error(
      'Invalid table structure' +
        (isValid.message != null ? `: ${isValid.message}` : ''),
    );
  }

  const header = toTableHeader(source.header);
  const delimiter = toTableDelimiter(source.delimiter);
  const data = toTableDataRows(source.data);

  const ret = header + delimiter + data;
  return ret;
}
