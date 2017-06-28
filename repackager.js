#!/usr/bin/env node

const exec = require('shell-utils').exec;
const fs = require('fs');
const _ = require('lodash');

const rootDir = process.cwd();
const scriptDir = __dirname;
const reactNativeDir = `${rootDir}/node_modules/react-native`;

const shouldSetup = _.includes(process.argv, 'setup');

run();

function run() {
  assertRN44();
  if (shouldSetup) {
    console.log(`injecting support for --customExtensions`);
    exec.execSync(`git apply --verbose --no-index --directory ${reactNativeDir} ${scriptDir}/rn44PackagerCustomExtensions.patch`);
  }
}

function assertRN44() {
  const rnPackageJson = JSON.parse(fs.readFileSync(`${reactNativeDir}/package.json`));
  if (!_.startsWith(rnPackageJson, '0.44')) {
    throw new Error(`Only react-native 0.44.x is supported currently`);
  }
}
