import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { StatusBar } from 'expo-status-bar';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

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
  const camaraRef = React.createRef();
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

  const onPress = async () => {
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

      const textAnnotations = response.data.responses[0];
      console.log(textAnnotations.fullTextAnnotation.text);
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
          handlePlayStatusOnChange={ handlePlayStatusOnChange }
        />
      </Camera>
      <TouchableOpacity
        style={ styles.button }
        onPress={ onPress }
      >
        <Text style={ styles.buttonText }>Submit</Text>
      </TouchableOpacity>
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
  button: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#61dafb',
  },
  buttonText: {
    color: '#fff'
  }
});

//   Object {
//     "fullTextAnnotation": Object {
//       "pages": Array [
//         Object {
//           "blocks": Array [
//             Object {
//               "blockType": "TEXT",
//               "boundingBox": Object {
//                 "vertices": Array [
//                   Object {
//                     "x": 650,
//                     "y": 1743,
//                   },
//                   Object {
//                     "x": 1142,
//                     "y": 1740,
//                   },
//                   Object {
//                     "x": 1144,
//                     "y": 2011,
//                   },
//                   Object {
//                     "x": 652,
//                     "y": 2014,
//                   },
//                 ],
//               },
//               "confidence": 0.87,
//               "paragraphs": Array [
//                 Object {
//                   "boundingBox": Object {
//                     "vertices": Array [
//                       Object {
//                         "x": 650,
//                         "y": 1743,
//                       },
//                       Object {
//                         "x": 1142,
//                         "y": 1740,
//                       },
//                       Object {
//                         "x": 1144,
//                         "y": 2011,
//                       },
//                       Object {
//                         "x": 652,
//                         "y": 2014,
//                       },
//                     ],
//                   },
//                   "confidence": 0.87,
//                   "words": Array [
//                     Object {
//                       "boundingBox": Object {
//                         "vertices": Array [
//                           Object {
//                             "x": 650,
//                             "y": 1743,
//                           },
//                           Object {
//                             "x": 1142,
//                             "y": 1740,
//                           },
//                           Object {
//                             "x": 1144,
//                             "y": 2011,
//                           },
//                           Object {
//                             "x": 652,
//                             "y": 2014,
//                           },
//                         ],
//                       },
//                       "confidence": 0.87,
//                       "symbols": Array [
//                         Object {
//                           "boundingBox": Object {
//                             "vertices": Array [
//                               Object {
//                                 "x": 650,
//                                 "y": 1743,
//                               },
//                               Object {
//                                 "x": 790,
//                                 "y": 1742,
//                               },
//                               Object {
//                                 "x": 792,
//                                 "y": 2013,
//                               },
//                               Object {
//                                 "x": 652,
//                                 "y": 2014,
//                               },
//                             ],
//                           },
//                           "confidence": 0.9,
//                           "text": "А",
//                         },
//                         Object {
//                           "boundingBox": Object {
//                             "vertices": Array [
//                               Object {
//                                 "x": 813,
//                                 "y": 1742,
//                               },
//                               Object {
//                                 "x": 954,
//                                 "y": 1741,
//                               },
//                               Object {
//                                 "x": 956,
//                                 "y": 2012,
//                               },
//                               Object {
//                                 "x": 815,
//                                 "y": 2013,
//                               },
//                             ],
//                           },
//                           "confidence": 0.96,
//                           "text": "В",
//                         },
//                         Object {
//                           "boundingBox": Object {
//                             "vertices": Array [
//                               Object {
//                                 "x": 992,
//                                 "y": 1741,
//                               },
//                               Object {
//                                 "x": 1142,
//                                 "y": 1740,
//                               },
//                               Object {
//                                 "x": 1144,
//                                 "y": 2011,
//                               },
//                               Object {
//                                 "x": 994,
//                                 "y": 2012,
//                               },
//                             ],
//                           },
//                           "confidence": 0.75,
//                           "property": Object {
//                             "detectedBreak": Object {
//                               "type": "LINE_BREAK",
//                             },
//                           },
//                           "text": "С",
//                         },
//                       ],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//           "height": 3072,
//           "width": 2304,
//         },
//       ],
//       "text": "АВС",
//     },
//     "textAnnotations": Array [
//       Object {
//         "boundingPoly": Object {
//           "vertices": Array [
//             Object {
//               "x": 650,
//               "y": 1740,
//             },
//             Object {
//               "x": 1144,
//               "y": 1740,
//             },
//             Object {
//               "x": 1144,
//               "y": 2014,
//             },
//             Object {
//               "x": 650,
//               "y": 2014,
//             },
//           ],
//         },
//         "description": "АВС",
//         "locale": "und",
//       },
//       Object {
//         "boundingPoly": Object {
//           "vertices": Array [
//             Object {
//               "x": 650,
//               "y": 1743,
//             },
//             Object {
//               "x": 1142,
//               "y": 1740,
//             },
//             Object {
//               "x": 1144,
//               "y": 2011,
//             },
//             Object {
//               "x": 652,
//               "y": 2014,
//             },
//           ],
//         },
//         "description": "АВС",
//       },
//     ],
//   },