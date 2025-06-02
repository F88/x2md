const { tsvToMarkdown } = require('./index.js');

// Simple test runner
function runTests() {
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`✓ ${name}`);
      passed++;
    } catch (error) {
      console.log(`✗ ${name}: ${error.message}`);
      failed++;
    }
  }

  function assertEqual(actual, expected, message = '') {
    if (actual !== expected) {
      throw new Error(`Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)} ${message}`);
    }
  }

  function assertThrows(fn, expectedMessage = '') {
    try {
      fn();
      throw new Error('Expected function to throw an error');
    } catch (error) {
      if (expectedMessage && !error.message.includes(expectedMessage)) {
        throw new Error(`Expected error message to contain "${expectedMessage}", got "${error.message}"`);
      }
    }
  }

  // Test basic TSV to Markdown conversion
  test('Basic TSV conversion', () => {
    const tsv = 'Name\tAge\tCity\nJohn\t30\tNew York\nJane\t25\tLondon';
    const expected = '| Name | Age | City |\n|--- |--- |--- |\n| John | 30 | New York |\n| Jane | 25 | London |';
    assertEqual(tsvToMarkdown(tsv), expected);
  });

  // Test single row
  test('Single row (header only)', () => {
    const tsv = 'Header1\tHeader2\tHeader3';
    const expected = '| Header1 | Header2 | Header3 |\n|--- |--- |--- |';
    assertEqual(tsvToMarkdown(tsv), expected);
  });

  // Test empty cells
  test('TSV with empty cells', () => {
    const tsv = 'Name\tAge\tCity\nJohn\t\tNew York\n\t25\tLondon';
    const expected = '| Name | Age | City |\n|--- |--- |--- |\n| John |  | New York |\n|  | 25 | London |';
    assertEqual(tsvToMarkdown(tsv), expected);
  });

  // Test pipe character escaping
  test('Pipe character escaping', () => {
    const tsv = 'Name\tDescription\nJohn\tLikes | symbol\nJane\tHates | pipes';
    const expected = '| Name | Description |\n|--- |--- |\n| John | Likes \\| symbol |\n| Jane | Hates \\| pipes |';
    assertEqual(tsvToMarkdown(tsv), expected);
  });

  // Test error cases
  test('Empty input throws error', () => {
    assertThrows(() => tsvToMarkdown(''), 'non-empty string');
  });

  test('Null input throws error', () => {
    assertThrows(() => tsvToMarkdown(null), 'non-empty string');
  });

  test('Non-string input throws error', () => {
    assertThrows(() => tsvToMarkdown(123), 'non-empty string');
  });

  test('Inconsistent column count throws error', () => {
    const tsv = 'Name\tAge\nJohn\t30\tExtra';
    assertThrows(() => tsvToMarkdown(tsv), 'same number of columns');
  });

  // Print results
  console.log(`\nTests completed: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();