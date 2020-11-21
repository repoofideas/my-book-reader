import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { StatusBar } from 'expo-status-bar';
import { Camera } from 'expo-camera';
import * as Speech from 'expo-speech';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
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
  const [ message, setMessage ] = useState(null);

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

  const handlePlayStatusOnChange = async isPlaying => {
    if (isPlaying === null) return;
    
    const isSpeaking = await Speech.isSpeakingAsync();
    console.log(isSpeaking);
    if (isPlaying && isSpeaking) {
      await Speech.resume();
    } else if (isSpeaking) {
      await Speech.pause();
    }
  }

  const killSpeech = async () => {
    if (await Speech.isSpeakingAsync()) {
      await Speech.stop();
    }
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
      Speech.speak(textAnnotations.fullTextAnnotation.text, { language: 'en' });
      setMessage(textAnnotations);
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
          killSpeech={ killSpeech }
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