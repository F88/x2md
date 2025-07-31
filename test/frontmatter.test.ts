import { describe, it, expect } from 'vitest';
import {
  toYamlFrontMatter,
  toTomlFrontMatter,
  toFrontMatter,
} from '../src/frontmatter.js';

describe('Front Matter', () => {
  describe('toYamlFrontMatter', () => {
    it('should generate YAML front matter with simple values', () => {
      const data = {
        title: 'My Post',
        date: '2023-07-31',
        draft: false,
      };
      const expected = `---
title: My Post
date: "2023-07-31"
draft: false
---
`;
      expect(toYamlFrontMatter(data)).toBe(expected);
    });

    it('should generate YAML front matter with arrays', () => {
      const data = {
        title: 'My Post',
        tags: ['markdown', 'front-matter', 'yaml'],
      };
      const expected = `---
title: My Post
tags:
- markdown
- front-matter
- yaml
---
`;
      expect(toYamlFrontMatter(data)).toBe(expected);
    });

    it('should generate YAML front matter with nested objects', () => {
      const data = {
        title: 'My Post',
        author: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      };
      const expected = `---
title: My Post
author:
name: John Doe
email: john@example.com
---
`;
      expect(toYamlFrontMatter(data)).toBe(expected);
    });

    it('should generate YAML front matter with mixed types', () => {
      const data = {
        title: 'My Post',
        count: 42,
        enabled: true,
        tags: ['tag1', 'tag2'],
        metadata: {
          version: 1.5,
          beta: false,
        },
      };
      const expected = `---
title: My Post
count: 42
enabled: true
tags:
- tag1
- tag2
metadata:
version: 1.5
beta: false
---
`;
      expect(toYamlFrontMatter(data)).toBe(expected);
    });

    it('should handle empty object', () => {
      expect(toYamlFrontMatter({})).toBe('---\n---\n');
    });

    it('should handle null and undefined values', () => {
      const data = {
        title: 'My Post',
        description: null,
        summary: undefined,
      };
      const expected = `---
title: My Post
description: null
summary: null
---
`;
      expect(toYamlFrontMatter(data)).toBe(expected);
    });

    it('should escape special characters in strings', () => {
      const data = {
        title: 'Title with "quotes" and special: characters',
        description: 'Line 1\nLine 2\tTabbed',
      };
      const expected = `---
title: "Title with \\"quotes\\" and special: characters"
description: "Line 1\\nLine 2\\tTabbed"
---
`;
      expect(toYamlFrontMatter(data)).toBe(expected);
    });

    it('should handle empty arrays and objects', () => {
      const data = {
        title: 'My Post',
        tags: [],
        metadata: {},
      };
      const expected = `---
title: My Post
tags: []
metadata: {}
---
`;
      expect(toYamlFrontMatter(data)).toBe(expected);
    });

    it('should quote strings that look like numbers or booleans', () => {
      const data = {
        version: '1.0',
        enabled: 'true',
        count: '42',
        name: 'yes',
      };
      const expected = `---
version: "1.0"
enabled: "true"
count: "42"
name: "yes"
---
`;
      expect(toYamlFrontMatter(data)).toBe(expected);
    });
  });

  describe('toTomlFrontMatter', () => {
    it('should generate TOML front matter with simple values', () => {
      const data = {
        title: 'My Post',
        date: '2023-07-31',
        draft: false,
      };
      const expected = `+++
title = "My Post"
date = "2023-07-31"
draft = false
+++
`;
      expect(toTomlFrontMatter(data)).toBe(expected);
    });

    it('should generate TOML front matter with arrays', () => {
      const data = {
        title: 'My Post',
        tags: ['markdown', 'front-matter', 'toml'],
      };
      const expected = `+++
title = "My Post"
tags = ["markdown", "front-matter", "toml"]
+++
`;
      expect(toTomlFrontMatter(data)).toBe(expected);
    });

    it('should generate TOML front matter with nested objects', () => {
      const data = {
        title: 'My Post',
        author: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      };
      const expected = `+++
title = "My Post"
author = { name = "John Doe", email = "john@example.com" }
+++
`;
      expect(toTomlFrontMatter(data)).toBe(expected);
    });

    it('should generate TOML front matter with mixed types', () => {
      const data = {
        title: 'My Post',
        count: 42,
        enabled: true,
        tags: ['tag1', 'tag2'],
        metadata: {
          version: 1.5,
          beta: false,
        },
      };
      const expected = `+++
title = "My Post"
count = 42
enabled = true
tags = ["tag1", "tag2"]
metadata = { version = 1.5, beta = false }
+++
`;
      expect(toTomlFrontMatter(data)).toBe(expected);
    });

    it('should handle empty object', () => {
      expect(toTomlFrontMatter({})).toBe('+++\n+++\n');
    });

    it('should handle null and undefined values', () => {
      const data = {
        title: 'My Post',
        description: null,
        summary: undefined,
      };
      const expected = `+++
title = "My Post"
description = ""
summary = ""
+++
`;
      expect(toTomlFrontMatter(data)).toBe(expected);
    });

    it('should escape special characters in strings', () => {
      const data = {
        title: 'Title with "quotes"',
        description: 'Line 1\nLine 2\tTabbed',
      };
      const expected = `+++
title = "Title with \\"quotes\\""
description = "Line 1\\nLine 2\\tTabbed"
+++
`;
      expect(toTomlFrontMatter(data)).toBe(expected);
    });

    it('should handle empty arrays and objects', () => {
      const data = {
        title: 'My Post',
        tags: [],
        metadata: {},
      };
      const expected = `+++
title = "My Post"
tags = []
metadata = {}
+++
`;
      expect(toTomlFrontMatter(data)).toBe(expected);
    });
  });

  describe('toFrontMatter', () => {
    it('should default to YAML format', () => {
      const data = { title: 'My Post' };
      const yamlResult = toYamlFrontMatter(data);
      const genericResult = toFrontMatter(data);
      expect(genericResult).toBe(yamlResult);
    });

    it('should generate YAML when format is specified as yaml', () => {
      const data = { title: 'My Post' };
      const yamlResult = toYamlFrontMatter(data);
      const genericResult = toFrontMatter(data, 'yaml');
      expect(genericResult).toBe(yamlResult);
    });

    it('should generate TOML when format is specified as toml', () => {
      const data = { title: 'My Post' };
      const tomlResult = toTomlFrontMatter(data);
      const genericResult = toFrontMatter(data, 'toml');
      expect(genericResult).toBe(tomlResult);
    });

    it('should handle complex data in both formats', () => {
      const data = {
        title: 'Complex Post',
        tags: ['tag1', 'tag2'],
        metadata: { version: 1, draft: false },
      };

      const yamlResult = toFrontMatter(data, 'yaml');
      const tomlResult = toFrontMatter(data, 'toml');

      expect(yamlResult).toContain('---');
      expect(yamlResult).toContain('title: Complex Post');
      expect(yamlResult).toContain('- tag1');

      expect(tomlResult).toContain('+++');
      expect(tomlResult).toContain('title = "Complex Post"');
      expect(tomlResult).toContain('["tag1", "tag2"]');
    });
  });
});
