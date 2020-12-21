# Gestured Book Reader

> This app is workable for both Android and iOS devices, to run this app, please download `Expo Client` on either Google Play or App Store on your devices.

### Steps to run the app
1. Set up google [cloud vision api](https://cloud.google.com/vision) and copy api key
2. Create a directory named 'config' and create a environment.js inside the directory as follows:
```javascript
const environments = {
  staging: {
    google_cloud_vision_api_key: 'YOUR API KEY',
  },
  production: {
    // Warning: This file still gets included in your native binary and is not a secure way to store secrets if you build for the app stores. Details: https://github.com/expo/expo/issues/83
  }
};

function getEnvironment() {
  let releaseChannel = Expo.Constants.manifest.releaseChannel;

  if (releaseChannel === undefined) releaseChannel = 'staging';

  return environments[releaseChannel];
}

export default getEnvironment();
```
3. Before running the source code, please make sure your machine have NodeJS version 10 installed, if not, please check [nvm](https://github.com/nvm-sh/nvm).
4. After the source code is cloned or unzipped to your machine, in terminal, please run `npm install` on the root dir of sourse code.
5. After the install, you should see dir `node_modules` has been created, then run `npm start`
    - If any unexpected error occurred, please run `node --version` to make sure you are running on `v10.x.x`.
6. The terminal should open a webpage for you, make sure on the bottom left your connection type is using `LAN`.
7. Use your mobile device to scan the QRCode and you are good to go, enjoy the Gestured Book Reader.
