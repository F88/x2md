/**
 * Front Matter Utilities
 *
 * Provides functions to create YAML and TOML front matter for Markdown files.
 */

/**
 * Converts a string to a properly escaped YAML value.
 *
 * @param value - The string value to escape.
 * @returns The properly escaped YAML string.
 *
 * @internal
 */
function escapeYamlString(value: string): string {
  // Check if the string needs quoting
  const needsQuoting =
    value.includes(':') ||
    value.includes('#') ||
    value.includes('"') ||
    value.includes("'") ||
    value.includes('\n') ||
    value.includes('\r') ||
    value.includes('\t') ||
    value.trim() !== value ||
    value === '' ||
    /^[\d.+-]/.test(value) ||
    /^(true|false|null|yes|no|on|off)$/i.test(value);

  if (needsQuoting) {
    // Use double quotes and escape internal double quotes, backslashes, and special chars
    return `"${value
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')}"`;
  }
  return value;
}

/**
 * Converts a string to a properly escaped TOML value.
 *
 * @param value - The string value to escape.
 * @returns The properly escaped TOML string.
 *
 * @internal
 */
function escapeTomlString(value: string): string {
  // TOML strings are always quoted
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')}"`;
}

/**
 * Converts a value to a YAML representation.
 *
 * @param value - The value to convert.
 * @param indent - The current indentation level.
 * @returns The YAML representation of the value.
 *
 * @internal
 */
function valueToYaml(value: unknown, indent: number = 0): string {
  const indentStr = '  '.repeat(indent);

  if (value === null || value === undefined) {
    return 'null';
  }

  if (typeof value === 'boolean') {
    return value.toString();
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  if (typeof value === 'string') {
    return escapeYamlString(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]';
    }
    return (
      '\n' +
      value
        .map((item) => `${indentStr}- ${valueToYaml(item, indent + 1)}`)
        .join('\n')
    );
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return '{}';
    }
    return (
      '\n' +
      entries
        .map(([key, val]) => {
          const yamlValue = valueToYaml(val, indent + 1);
          if (yamlValue.startsWith('\n')) {
            return `${indentStr}${key}:${yamlValue}`;
          }
          return `${indentStr}${key}: ${yamlValue}`;
        })
        .join('\n')
    );
  }

  // For any other type, handle it as a string representation
  if (typeof value === 'function') {
    return 'function';
  }
  if (typeof value === 'symbol') {
    return value.toString();
  }
  if (typeof value === 'bigint') {
    return value.toString();
  }

  // This should never happen, but handle it safely
  return 'unknown';
}

/**
 * Converts a value to a TOML representation.
 *
 * @param value - The value to convert.
 * @returns The TOML representation of the value.
 *
 * @internal
 */
function valueToToml(value: unknown): string {
  if (value === null || value === undefined) {
    return '""'; // TOML doesn't have null, use empty string
  }

  if (typeof value === 'boolean') {
    return value.toString();
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  if (typeof value === 'string') {
    return escapeTomlString(value);
  }

  if (Array.isArray(value)) {
    const items = value.map((item) => valueToToml(item)).join(', ');
    return `[${items}]`;
  }

  if (typeof value === 'object') {
    // For objects in TOML, we'll serialize as inline table
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return '{}';
    }
    const items = entries
      .map(([key, val]) => `${key} = ${valueToToml(val)}`)
      .join(', ');
    return `{ ${items} }`;
  }

  // For any other type, handle it as a string representation
  if (typeof value === 'function') {
    return escapeTomlString('function');
  }
  if (typeof value === 'symbol') {
    return escapeTomlString(value.toString());
  }
  if (typeof value === 'bigint') {
    return escapeTomlString(value.toString());
  }

  // This should never happen, but handle it safely
  return escapeTomlString('unknown');
}

/**
 * Converts an object to YAML front matter.
 *
 * @param data - The object to convert to YAML front matter.
 * @returns A string formatted as YAML front matter.
 *
 * @remarks
 * This function generates YAML front matter by converting the provided object
 * into YAML format and wrapping it with triple dashes (---).
 * The output includes a trailing newline for proper formatting.
 *
 * @example
 * ```typescript
 * import { toYamlFrontMatter } from 'x2md';
 * const frontMatter = toYamlFrontMatter({
 *   title: 'My Post',
 *   date: '2023-07-31',
 *   tags: ['markdown', 'front-matter']
 * });
 * // Output:
 * // ---
 * // title: "My Post"
 * // date: "2023-07-31"
 * // tags:
 * //   - "markdown"
 * //   - "front-matter"
 * // ---
 * ```
 *
 * @public
 */
export function toYamlFrontMatter(data: Record<string, unknown>): string {
  const entries = Object.entries(data);
  if (entries.length === 0) {
    return '---\n---\n';
  }

  const yamlContent = entries
    .map(([key, value]) => {
      const yamlValue = valueToYaml(value);
      if (yamlValue.startsWith('\n')) {
        return `${key}:${yamlValue}`;
      }
      return `${key}: ${yamlValue}`;
    })
    .join('\n');

  return `---\n${yamlContent}\n---\n`;
}

/**
 * Converts an object to TOML front matter.
 *
 * @param data - The object to convert to TOML front matter.
 * @returns A string formatted as TOML front matter.
 *
 * @remarks
 * This function generates TOML front matter by converting the provided object
 * into TOML format and wrapping it with triple plus signs (+++).
 * The output includes a trailing newline for proper formatting.
 *
 * @example
 * ```typescript
 * import { toTomlFrontMatter } from 'x2md';
 * const frontMatter = toTomlFrontMatter({
 *   title: 'My Post',
 *   date: '2023-07-31',
 *   tags: ['markdown', 'front-matter']
 * });
 * // Output:
 * // +++
 * // title = "My Post"
 * // date = "2023-07-31"
 * // tags = ["markdown", "front-matter"]
 * // +++
 * ```
 *
 * @public
 */
export function toTomlFrontMatter(data: Record<string, unknown>): string {
  const entries = Object.entries(data);
  if (entries.length === 0) {
    return '+++\n+++\n';
  }

  const tomlContent = entries
    .map(([key, value]) => `${key} = ${valueToToml(value)}`)
    .join('\n');

  return `+++\n${tomlContent}\n+++\n`;
}

/**
 * Converts an object to front matter in the specified format.
 *
 * @param data - The object to convert to front matter.
 * @param format - The format of the front matter ('yaml' or 'toml'). Defaults to 'yaml'.
 * @returns A string formatted as front matter in the specified format.
 *
 * @remarks
 * This function is a generic front matter generator that delegates to either
 * `toYamlFrontMatter` or `toTomlFrontMatter` based on the specified format.
 * YAML format uses triple dashes (---) while TOML format uses triple plus signs (+++).
 *
 * @example
 * ```typescript
 * import { toFrontMatter } from 'x2md';
 * const data = { title: 'My Post', date: '2023-07-31' };
 *
 * const yamlFrontMatter = toFrontMatter(data, 'yaml');
 * // ---
 * // title: "My Post"
 * // date: "2023-07-31"
 * // ---
 *
 * const tomlFrontMatter = toFrontMatter(data, 'toml');
 * // +++
 * // title = "My Post"
 * // date = "2023-07-31"
 * // +++
 * ```
 *
 * @public
 */
export function toFrontMatter(
  data: Record<string, unknown>,
  format: 'yaml' | 'toml' = 'yaml',
): string {
  if (format === 'toml') {
    return toTomlFrontMatter(data);
  }
  return toYamlFrontMatter(data);
}
