const cp = require('child_process');

run();

function run() {
  cp.execSync(`git apply --verbose --no-index --directory ../../node_modules/react-native rn44PackagerCustomExtensions.patch`);
}
