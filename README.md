# 🏗️ mkstruct

> Instantly generate multi-level folder & file structures from **flat text** or **ASCII tree** format.  
> No more wasting 10 minutes creating nested files manually 👨‍💻⚡

---

## ✨ Features

- ✅ Accepts **flat file lists** or **tree-like ASCII structures**
- 📝 Creates all folders & empty files automatically
- 🚀 Works with `npx` — no global install required
- 💡 Perfect for scaffolding boilerplates, UI libraries, and project templates

---

## 📦 Install (optional)

```bash
npm install -g mkstruct
```

Or use directly via npx (no install):

```bash
npx mkstruct structure.txt
```
---

## 🧠 Usage
### 1️⃣ Flat structure

```txt
index.js
public/css/style.css
public/js/script.js
views/index.html
```

Run:

```bash 
mkstruct structure.txt
```

### 2️⃣ Tree structure

```txt
├── index.js
├── public
│   ├── css
│   │   └── style.css
│   └── js
│       └── script.js
└── views
    └── index.html
```

Run:

```bash
mkstruct tree.txt
```
