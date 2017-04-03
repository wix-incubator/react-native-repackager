# react-native-repackager
Custom extensions for react-native packager


`react-native-repackager` is a [React Native](https://facebook.github.io/react-native/) npm extension package which provide you an easy way to add files with custom extensions and to use them to override the original file while running RN packager with special parameter.


* [Why do we need this package?](#why-do-we-need-this-package)
* [Installation](#installation)
* [Usage](#usage)
* [Implementation Details](#implementation-details)
* [License](#license)


## why-do-we-need-this-package

One of the biggest challenges when running e2e like tests with react environment (like [Detox](https://github.com/wix/detox/)) is easy mocking.

Consider the following use-cases:
* Under Detox, use localhost mock HTTP server instead of the production service endpoint
* Under Detox, instead of natively accessing the contacts on the device, return mock contacts
<br/>
In order to make it's super easy to mock stuff for tests, this package approach it like we handle in JavaScript code that is different between iOS and Android.
So in order to replace someFile.js, we will also create someFile.mock.js in the same directory.
When the packager will run for the e2e tests, it will pick up this file instead of the original. This way, the mocks files will not find themselves in our production code.


## Installation

**Currently support RN 0.38 or 0.42**

* Install the package from npm

```
npm install react-native-repackager --save
```

## Usage

* First add your custom extension (mock) file to your project, for example:

<img src="http://i.imgur.com/g8AU012.png"/>

The packager will search for custom files in the following order:
 1) filename.ios.[customExtension].js \ filename.android.[customExtension].js
 2) filename.[customExtension].js
 3) filename.ios.js \ filename.android.js

* run react-packager with --custom-extension parameter

```
node node_modules/react-native/local-cli/cli.js start --customExtensions=foo
```
<img src="http://i.imgur.com/NEIDDgH.png"/>

* for more then one file extension type

```
node node_modules/react-native/local-cli/cli.js start --customExtensions='foo, bar'
```

## Implementation Details

* This package inject code into the RN packager implementation (!)

* The repository contain only one patch file, and postinstall script. After npm install the package will replace the relevant files in RN packager to make the magic.

## License

MIT
