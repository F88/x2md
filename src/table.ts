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

export function escapeSpecialCharsForTable(str: string): string {
  // Escape pipe, backslash, and leading/trailing spaces for Markdown tables
  return str
    .replace(/\\/g, '\\\\') // Escape backslash
    .replace(/\|/g, '\\|') // Escape pipe
    .replace(/^\s+|\s+$/g, (s) => s.replace(/ /g, '\\ ')); // Escape leading/trailing spaces
}

export function toTableHeader(header: HeaderRow): string {
  if (header.length === 0) {
    return '';
  }
  const headerRow = header
    .map((value) => escapeSpecialCharsForTable(value))
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
  const dataRowString = row
    .map((cell) => escapeSpecialCharsForTable(cell))
    .join(' | ');
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
