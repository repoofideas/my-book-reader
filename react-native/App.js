import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Camera } from 'expo-camera';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';

import GestureCaptureView from './containers/GestureCaptureView';

export default function App() {
  const [ hasPermission, setHasPermission ] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (error) {
        alert(error.message)
      }
    })();
  }, []);

  const gestureViewOnTouchStart = () => {
    alert('Touched!')
  }

  if (hasPermission === null) return (
    <View style={ styles.container }>
      <Text style={ styles.text }>Loading Camera...</Text>
      <ActivityIndicator />
    </View>
  );
  if (hasPermission === false) return (
    <View style={ styles.container }>
      <Text style={ styles.text }>Failed to access camera.</Text>
      <Text style={ styles.text }>Make sure the permission has been granted.</Text>
    </View>
  );
  return (
    <View style={ styles.container }>
      <StatusBar style='dark' />
      <Camera style={ styles.camera } type={ Camera.Constants.Type.back }>
        <GestureCaptureView />
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
  gestureView: {
    height: '100%',
    width: '100%',
    borderColor: 'red',
    borderWidth: 1, 
  },
  text: {
    marginBottom: 8
  }
});
