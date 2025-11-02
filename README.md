# mkstruct

[![npm version](https://badge.fury.io/js/mkstruct.svg)](https://www.npmjs.com/package/mkstruct)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/mkstruct)](https://nodejs.org)

> Generate folder and file structures from plain text lists or ASCII trees in seconds.

`mkstruct@2.0` ships a faster tree normalizer, smarter file detection, and a slimmer CLI tailored for everyday scaffolding workflows.

---

## Why mkstruct v2

- **Auto-format detection** – Paste a flat list or an ASCII tree; mkstruct figures it out.
- **Tree normalization** – Cleans up mixed characters, tabs, and uneven spacing before parsing.
- **Robust file detection** – Recognises extensionless files such as `Makefile`, `Dockerfile`, and dotfiles.
- **Safety first** – Prevents writes outside the current working directory and supports dry-run previews.
- **CLI ergonomics** – Zero config with `npx`, inline structures via `-s`, piping with `--stdin`, and verbose tracing when you need insight.

Requires Node.js **14.0.0 or newer**.

---

## Installation

| Use case | Command |
| --- | --- |
| Try once with npx | `npx mkstruct structure.txt` |
| Install globally | `npm install -g mkstruct` |
| Add to a project | `npm install --save-dev mkstruct` |

Each option exposes the same `mkstruct` binary.

---

## Quick Start

### Flat list input
Create `structure.txt`:
```txt
src/index.js
src/utils/api.js
src/components/Button.jsx
public/index.html
README.md
```
Generate:
```bash
npx mkstruct structure.txt
```

### ASCII tree input
Create `tree.txt`:
```txt
├── src
│   ├── index.js
│   ├── utils
│   │   └── api.js
│   └── components
│       └── Button.jsx
├── public
│   └── index.html
└── README.md
```
Generate:
```bash
npx mkstruct tree.txt
```

mkstruct automatically detects the format and creates folders before files so hierarchies stay intact.

---

## CLI Reference

```bash
mkstruct [file] [options]
```

| Flag | Description |
| --- | --- |
| `-d, --dry-run` | Preview actions without touching the file system |
| `-f, --force` | Overwrite files that already exist |
| `-s, --structure <text>` | Supply the structure inline (great for snippets) |
| `--stdin` | Read structure from standard input (pipe support) |
| `-v, --verbose` | Show parsing and normalization diagnostics |
| `-h, --help` | Display usage information |

### Common patterns

Preview output:
```bash
mkstruct structure.txt --dry-run
```

Pipe a remote definition:
```bash
curl -s https://example.com/structure.txt | mkstruct --stdin
```

Inline structure on the fly:
```bash
mkstruct -s "api/\n├── routes/\n│   └── users.js\n└── server.js"
```

Regenerate boilerplate forcefully:
```bash
mkstruct structure.txt --force
```

Inspect normalization behaviour:
```bash
mkstruct tree.txt --verbose
```

---

## Input Guidelines

### Flat format rules
1. Use forward slashes (`/`) to separate folders.
2. Provide one path per line; blank lines are ignored.
3. Lines with extensions are treated as files; others become folders unless they match common filenames.

### ASCII tree rules
1. Use the standard characters `├──`, `└──`, and `│` (single- or double-dash variants both work).
2. Indent with four spaces or tabs—mkstruct normalizes mixed indentation.
3. Root nodes without connectors are supported (`project` as the first line, for example).

Example:
```txt
project
├── src
│   ├── index.js
│   └── utils
│       └── helper.js
└── README.md
```

---

## Recipes

### React starter
```txt
src/App.jsx
src/main.jsx
src/components/Navbar.jsx
src/components/Hero.jsx
src/components/Footer.jsx
src/pages/Home.jsx
src/pages/About.jsx
src/hooks/useAuth.js
src/utils/api.js
src/styles/globals.css
public/favicon.ico
```
```bash
npx mkstruct react-structure.txt
```

### Express API tree
```txt
├── server.js
├── config
│   ├── database.js
│   └── environment.js
├── routes
│   ├── api.js
│   ├── auth.js
│   └── users.js
├── controllers
│   ├── authController.js
│   └── userController.js
├── models
│   └── User.js
├── middleware
│   ├── auth.js
│   └── errorHandler.js
└── utils
    ├── logger.js
    └── validators.js
```
```bash
npx mkstruct backend-tree.txt
```

### Documentation bundle
```txt
docs/getting-started.md
docs/api/authentication.md
docs/api/endpoints.md
docs/guides/deployment.md
docs/guides/testing.md
docs/examples/basic.md
docs/examples/advanced.md
```

---

## Guardrails

- Refuses to write outside the current working directory.
- Creates parent folders before files to avoid partial structures.
- Skips existing files unless `--force` is supplied.
- Supports dry-runs for safe previews and verbose logging for debugging.

---

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `Error: No input provided` | No file, `--stdin`, or `-s` argument supplied | Provide a filename, pipe stdin, or use `-s` |
| Files appear in the wrong place | Ran the command from the wrong directory | `pwd`, `cd` into the project root, rerun |
| Tree format not detected | Non-standard characters or broken indentation | Copy the tree glyphs exactly; run with `--verbose` for hints |
| `Refusing to write outside CWD` | Paths contain `..` or absolute segments | Ensure all paths stay relative to the project root |

---

## Contributing

1. Fork the repo and create a feature branch.
2. Install dependencies: `npm install`.
3. Run tests: `npm test`.
4. Open a pull request referencing any related issues.

```bash
git clone https://github.com/Gitnaseem745/mkstruct.git
cd mkstruct
npm install
npm test
```

Bug reports and feature ideas are welcome via [GitHub Issues](https://github.com/Gitnaseem745/mkstruct/issues).

---

## License

MIT © [Naseem Ansari](https://github.com/Gitnaseem745)

See the full text in [LICENSE](LICENSE).

---

## Stay in Touch

- GitHub: [Gitnaseem745/mkstruct](https://github.com/Gitnaseem745/mkstruct)
- npm: [mkstruct](https://www.npmjs.com/package/mkstruct)
- Issue tracker: [Report a bug](https://github.com/Gitnaseem745/mkstruct/issues)

If mkstruct saves you setup time, consider dropping the repo a ⭐️.

---

**Made with ❤️ by developers, for developers**
