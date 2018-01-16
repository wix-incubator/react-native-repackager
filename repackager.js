#!/usr/bin/env node

const exec = require('shell-utils').exec;
const fs = require('fs');
const _ = require('lodash');

const rootDir = process.cwd();
const scriptDir = __dirname;
const reactNativeDir = `${rootDir}/node_modules/react-native`;

const shouldSetup = _.includes(process.argv, 'setup');
const shouldReverse = _.includes(process.argv, '--reverse');

run();

function run() {
  assertRN51();
  if (shouldSetup) {
    setup();
  }
}

function setup() {
  if (!shouldReverse && alreadySetup()) {
    console.log(`repackager was already applied successfully, exiting. Maybe you would like to --reverse ?`);
    return;
  }
  console.log(`injecting support for custom sourceExts`);
  patch('repackagerRN51Setup');
}

function assertRN51() {
  const rnPackageFile = `${reactNativeDir}/package.json`;
  if (!fs.existsSync(rnPackageFile)) {
    throw new Error(`Can't locate react-native folder in ${reactNativeDir}`);
  }
  const rnPackageJson = JSON.parse(fs.readFileSync(rnPackageFile));
  if (!_.startsWith(rnPackageJson.version, '0.51')) {
    throw new Error(`Only react-native 0.51.x is supported`);
  }
}

function alreadySetup() {
  return _.includes(String(fs.readFileSync(`${reactNativeDir}/local-cli/cli.js`)), 'repackager applied successfully');
}

function patch(patchFileName) {
  exec.execSync(`patch ${shouldReverse ? '--reverse' : ''} --strip 1 --directory node_modules/react-native < ${scriptDir}/${patchFileName}.patch`);
}
