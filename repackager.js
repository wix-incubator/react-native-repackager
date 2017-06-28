#!/usr/bin/env node

const cp = require('child_process');

run();

function run() {
  console.log(`applying repackager patch to react-native 0.44`);
  console.log(`support for --customExtensions`);
  console.log(`${process.cwd()}`);
  cp.execSync(`git apply --verbose --no-index --directory ../../node_modules/react-native rn44PackagerCustomExtensions.patch`);
}
