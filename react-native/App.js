import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';

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

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={ styles.container }>
      <StatusBar style='dark' />
      <Camera style={ styles.camera } type={ Camera.Constants.Type.back }>
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
  }
});
