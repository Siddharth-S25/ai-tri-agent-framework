// src/utils/fileHelper.js
const fs   = require('fs');
const path = require('path');

function readFile(filePath) {
  const full = path.resolve(filePath);
  if (!fs.existsSync(full)) {
    throw new Error(`File not found: ${full}`);
  }
  return fs.readFileSync(full, 'utf8');
}

function writeFile(filePath, content) {
  const full = path.resolve(filePath);
  const dir  = path.dirname(full);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(full, content, 'utf8');
  return full;
}

function fileExists(filePath) {
  return fs.existsSync(path.resolve(filePath));
}

module.exports = { readFile, writeFile, fileExists };