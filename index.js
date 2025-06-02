/**
 * Convert TSV (Tab-Separated Values) to Markdown table format
 * @param {string} tsvInput - The TSV input string
 * @returns {string} Markdown table string
 */
function tsvToMarkdown(tsvInput) {
  if (!tsvInput || typeof tsvInput !== 'string') {
    throw new Error('Input must be a non-empty string');
  }

  const lines = tsvInput.trim().split('\n');
  if (lines.length === 0) {
    throw new Error('Input must contain at least one line');
  }

  const rows = lines.map(line => line.split('\t'));
  
  // Check if all rows have the same number of columns
  const columnCount = rows[0].length;
  if (rows.some(row => row.length !== columnCount)) {
    throw new Error('All rows must have the same number of columns');
  }

  // Escape pipe characters in cell content
  const escapedRows = rows.map(row => 
    row.map(cell => cell.replace(/\|/g, '\\|'))
  );

  // Create the markdown table
  let markdown = '';
  
  // Header row
  markdown += '| ' + escapedRows[0].join(' | ') + ' |\n';
  
  // Separator row
  markdown += '|' + '--- |'.repeat(columnCount) + '\n';
  
  // Data rows
  for (let i = 1; i < escapedRows.length; i++) {
    markdown += '| ' + escapedRows[i].join(' | ') + ' |\n';
  }

  return markdown.trim();
}

module.exports = { tsvToMarkdown };