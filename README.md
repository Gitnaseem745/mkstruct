# 🏗️ mkstruct

<div align="center">

[![npm version](https://badge.fury.io/js/mkstruct.svg)](https://www.npmjs.com/package/mkstruct)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/mkstruct)](https://nodejs.org)

</div>

> **Instantly generate multi-level folder & file structures from flat text or ASCII tree format.**  
> Stop wasting time creating nested directories manually. Scaffold entire projects in seconds! 🚀

---

## ✨ Features

- ✅ **Two Input Formats**: Flat file lists or tree-like ASCII structures
- 📝 **Automatic Detection**: Intelligently detects format type
- 🚀 **Zero Config**: Works with `npx` — no global install required
- 🛡️ **Safe by Default**: Dry-run mode to preview before creating
- 💪 **Force Mode**: Overwrite existing files when needed
- 🎯 **Smart Path Handling**: Correctly handles nested directories
- 💡 **Perfect For**: Scaffolding boilerplates, UI libraries, and project templates
- 🔒 **Security**: Prevents writing outside current directory

---

## 📦 Installation

### Option 1: Use with npx (Recommended)
No installation needed! Run directly:

```bash
npx mkstruct structure.txt
```

### Option 2: Global Install
Install once, use anywhere:

```bash
npm install -g mkstruct
```

### Option 3: Local Project Install
Add to your project's dev dependencies:

```bash
npm install --save-dev mkstruct
```

---

## 🚀 Quick Start

### 1️⃣ Flat Format

Create a file `structure.txt` with paths separated by slashes:

```txt
src/index.js
src/components/Header.jsx
src/components/Footer.jsx
src/styles/main.css
public/images/logo.png
README.md
```

Generate the structure:

```bash
mkstruct structure.txt
```

**Result:**
```
✅ Created file: src/index.js
📁 Created folder: src/components
✅ Created file: src/components/Header.jsx
✅ Created file: src/components/Footer.jsx
📁 Created folder: src/styles
✅ Created file: src/styles/main.css
...
```

---

### 2️⃣ Tree Format

Create a file `tree.txt` with ASCII tree structure:

```txt
├── src
│   ├── index.js
│   ├── components
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   └── styles
│       └── main.css
├── public
│   └── images
│       └── logo.png
└── README.md
```

Generate the structure:

```bash
mkstruct tree.txt
```

**Note:** mkstruct automatically detects which format you're using!

---

## 📚 Usage & Options

### Basic Syntax

```bash
mkstruct [file] [options]
```

### Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--dry-run` | `-d` | Preview actions without creating files |
| `--force` | `-f` | Overwrite existing files |
| `--stdin` | `-s` | Read structure from stdin instead of file |
| `--verbose` | `-v` | Enable verbose logging |
| `--help` | `-h` | Show help information |

---

## 💡 Examples

### Preview Before Creating (Dry Run)

```bash
mkstruct structure.txt --dry-run
```

Output:
```
[DRY] create file: src/index.js
[DRY] mkdir: src/components
[DRY] create file: src/components/Header.jsx
...
```

---

### Read from stdin

```bash
cat structure.txt | mkstruct --stdin
```

Or create on-the-fly:

```bash
echo -e "src/index.js\nsrc/App.js\nREADME.md" | mkstruct --stdin
```

---

### Force Overwrite Existing Files

```bash
mkstruct structure.txt --force
```

**⚠️ Warning:** This will overwrite existing files without prompting!

---

### Verbose Output

```bash
mkstruct structure.txt --verbose
```

---

## 🎯 Real-World Use Cases

### 1. Scaffold a React Project

`react-structure.txt`:
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

---

### 2. Create Express.js Backend

`backend-tree.txt`:
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

---

### 3. Documentation Structure

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

### 4. Test Directory Setup

```txt
tests/unit/utils.test.js
tests/unit/components.test.js
tests/integration/api.test.js
tests/e2e/user-flow.test.js
tests/fixtures/data.json
tests/__mocks__/axios.js
```

---

## 🔧 Advanced Usage

### Combine with Other Tools

```bash
# Generate from GitHub gist
curl -s https://gist.githubusercontent.com/user/id/raw | mkstruct --stdin

# Generate and initialize git
mkstruct structure.txt && git init

# Generate, install dependencies, and start
mkstruct structure.txt && npm init -y && npm install express
```

---

### Create Custom Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "scaffold": "mkstruct templates/project-structure.txt",
    "scaffold:preview": "mkstruct templates/project-structure.txt --dry-run"
  }
}
```

Then run:
```bash
npm run scaffold
```

---

## 📖 Format Specifications

### Flat Format Rules

1. Use forward slashes (`/`) for paths, even on Windows
2. Files must have an extension (e.g., `.js`, `.css`, `.md`)
3. Folders are automatically created for nested paths
4. One path per line
5. Empty lines are ignored

**Example:**
```txt
src/index.js          ← File (has extension)
src/utils/            ← Folder (no extension, optional trailing /)
config/env.json       ← Nested file
```

---

### Tree Format Rules

1. Use standard tree characters: `├──`, `└──`, `│`
2. Each level is indented by 4 spaces or 1 tab
3. Files are detected by having an extension
4. The format is automatically detected

**Tree Characters:**
- `├──` - Branch item
- `└──` - Last branch item
- `│` - Vertical line for nesting

**Example:**
```txt
project/
├── src
│   ├── index.js
│   └── utils
│       └── helper.js
└── README.md
```

---

## ⚠️ Important Notes

### Security

- mkstruct **prevents writing outside** the current working directory
- Paths starting with `..` or absolute paths are rejected
- Always review the structure file before running with `--force`

### Existing Files

- By default, mkstruct **skips existing files** (shows warning)
- Use `--force` to overwrite existing files
- Use `--dry-run` to preview before creating

### Cross-Platform Compatibility

- Use forward slashes (`/`) in structure files on all platforms
- mkstruct automatically converts to Windows backslashes when needed
- Tree format works identically on Windows, Mac, and Linux

---

## 🐛 Troubleshooting

### Problem: "No input file provided"

**Solution:** Provide a filename or use `--stdin`:
```bash
mkstruct mystructure.txt
# OR
echo "src/index.js" | mkstruct --stdin
```

---

### Problem: Files created in wrong location

**Solution:** Make sure you're in the correct directory:
```bash
pwd  # Check current directory
cd /path/to/project
mkstruct structure.txt
```

---

### Problem: Tree format not detected

**Solution:** Ensure proper tree characters (`├──`, `└──`, `│`) are used. Copy from examples or use a tree generator.

---

### Problem: "Refusing to write outside CWD"

**Solution:** Don't use absolute paths or `..` in your structure file. All paths should be relative to current directory.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs**: Open an issue with details
2. **Suggest Features**: Share your ideas in issues
3. **Submit PRs**: Fork, create a branch, and submit a pull request
4. **Improve Docs**: Help make documentation clearer

### Development Setup

```bash
# Clone the repository
git clone https://github.com/Gitnaseem745/mkstruct.git
cd mkstruct

# Install dependencies
npm install

# Run locally
node bin/index.js examples/structure.txt --dry-run
```

---

## 📄 License

MIT © [Naseem Ansari](https://github.com/Gitnaseem745)

See [LICENSE](https://github.com/Gitnaseem745/mkstruct?tab=License-1-ov-file) file for details.

---

## 🌟 Show Your Support

If mkstruct helped you save time, please give it a ⭐️ on [GitHub](https://github.com/Gitnaseem745/mkstruct)!

---

## 📞 Contact & Links

- **GitHub**: [@Gitnaseem745](https://github.com/Gitnaseem745)
- **NPM**: [mkstruct](https://www.npmjs.com/package/mkstruct)
- **Issues**: [Report a bug](https://github.com/Gitnaseem745/mkstruct/issues)

---

**Made with ❤️ by developers, for developers**
