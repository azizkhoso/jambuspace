const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const defaultPath = path.join('files');
if (!fs.existsSync(defaultPath)) fs.mkdirSync(defaultPath, { recursive: true });

const saveFile = (contents, extension, collection) => {
  const id = crypto.randomBytes(10).toString('hex');
  const newPath = path.join(defaultPath, collection);
  if (!fs.existsSync(newPath)) fs.mkdirSync(newPath, { recursive: true });
  fs.writeFileSync(path.join(newPath, `${id}.${extension}`), contents, { encoding: 'utf-8', force: true });
  return {
    id,
    path: path.join(newPath, `${id}.${extension}`),
    filename: `${id}.${extension}`,
  }
}

const updateFile = (filePath, contents) => {
  fs.writeFileSync(filePath, contents, { flag: 'w+' });
}

module.exports = {
  saveFile,
  updateFile,
};