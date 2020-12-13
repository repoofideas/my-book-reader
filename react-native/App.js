import React, { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';

import { StatusBar } from 'expo-status-bar';
import { Camera } from 'expo-camera';
import * as Speech from 'expo-speech';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Vibration,
} from 'react-native';

import LoadingModel from './components/LoadingModel';
import GestureCaptureView from './containers/GestureCaptureView';

import env from './config/environment';

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
  const loadingRef = React.createRef();
  const camaraRef = React.createRef();
  const [ hasPermission, setHasPermission ] = useState(null);
  const [ texts, setTexts ] = useState(null);
  const [ readingIndex, setReadingIndex ] = useState(-1);
  const [ readingSpeedRate, setReadingSpeedRate ] = useState(1);

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

  useEffect(() => {
    if (_.size(texts) > 0) {
      setReadingIndex(0);
    }
  }, [ texts ]);

  useEffect(() => {
    (async () => {
      try {
        if (await Speech.isSpeakingAsync()) {
          await Speech.stop();
        }

        if (readingIndex !== -1 && _.isInteger(readingIndex)) {
          await readText();
        }
      } catch (error) {
        alert(error.message)
      }
    })();
  }, [ readingIndex ]);

  const handlePlayStatusOnChange = async isPlaying => {
    if (isPlaying === null) return;
    
    const isSpeaking = await Speech.isSpeakingAsync();
    if (isPlaying && isSpeaking) {
      await Speech.resume();
    } else if (isSpeaking) {
      await Speech.pause();
    }
  }

  const updateReadingIndex = (reset, unit) => {
    if (reset) return setReadingIndex(-1);
    const newIndex = readingIndex + unit;
    if (newIndex > (_.size(texts) - 1) || newIndex < 0) {
      Vibration.vibrate();
    } else {
      setReadingIndex(newIndex);
    }
  }

  const updateReadingSpeedRate = (unit, cb) => {
    let updatedRate = readingSpeedRate + unit;
    if (updatedRate > 1.5) updatedRate = 1.5;
    if (updatedRate < 0.5) updatedRate = 0.5;
    setReadingSpeedRate(updatedRate);
    cb(updatedRate);
  }

  const readText = async () => {
    const text = texts[readingIndex];
    Speech.speak(text, {
      language: 'en',
      rate: readingSpeedRate,
      onDone: () => updateReadingIndex(null, 1),
    });
  }

  const getMessage = async onSucceed => {
    loadingRef.current.show();
    const image = await camaraRef.current.takePictureAsync({ quality: .75, base64: true });
    try {
      const response = await axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${ env.google_cloud_vision_api_key }`, {
        requests: [
          {
            image: { content: image.base64 },
            features: [
              { type: 'TEXT_DETECTION' },
              { type: 'DOCUMENT_TEXT_DETECTION' },
            ]
          }
        ]
      });

      loadingRef.current.dismiss();

      const textAnnotations = response.data.responses[0];
      const texts = [];
      _.each(_.get(textAnnotations, 'fullTextAnnotation.pages'), page => {
        _.each(_.get(page, 'blocks'), block => {
          _.each(_.get(block, 'paragraphs'), paragraph => {
            let paragraphText = [];
            _.each(_.get(paragraph, 'words'), word => {
              paragraphText.push(_.join(_.map(_.get(word, 'symbols'), 'text'), ''));
            });
            texts.push(_.join(paragraphText, ' '));
          });
        });
      });

      setTexts(texts);
      onSucceed();
    } catch (error) {
      alert(error.message);
    }
  }

  if (hasPermission === null) return <LoadingCamaraView />;
  if (hasPermission === false) return <NoPermissionView />;
  return (
    <View style={ styles.container }>
      <StatusBar style='dark' />
      <Camera
        ref={ camaraRef }
        style={ styles.camera }
        type={ Camera.Constants.Type.back }
      >
        <GestureCaptureView
          getMessage={ getMessage }
          updateReadingIndex={ updateReadingIndex }
          updateReadingSpeedRate={ updateReadingSpeedRate }
          handlePlayStatusOnChange={ handlePlayStatusOnChange }
        />
      </Camera>
      <LoadingModel ref={ loadingRef } />
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
    flex: 0.80,
  },
  text: {
    marginBottom: 8
  },
});
