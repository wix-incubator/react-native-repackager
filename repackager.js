#!/usr/bin/env node

const exec = require('shell-utils').exec;
const fs = require('fs');
const _ = require('lodash');

const rootDir = process.cwd();
const scriptDir = __dirname;
const reactNativeDir = `${rootDir}/node_modules/react-native`;

const shouldSetup = _.includes(process.argv, 'setup');
const shouldInjectSourceMap = _.includes(process.argv, 'injectReleaseSourceMap');
const shouldInjectMockedE2E = _.includes(process.argv, 'injectReleaseMockedE2E');

const shouldReverse = _.includes(process.argv, '--reverse');

run();

function run() {
  assertRN44();
  if (shouldSetup) {
    setup();
  }
  if (shouldInjectSourceMap) {
    injectSourceMap();
  }
  if (shouldInjectMockedE2E) {
    injectMockedE2E();
  }
}

function setup() {
  if (alreadySetup()) {
    console.log(`repackager was already applied successfully, exiting`);
    return;
  }
  console.log(`injecting support for --customExtensions`);
  exec.execSync(`git apply --verbose --no-index --directory node_modules/react-native ${scriptDir}/rn44PackagerCustomExtensions.patch`);
}

function injectSourceMap() {
  console.log(`${shouldReverse ? 'reversing' : 'injecting'} bundle sourcemap arg to release builds`);
  exec.execSync(`git apply ${shouldReverse ? '--reverse' : ''} --verbose --no-index --directory node_modules/react-native ${scriptDir}/rn44PackagerReleaseSourceMap.patch`);
}

function injectMockedE2E() {
  console.log(`${shouldReverse ? 'reversing' : 'injecting'} bundle customExtensions=e2e to release builds`);
  exec.execSync(`git apply ${shouldReverse ? '--reverse' : ''} --verbose --no-index --directory node_modules/react-native ${scriptDir}/rn44PackagerReleaseMockedE2E.patch`);
}

function assertRN44() {
  const rnPackageFile = `${reactNativeDir}/package.json`;
  if (!fs.existsSync(rnPackageFile)) {
    throw new Error(`Can't locate react-native folder in ${reactNativeDir}`);
  }
  const rnPackageJson = JSON.parse(fs.readFileSync(rnPackageFile));
  if (!_.startsWith(rnPackageJson.version, '0.44')) {
    throw new Error(`Only react-native 0.44.x is supported currently`);
  }
}

function alreadySetup() {
  return _.includes(String(fs.readFileSync(`${reactNativeDir}/local-cli/cli.js`)), 'repackager applied successfully');
}
