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
const __SPEED_RATE_PER_PIXAL = 0.002;

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
        setPlay(true);
        props.updateReadingIndex(false, 1);
      } else if (direction === __HORIZONTAL_DIRECTION && startX - endX >= __HORIZONTAL_SWIPE_THRESHOLD) {
        toastRef.current.show('Go Back');
        setPlay(true);
        props.updateReadingIndex(false, -1);
      }
    } else if (startX !== endX && startY !== endY) {
      const pixelsFromOriginal = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      const unit = pixelsFromOriginal * __SPEED_RATE_PER_PIXAL * (endX > startX ? 1 : -1);
      props.updateReadingSpeedRate(unit, updatedRate => {
        toastRef.current.show('Change Reading Speed to: ' + Math.round(updatedRate * 10) / 10);
      });
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
