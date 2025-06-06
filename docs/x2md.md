<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [x2md](./x2md.md)

## x2md package

Collection of tiny utilities that convert input values into strings suitable for Markdown formatting.

## Functions

<table><thead><tr><th>

Function


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[parseTsv(tsv)](./x2md.parsetsv.md)


</td><td>

**_(BETA)_** Parses a TSV (Tab-Separated Values) string into a MarkdownTable structure.


</td></tr>
<tr><td>

[toHeader(value, level)](./x2md.toheader.md)


</td><td>

Converts a string to a Markdown header.

The output format is [ATX headings](https://spec.commonmark.org/0.31.2/#atx-headings)<!-- -->.


</td></tr>
<tr><td>

[toList(items, indentLevel)](./x2md.tolist.md)


</td><td>

Converts an array of strings into a Markdown list.


</td></tr>
<tr><td>

[toListItem(value, indentLevel)](./x2md.tolistitem.md)


</td><td>

Converts a string to a list item with a specified indentation level.


</td></tr>
<tr><td>

[toTable(table, customDelimiter)](./x2md.totable.md)


</td><td>

Convert a MarkdownTable to a string representation.


</td></tr>
</tbody></table>

## Interfaces

<table><thead><tr><th>

Interface


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[DelimiterCell](./x2md.delimitercell.md)


</td><td>

DelimiterCell represents a single cell in the delimiter row of a Markdown table.


</td></tr>
<tr><td>

[MarkdownTable](./x2md.markdowntable.md)


</td><td>

MarkdownTable represents a complete Markdown table structure.


</td></tr>
</tbody></table>

## Type Aliases

<table><thead><tr><th>

Type Alias


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[DataCell](./x2md.datacell.md)


</td><td>

DataCell represents a single cell in the data rows of a Markdown table.


</td></tr>
<tr><td>

[DataRow](./x2md.datarow.md)


</td><td>

DataRow represents a row of data cells in a Markdown table.


</td></tr>
<tr><td>

[DelimiterRow](./x2md.delimiterrow.md)


</td><td>

DelimiterRow represents a row of delimiter cells in a Markdown table.


</td></tr>
<tr><td>

[HeaderCell](./x2md.headercell.md)


</td><td>

HeaderCell represents a single cell in the header row of a Markdown table.


</td></tr>
<tr><td>

[HeaderRow](./x2md.headerrow.md)


</td><td>

HeaderRow represents a row of header cells in a Markdown table.


</td></tr>
</tbody></table>
