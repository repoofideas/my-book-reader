import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Pressable
} from 'react-native';

import ToastModal from '../components/ToastModal';

const __TAB_DELAY = 200;
const __VERTICAL_SWIPE_THRESHOLD = 250;
const __HORIZONTAL_SWIPE_THRESHOLD = 170;
const __VERTICAL_DIRECTION = 'ver';
const __HORIZONTAL_DIRECTION = 'hor';
const __SPEED_RATE_PER_PIXAL = 1;

export default function App(props) {
  const toastRef = React.createRef();

  const [ isPlaying, setPlay ] = useState(null);
  const [ lastTapAt, setLastTapAt ] = useState(0);
  const [ startX, setStartX ] = useState(-1);
  const [ startY, setStartY ] = useState(-1);
  const [ isTapAndDrag, setTapAndDrag ] = useState(false);
  const [ direction, setDirection ] = useState(null);

  const onTouchStart = event => {
    setTapAndDrag(event.nativeEvent.timestamp - lastTapAt < __TAB_DELAY);
    setStartX(event.nativeEvent.locationX);
    setStartY(event.nativeEvent.locationY);
    setDirection(null);
  }

  const onTouchEnd = event => {
    const endX = event.nativeEvent.locationX;
    const endY = event.nativeEvent.locationY;

    if (!isTapAndDrag) {
      if (direction === __VERTICAL_DIRECTION && startY - endY >= __VERTICAL_SWIPE_THRESHOLD) {
        toastRef.current.show('Look up');
      } else if (direction === __HORIZONTAL_DIRECTION && endX - startX >= __HORIZONTAL_SWIPE_THRESHOLD) {
        toastRef.current.show('Go Next');
      } else if (direction === __HORIZONTAL_DIRECTION && startX - endX >= __HORIZONTAL_SWIPE_THRESHOLD) {
        toastRef.current.show('Go Back');
      }
    }
  }

  const onTouchMove = event => {
    const movingX = event.nativeEvent.locationX;
    const movingY = event.nativeEvent.locationY;

    if (direction === null) {
      setDirection(startX !== event.nativeEvent.locationX ? __HORIZONTAL_DIRECTION : __VERTICAL_DIRECTION);
    }

    if (isTapAndDrag) {
      let pixelsFromOriginal = Math.sqrt(Math.pow(movingX - startX, 2) + Math.pow(movingY - startY, 2));

      if (movingX > startX) {
        console.log('Increase: ', pixelsFromOriginal);
      } else {
        console.log('Decrease: ', pixelsFromOriginal);
      }
    }
  }

  const onPress = event => {
    if (event.nativeEvent.timestamp - lastTapAt < __TAB_DELAY) {
      setLastTapAt(0);
      setPlay(!isPlaying);
    } else {
      setLastTapAt(event.nativeEvent.timestamp);
    }
  }

  useEffect(() => {
    if (isPlaying !== null) {
      toastRef.current.show(!isPlaying ? 'Pause' : 'Play');
    }
    props.handlePlayStatusOnChange(isPlaying);
  }, [ isPlaying ]);

  const onLongPress = () => {
    // TODO: rescan the document using camara
  }

  return (
    <Pressable
      style={ styles.container }
      onTouchStart={ onTouchStart }
      onTouchEnd={ onTouchEnd }
      onTouchMove={ onTouchMove }
      onPress={ onPress }
      onLongPress={ onLongPress }
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