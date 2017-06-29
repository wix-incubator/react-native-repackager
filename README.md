# react-native-repackager
Adding support for custom extension files for react-native packager


`react-native-repackager` is a [React Native](https://facebook.github.io/react-native/) packager extension which provide you an easy way to add files with custom extensions and to use them to override the original file while running RN packager with a special parameter.

## why-do-we-need-this-package

One of the biggest challenges when writing e2e tests with react environment is easy mocking.
Another case, is running your app with different behavior in different environments or debug\release.

Consider the following use-cases:
* Under e2e tests, use localhost mock HTTP server instead of the production service endpoint
* When running ios simulator, instead of natively accessing the contacts on the device, return mock contacts
<br/>
In order to make it super easy to mock stuff for tests, this package approach it like we handle imports in JavaScript code that is different between iOS and Android.
So in order to replace SomeFile.js, we will also create SomeFile.mock.js in the same directory.
When the packager will run for the e2e tests, it will pick up this file instead of the original. This way, the mocks files will not find themselves in our production code.


## Installation

**Currently supports only RN 0.44**

* Install the package from npm

```
npm install react-native-repackager --save
```

## API

* `repackager setup`: apply the code changes to the react-native packager
* `repackager injectReleaseSourceMap`: apply injection of sourcemap to release builds
* `repackager injectReleaseMockedE2E`: apply injection of `--customExtensions=e2e` to release builds
* `repackager <command> --reverse`: reverses the command, applies the reverse changes

## Usage

* First add your custom extension (mock) file to your project, for example:

<img src="http://i.imgur.com/g8AU012.png"/>

The packager will search for custom files in the following order:
 1) filename.ios.[customExtension].js \ filename.android.[customExtension].js
 2) filename.[customExtension].js
 3) filename.ios.js \ filename.android.js

* run react-packager with --customExtension parameter

```
node node_modules/react-native/local-cli/cli.js start --customExtensions=foo
```
<img src="http://i.imgur.com/NEIDDgH.png"/>

* for more then one file extension type

```
node node_modules/react-native/local-cli/cli.js start --customExtensions='foo, bar'
```

## Implementation Details

* This package injects code into the RN packager implementation (!)

## License

MIT
