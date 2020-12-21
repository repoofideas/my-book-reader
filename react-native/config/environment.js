import { Constants } from 'expo';

const environments = {
  staging: {
    google_cloud_vision_api_key: 'AIzaSyBXtcdXRrguVRgFFA9UV8177PEcJw4MYH0',
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