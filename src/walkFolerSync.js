const fs = require('fs');
const path = require('path');
const util = require('util');
const readdirAsync = util.promisify(fs.readdir);
const existsAsync = util.promisify(fs.exists);

module.exports = async function walkFolderAsync(currentDirPath, opts = {}) {
  let options = {
    ignores: [],
    matchFileExtensions: [],
    ...opts,
  };

  if (!currentDirPath) {
    console.log(`invalid function params`);
    return;
  }

  if (!(await existsAsync(currentDirPath))) {
    console.log(`${currentDirPath} is not exists`);
    return;
  }

  if (!Array.isArray(options.ignores)) {
    console.log(`options.ignores is not an list`);
    return;
  }

  if (!Array.isArray(options.matchFileExtensions)) {
    console.log(`options.matchFileExtensions is not an list`);
    return;
  }

  const fileMap = new Map();
  const folders = [currentDirPath];
  while (folders.length) {
    const curFoler = folders.shift();
    const files = await readdirAsync(curFoler);

    files.forEach(function (name) {
      // 默认忽略隐藏文件
      if (/^\..+/.test(name)) {
        return;
      }

      // 对忽略的目录不做处理
      if (options.ignores.includes(name)) {
        return;
      }

      const subpath = path.join(curFoler, name);
      const stat = fs.statSync(subpath);

      let filestat = {
        fileName: name,
        filePath: subpath,
      };
      if (stat.isFile()) {
        // 不符合扩展名的文件不做处理
        if (!options.matchFileExtensions.includes(path.extname(name))) {
          return;
        }
        fileMap.set(filestat.filePath, filestat);
      } else if (stat.isDirectory()) {
        folders.push(subpath);
      }
    });
  }
  return fileMap;
};
