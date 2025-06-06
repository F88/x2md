<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [x2md](./x2md.md) &gt; [parseTsv](./x2md.parsetsv.md)

## parseTsv() function

> This API is provided as a beta preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.
> 

Parses a TSV (Tab-Separated Values) string into a MarkdownTable structure.

**Signature:**

```typescript
export declare function parseTsv(tsv: string): MarkdownTable;
```

## Parameters

<table><thead><tr><th>

Parameter


</th><th>

Type


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

tsv


</td><td>

string


</td><td>

The TSV string to parse.


</td></tr>
</tbody></table>
**Returns:**

[MarkdownTable](./x2md.markdowntable.md)

A MarkdownTable object containing the header, delimiter, and data rows.

## Remarks

This function splits the input TSV string into lines, processes the header, delimiter, and data rows, and returns a structured MarkdownTable object. It does not trim the input string, allowing for leading or trailing whitespace in the TSV data. Empty lines are filtered out, and the header is expected to be the first line of the TSV. The delimiter row is created with empty objects for each header cell. The data rows are parsed from the remaining lines.

## Example


```typescript
const tsv = 'Name\tAge\nAlice\t30\nBob\t25';
const table = parseTsv(tsv);
console.log(table.header); // ['Name', 'Age']
console.log(table.data); // [['Alice', '30'], ['Bob', '25']]
console.log(table.delimiter); // [{}, {}]
```

