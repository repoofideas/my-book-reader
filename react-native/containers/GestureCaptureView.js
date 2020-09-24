import React, { useState } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

export default function App(props) {
  const gestureViewOnTouchStart = () => {
    alert('Touched!')
  }

  return (
    <View
      style={ styles.container }
      onTouchStart={ gestureViewOnTouchStart }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    borderColor: 'red',
    borderWidth: 1, 
  }
});
