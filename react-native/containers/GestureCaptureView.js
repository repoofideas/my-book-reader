import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Pressable
} from 'react-native';

import ToastModal from '../components/ToastModal';

const __TAB_DELAY = 100;
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

  const onTouchStart = event => {
    setTapAndDrag(event.nativeEvent.timestamp - lastTapAt < __TAB_DELAY);
    setStartX(event.nativeEvent.locationX);
    setStartY(event.nativeEvent.locationY);
  }

  const onTouchEnd = event => {
    const endX = event.nativeEvent.locationX;
    const endY = event.nativeEvent.locationY;

    const direction = Math.abs(startX - endX) < Math.abs(startY - endY) ? __VERTICAL_DIRECTION : __HORIZONTAL_DIRECTION;

    if (!isTapAndDrag) {
      if (direction === __VERTICAL_DIRECTION && startY - endY >= __VERTICAL_SWIPE_THRESHOLD) {
        toastRef.current.show('Look up');
      } else if (direction === __VERTICAL_DIRECTION && endY - startX >= __VERTICAL_SWIPE_THRESHOLD) {
        toastRef.current.show('Stop');
        setPlay(false);
        props.updateReadingIndex(true);
      } else if (direction === __HORIZONTAL_DIRECTION && endX - startX >= __HORIZONTAL_SWIPE_THRESHOLD) {
        toastRef.current.show('Go Next');
        props.updateReadingIndex(false, 1);
      } else if (direction === __HORIZONTAL_DIRECTION && startX - endX >= __HORIZONTAL_SWIPE_THRESHOLD) {
        toastRef.current.show('Go Back');
        props.updateReadingIndex(false, -1);
      }
    }
  }

  const onTouchMove = event => {
    const movingX = event.nativeEvent.locationX;
    const movingY = event.nativeEvent.locationY;

    if (isTapAndDrag) {
      let pixelsFromOriginal = Math.sqrt(Math.pow(movingX - startX, 2) + Math.pow(movingY - startY, 2));

      // TODO: pixelsFromOriginal * __SPEED_RATE_PER_PIXAL = change rate
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
      toastRef.current.show(isPlaying ? 'Pause' : 'Play')
    } else {
      setLastTapAt(event.nativeEvent.timestamp);
    }
  }

  useEffect(() => {
    props.handlePlayStatusOnChange(isPlaying);
  }, [ isPlaying ]);

  const onLongPress = () => props.getMessage(() => {
    setPlay(true);
  });

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