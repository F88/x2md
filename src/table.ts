export type HeaderCell = string;

export type HeaderRow = HeaderCell[];

export type DelimiterCell = {
  alignment?: 'left' | 'center' | 'right';
};

export type DelimiterRow = DelimiterCell[];

export type DataCell = string;

export type DataRow = DataCell[];

export type MarkdownTable = {
  header: HeaderRow;
  delimiter: DelimiterRow;
  data: DataRow[];
};

export function parseTsv(tsv: string): MarkdownTable {
  // console.dir(tsv, { depth: null });
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
  // console.dir(ret, { depth: null });
  return ret;
}

export function escapeSpecialCharsForTable(str: string): string {
  // Escape pipe, backslash, and leading/trailing spaces for Markdown tables
  return str
    .replace(/\\/g, '\\\\') // Escape backslash
    .replace(/\|/g, '\\|') // Escape pipe
    .replace(/^\s+|\s+$/g, (s) => s.replace(/ /g, '\\ ')); // Escape leading/trailing spaces
}

export function toTableHeader(header: HeaderRow): string {
  // console.dir(header, { depth: null });
  if (header.length === 0) {
    return '';
  }
  const headerRow = header
    .map((value) => escapeSpecialCharsForTable(value))
    .join(' | ');
  const ret = `| ${headerRow} |\n`;
  // console.dir(ret, { depth: null });
  return ret;
}

export function toTableDelimiter(delimiter: DelimiterRow): string {
  // console.dir(delimiter, { depth: null });
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
  // console.dir(ret, { depth: null });
  return ret;
}

export function toTableDataRow(row: DataRow): string {
  // console.dir(row, { depth: null });
  if (row.length === 0) {
    return '';
  }
  const dataRowString = row
    .map((cell) => escapeSpecialCharsForTable(cell))
    .join(' | ');
  const ret = `| ${dataRowString} |\n`;
  // console.dir(ret, { depth: null });
  return ret;
}

export function toTableDataRows(rows: DataRow[]): string {
  // console.dir(rows, { depth: null });
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
  // console.dir(ret, { depth: null });
  return ret;
}

export function validateTable(table: MarkdownTable): {
  isValid: boolean;
  message?: string;
} {
  // console.debug(table.header, table.delimiter, table.data);

  if (table.header.length === 0) {
    // console.error('Table header is empty');

    return {
      isValid: false,
      message: 'Table header is empty',
    };
  }

  if (table.header.length !== table.delimiter.length) {
    // console.error(
    // 'Table header and delimiter lengths do not match',
    // table.header.length,
    // table.delimiter.length,
    // );
    return {
      isValid: false,
      message: 'Table header and delimiter lengths do not match',
    };
  }

  if (table.data.length === 0) {
    // console.error('Table data is empty');
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
    // console.error(message);
    return {
      isValid: false,
      message: message,
    };
  }

  return { isValid: true };
}

export function toTable(table: MarkdownTable): string {
  // console.dir(table, { depth: null });
  const isValid = validateTable(table);
  if (!isValid.isValid) {
    throw new Error('Invalid table structure');
  }

  const header = toTableHeader(table.header);
  const delimiter = toTableDelimiter(table.delimiter);
  const data = toTableDataRows(table.data);
  const ret = `${header}${delimiter}${data}`;
  // console.dir(ret, { depth: null });
  return ret;
}

/**
 * Convert TSV to a Markdown table
 *
 * @param tsv The TSV string to convert
 * @param delimiter Optional custom delimiter row
 * @returns The formatted Markdown table
 *
 * @beta
 */
export function tsvToTable(tsv: string, delimiter?: DelimiterRow): string {
  // console.dir(tsv, { depth: null });
  // console.dir(delimiter, { depth: null });
  const table = parseTsv(tsv);
  const source = table;
  if (delimiter != null) {
    source.delimiter = delimiter;
  }
  const ret = toTable(source);
  // console.dir(ret, { depth: null });
  return ret;
}
