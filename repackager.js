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
  console.log(`rootDir: ${rootDir}`);
  console.log(`scriptDir: ${scriptDir}`);
  assertRN44();
  if (shouldSetup) {
    if (alreadyApplied()) {
      console.log(`repackager was already applied successfully, exiting`);
      return;
    }
    console.log(`injecting support for --customExtensions`);
    exec.execSync(`git apply --verbose --no-index --directory node_modules/react-native ${scriptDir}/rn44PackagerCustomExtensions.patch`);
  }
}

function assertRN44() {
  const rnPackageJson = JSON.parse(fs.readFileSync(`${reactNativeDir}/package.json`));
  if (!_.startsWith(rnPackageJson.version, '0.44')) {
    throw new Error(`Only react-native 0.44.x is supported currently`);
  }
}

function alreadyApplied() {
  return _.includes(String(fs.readFileSync(`${reactNativeDir}/local-cli/cli.js`)), 'repackager applied successfully');
}
