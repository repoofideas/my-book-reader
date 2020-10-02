import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';

import GestureCaptureView from './containers/GestureCaptureView';

function LoadingCamaraView() {
  return (
    <View style={ styles.container }>
      <Text style={ styles.text }>Loading Camera...</Text>
      <ActivityIndicator />
    </View>
  );
}

function NoPermissionView() {
  return (
    <View style={ styles.container }>
      <Text style={ styles.text }>Failed to access camera.</Text>
      <Text style={ styles.text }>Make sure the permission has been granted.</Text>
    </View>
  );
}

export default function App() {
  const [ hasPermission, setHasPermission ] = useState(null);
  const soundObject = new Audio.Sound();

  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (error) {
        alert(error.message)
      }
    })();
  }, []);

  const handlePlayStatusOnChange = async isPlaying => {
    if (isPlaying === null) {
      await soundObject.loadAsync(require('./assets/Dynamite.mp3'));
    } else if (isPlaying) {
      await soundObject.playAsync();
    } else {
      await soundObject.pauseAsync();
    }
  }

  if (hasPermission === null) return <LoadingCamaraView />;
  if (hasPermission === false) return <NoPermissionView />;
  return (
    <View style={ styles.container }>
      <StatusBar style='dark' />
      <Camera style={ styles.camera } type={ Camera.Constants.Type.back }>
        <GestureCaptureView
          handlePlayStatusOnChange={ handlePlayStatusOnChange }
        />
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: '100%',
    flex: 0.85,
  },
  text: {
    marginBottom: 8
  }
});
