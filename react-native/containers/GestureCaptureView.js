import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Pressable
} from 'react-native';

import ToastModal from '../components/ToastModal';

const __TAB_DELAY = 200;

export default function App(props) {
  const toastRef = React.createRef();

  const [ play, setPlay ] = useState(false);
  const [ lastTapAt, setLastTapAt ] = useState(0);
  const [ lastTapX, setLastTapX ] = useState(0);
  const [ lastTapY, setLastTapY ] = useState(0);
  const [ startX, setStartX ] = useState(-1);
  const [ startY, setStartY ] = useState(-1);

  const onTouchStart = event => {
    if (event.nativeEvent.timestamp - lastTapAt < __TAB_DELAY) {
      setLastTapX(event.nativeEvent.locationX);
      setLastTapY(event.nativeEvent.locationY);
    }
    setStartX(event.nativeEvent.locationX);
    setStartY(event.nativeEvent.locationY);
  }

  const onTouchEnd = event => {
  }

  const onTouchMove = event => {
    if (startX === lastTapX && startY === lastTapY) {
      console.log('tab and drag');
    } else {
      console.log('drag');
    }
  }

  const onPress = event => {
    if (event.nativeEvent.timestamp - lastTapAt < __TAB_DELAY) {
      setLastTapAt(0);
      setPlay(!play);
      toastRef.current.show(!play ? 'Stop' : 'Start');
    } else {
      setLastTapAt(event.nativeEvent.timestamp);
    }
  }

  return (
    <Pressable
      style={ styles.container }
      onTouchStart={ onTouchStart }
      onTouchEnd={ onTouchEnd }
      onTouchMove={ onTouchMove }
      onPress={ onPress }
    >
      <ToastModal ref={ toastRef } />
    </Pressable>
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

// changedTouches - Array of all touch events that have changed since the last event
// identifier - The ID of the touch
// locationX - The X position of the touch, relative to the element
// locationY - The Y position of the touch, relative to the element
// pageX - The X position of the touch, relative to the root element
// pageY - The Y position of the touch, relative to the root element
// target - The node id of the element receiving the touch event
// timestamp - A time identifier for the touch, useful for velocity calculation
// touches - Array of all current touches on the screen