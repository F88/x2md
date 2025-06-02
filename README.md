# x2md
Collection of small utilities that convert input values ​​into strings suitable for Markdown formatting.

## Features

- **TSV to Markdown Table**: Convert Tab-Separated Values (TSV) to Markdown table format

## Installation

```bash
npm install x2md
```

## Usage

### TSV to Markdown Table

```javascript
const { tsvToMarkdown } = require('x2md');

const tsvData = `Name\tAge\tCity
John\t30\tNew York
Jane\t25\tLondon`;

const markdownTable = tsvToMarkdown(tsvData);
console.log(markdownTable);
```

Output:
```markdown
| Name | Age | City |
|--- |--- |--- |
| John | 30 | New York |
| Jane | 25 | London |
```

### API

#### `tsvToMarkdown(tsvInput)`

Converts a TSV string to a Markdown table.

**Parameters:**
- `tsvInput` (string): The TSV input string with tab-separated values

**Returns:**
- (string): Markdown table string

**Throws:**
- Error if input is not a string or is empty
- Error if rows have inconsistent number of columns

## Examples

### Basic Usage
```javascript
const tsv = 'Header1\tHeader2\nValue1\tValue2';
const markdown = tsvToMarkdown(tsv);
// | Header1 | Header2 |
// |--- |--- |
// | Value1 | Value2 |
```

### Handling Special Characters
```javascript
const tsv = 'Name\tNote\nJohn\tLikes | pipes';
const markdown = tsvToMarkdown(tsv);
// | Name | Note |
// |--- |--- |
// | John | Likes \| pipes |
```

## License

MIT
