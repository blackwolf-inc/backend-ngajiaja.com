const fs = require('fs');
const path = require('path');

const searchFiles = async (name, dir, key = '', deep = 0) => {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const dirPath = path.join(dir, dirent.name);
      if (dirent.isDirectory() && deep == 0) {
        return searchFiles(name, dirPath, dirent.name, deep + 1);
      } else if (dirent.name === name) {
        return { [key]: dirPath };
      }
    })
  );

  // let result = files.flat();
  let result = files.filter((el) => el);
  return Object.assign({}, ...result);
};

module.exports = searchFiles;
