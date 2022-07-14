const util = require('util');
const fs = require('fs');
const readFileAsync = util.promisify(fs.readFile);

const rimraf = require("rimraf")

const walkFolderAsync = require('./src/walkFolerSync');

const curpath = '/Users/xulsp/known/tpp-manage';

const options = {
  // ignore folders
  ignores: ['node_modules', 'dist', 'public'],
  // match files
  matchFileExtensions: [
    '.tsx',
    '.js',
    '.ts',
    '.jsx',
    '.css',
    '.less',
    '.scss',
    '.sass',
  ],
};

exports.findUnusedImgs = async function(params={}) {
  const fileMap = await walkFolderAsync(curpath, {
    ignores: options.ignores,
    matchFileExtensions: [
      '.png',
      '.jpeg',
      '.JPEG',
      '.PNG',
      '.gif',
      '.GIF',
      '.bmp',
      '.jpg',
      '.jpeg',
      '.JPEG',
    ],
  });

  const matchFileMap = await walkFolderAsync(curpath, {
    ignores: params.ignores|| options.ignores,
    matchFileExtensions: options.extensions || options.matchFileExtensions,
  });

  for (let params of matchFileMap.values()) {
    const content = await readFileAsync(params.filePath, { encoding: 'utf-8' });
    fileMap.forEach((value, filePath) => {
      if (content.includes(value.fileName)) {
        fileMap.set(filePath, {
          ...value,
          count: value.count ? ++value.count : 1,
        });
      }
    });
  }

  const noUseFiles = [];
  for (let value of fileMap.values()) {
    if (!value.count) {
      noUseFiles.push(value.filePath);
    }
  }
  return noUseFiles;
}




exports.removeFile = function(p){
  fs.unlinkSync(p)
}
