const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".jsonc",
  ".css",
  ".scss",
  ".sass",
  ".html",
  ".htm",
  ".md",
  ".mdx",
  ".yml",
  ".yaml",
  ".toml",
  ".ini",
  ".cfg",
  ".xml",
  ".svg",
  ".txt",
  ".c",
  ".h",
  ".cpp",
  ".hpp",
  ".java",
  ".py",
  ".sh",
  ".bash",
  ".zsh",
  ".ps1",
  ".psm1",
  ".dockerfile",
  ".gradle",
  ".bat",
  ".cmd",
]);

const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  ".hg",
  "dist",
  "build",
  "out",
]);

function isTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return EXTENSIONS.has(ext);
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name));
      continue;
    }

    const filePath = path.join(dir, entry.name);
    if (!isTextFile(filePath)) continue;

    try {
      const original = fs.readFileSync(filePath, "utf8");
      const stripped = stripComments(original);
      if (stripped !== original) {
        fs.writeFileSync(filePath, stripped, "utf8");
        console.log(`Stripped comments: ${path.relative(ROOT, filePath)}`);
      }
    } catch (err) {
      console.error(`Failed to process ${filePath}:`, err);
    }
  }
}

function stripComments(input) {
  const len = input.length;
  let out = "";
  let i = 0;
  let state = "normal";
  let prevChar = "";
  let braceDepth = 0;

  while (i < len) {
    const ch = input[i];
    const next = input[i + 1];

    switch (state) {
      case "normal": {
        if (ch === "/" && next === "/") {
          state = "lineComment";
          i += 2;
          continue;
        }
        if (ch === "/" && next === "*") {
          state = "blockComment";
          i += 2;
          continue;
        }
        if (ch === '"') {
          out += ch;
          state = "doubleQuote";
          i++;
          continue;
        }
        if (ch === "'") {
          out += ch;
          state = "singleQuote";
          i++;
          continue;
        }
        if (ch === "`") {
          out += ch;
          state = "template";
          i++;
          continue;
        }
        if (ch === "<" && input.slice(i, i + 4) === "<!--") {
          state = "htmlComment";
          i += 4;
          continue;
        }

        out += ch;
        i++;
        break;
      }

      case "lineComment": {
        if (ch === "\n") {
          out += ch;
          state = "normal";
        }
        i++;
        break;
      }

      case "blockComment": {
        if (ch === "*" && next === "/") {
          i += 2;
          state = "normal";
          continue;
        }
        i++;
        break;
      }

      case "htmlComment": {
        if (ch === "-" && next === "-" && input[i + 2] === ">") {
          i += 3;
          state = "normal";
          continue;
        }
        i++;
        break;
      }

      case "doubleQuote": {
        if (ch === "\\") {
          out += ch;
          if (i + 1 < len) {
            out += input[i + 1];
            i += 2;
            continue;
          }
        }
        if (ch === '"') {
          out += ch;
          state = "normal";
          i++;
          continue;
        }
        out += ch;
        i++;
        break;
      }

      case "singleQuote": {
        if (ch === "\\") {
          out += ch;
          if (i + 1 < len) {
            out += input[i + 1];
            i += 2;
            continue;
          }
        }
        if (ch === "'") {
          out += ch;
          state = "normal";
          i++;
          continue;
        }
        out += ch;
        i++;
        break;
      }

      case "template": {
        if (ch === "\\") {
          out += ch;
          if (i + 1 < len) {
            out += input[i + 1];
            i += 2;
            continue;
          }
        }
        if (ch === "$" && next === "{") {
          out += "${";
          braceDepth = 0;
          state = "templateExpression";
          i += 2;
          continue;
        }
        if (ch === "`") {
          out += ch;
          state = "normal";
          i++;
          continue;
        }
        out += ch;
        i++;
        break;
      }

      case "templateExpression": {
        if (ch === "/" && next === "/") {
          state = "lineComment";
          i += 2;
          continue;
        }
        if (ch === "/" && next === "*") {
          state = "blockComment";
          i += 2;
          continue;
        }
        if (ch === '"') {
          out += ch;
          state = "doubleQuote";
          i++;
          continue;
        }
        if (ch === "'") {
          out += ch;
          state = "singleQuote";
          i++;
          continue;
        }
        if (ch === "`") {
          out += ch;
          state = "template";
          i++;
          continue;
        }
        if (ch === "{") {
          braceDepth += 1;
          out += ch;
          i++;
          continue;
        }
        if (ch === "}") {
          if (braceDepth === 0) {
            out += ch;
            state = "template";
            i++;
            continue;
          }
          braceDepth -= 1;
          out += ch;
          i++;
          continue;
        }
        out += ch;
        i++;
        break;
      }

      default:
        out += ch;
        i++;
        break;
    }
    prevChar = ch;
  }

  return out;
}

console.log("Removing comments from files (this may take a moment)...");
walk(ROOT);
console.log("Done.");
