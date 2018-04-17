![MISSION ACCOMPLISHED](https://i1.wp.com/dbdailyupdate.com/wp-content/uploads/2018/04/trump-mission-accomplished.jpg?fit=594%2C393)

# This project is no longer needed as of `react-native@0.55.x`

# Repackager
Adding support for custom file extensions for react-native.

### This repo is a workaround (read: giant hack) until [this PR is merged](https://github.com/facebook/react-native/pull/16948).

## Why

One of the biggest challenges when writing e2e tests with react-native environment is easy mocking.
Another case, is running your app with different behavior in different environments or debug\release.

Consider the following use-cases:
* Under e2e tests, use localhost mock HTTP server instead of the production service endpoint
* When running ios simulator, instead of natively accessing the contacts on the device, return mock contacts
<br/>
In order to make it super easy to mock stuff for tests, this package approach it like we handle imports in JavaScript code that is different between iOS and Android.
So in order to replace SomeFile.js, we will also create SomeFile.e2e.js in the same directory.
When the packager will run for the e2e tests, it will pick up this file instead of the original. This way, the mock files will not find themselves in our production code.

## Installation

**Currently supports only RN 0.51**
> `react-native-repackager@0.44.x` is for react-native 44.

* Install the package from npm

```
npm install react-native-repackager --save
```

add `repackager setup` to your postinstall script, this will patch react-native, allowing it to respect custom `sourceExt`.

```json
"scripts": {
  "postinstall": "repackager setup"
}
```

## API

* `repackager setup`: apply the code changes to the react-native packager
* `repackager <command> --reverse`: reverses the command, removes the changes

## Usage

* First add your custom extension (mock) file to your project, for example:

<img src="http://i.imgur.com/g8AU012.png"/>

The packager will search for custom files in the following order:
 1) filename.ios.[customExtension].js \ filename.android.[customExtension].js
 2) filename.[customExtension].js
 3) filename.ios.js \ filename.android.js


### Two ways to trigger 'repackager' on React Native 0.51.x

Let's say we want to load files with custom extension like `e2e.js`. We have two options:
#### Method 1: CLI args on the packager (Debug only!).
Run the packager with this argument:
`react-native start —sourceExts=e2e.js`
It will load files that match `*.e2e.js` instead of regular ones.

#### Method 2: Config file (Debug or Release builds)
Create a file called `rn-cli.config.js` in your module’s main dir (the one with package.json).
Put this inside :
```js
module.exports = {
 getSourceExts: () => ['e2e.js']
}
```
`getSourceExts` is a function that returns an array containing a list of custom source extensions. The array can contain multiple custom extensions, if you'd like.
It is recommended to turn the custom extensions on and off using an environment variable, like so :

```js
module.exports = {
 getSourceExts: () => process.env.RN_FLAVOR === 'E2E' ? ['e2e.js'] : []
}
```
Where env variable RN_FLAVOR controls which files we load.

Method 2 works for release builds as well.

## Implementation Details

* This package injects code into the local react-native installation under `./node_modules` (!)

## License

MIT
