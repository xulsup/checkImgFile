#! /usr/bin/env node
const { Command } = require('commander');
const program = new Command();
const packageJson = require('../package.json');
const {findUnusedImgs,removeFile} = require('../index.js')

program
  .version(packageJson.version)
  .description(
    'A tool for checking unreferenced files such as images in frontend projects.',
  );

program
  .option(
    '-p,--path <path>',
    'the path to the target project,default: current directory',
    './',
  )
  .option('-d,--delete', 'delete file', false)
  .option('-g,--ignore', 'ignore folder, default: node_modules,dist,public')
  .option(
    '-e,--extensions',
    'only match these files for checking,default: .tsx,.tx,.jsx,.js,.css,.less,.scss,.sass',
  );

program.parse(process.argv);

const options = program.opts();



findUnusedImgs({
  ignores: options.ignores,
  extensions: options.extensions
}).then(targetFiles => {
    targetFiles.forEach((target) => {
      console.log(target,'has not used')
      if(options.delete){
        removeFile(target)
      }
    })
}).catch(console.log)
