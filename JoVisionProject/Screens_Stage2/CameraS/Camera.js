import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import requestCameraPermission from "./permissions";

const CameraScreen = () => {
  const [cameraPicker, setCameraPicker] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [media, setMedia] = useState(null); 
  const [mode, setMode] = useState('photo'); 
  const [isRecording, setIsRecording] = useState(false);
  const device = useCameraDevice(cameraPicker ? 'front' : 'back');
  const cameraRef = useRef(null);

  useEffect(() => {
    const getPermission = async () => {
      const granted = await requestCameraPermission();
      setHasPermission(granted);
    };
    getPermission();
  }, []);

  const changeCamera = () => {
    setCameraPicker(!cameraPicker);
  };

  const switchMode = () => {
    setMode(mode === 'photo' ? 'video' : 'photo');
  };

  const takePhotoOrRecord = async () => {
    if (cameraRef.current) {
      try {
        if (mode === 'photo') {
          const takenPhoto = await cameraRef.current.takePhoto();
          console.log('Photo taken:', takenPhoto);
          console.log(takenPhoto.path);
          const now = new Date();
const formattedDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
const newpath = `${RNFS.DocumentDirectoryPath}/QasemQudah_${formattedDate}.jpg`;
          RNFS.copyFile(takenPhoto.path, newpath);
          console.log('Photo copied to:', newpath);
          if (takenPhoto) {
            takenPhoto.path = newpath;
            setMedia(takenPhoto.path);
          }
        } else if (mode === 'video') {
          if (isRecording) {
            await cameraRef.current.stopRecording();
            console.log('Recording stopped');
            setIsRecording(false);
          } else {
            const video = await cameraRef.current.startRecording({
              onRecordingFinished: (video) => {
                console.log('Recording finished:', video);
                if (video && video.path) {
                  setMedia(video.path); 
                } else {
                  console.error('Recording finished with no video path');
                }
                setIsRecording(false);
              },
              onRecordingError: (error) => {
                console.error('Error during recording:', error);
                setIsRecording(false);
              },
            });
            setIsRecording(true);
            console.log('Recording started:', video);
          }
        }
      } catch (error) {
        console.error('Error in takePhotoOrRecord:', error);
      }
    }
  };

  const saveMediaToCameraRoll = async (uri) => {
    try {
      const type = uri.endsWith('.jpg') ? 'photo' : 'video';
      await CameraRoll.save(uri, { type });
      console.log('Media saved to camera roll');
      setMedia(null); // Clear the media state after saving
    } catch (error) {
      console.error('Error saving media to camera roll:', error);
    }
  };

  const discardMedia = () => {
    setMedia(null);
  };

  return (
    <View style={styles.container}>
      {hasPermission && device ? (
        <>
          {media ? (
            <View style={styles.previewContainer}>
              {media.endsWith('.jpg') ? (
                <Image source={{ uri: `file://${media}` }} style={styles.preview} />
              ) : (
                <Video
                  source={{ uri: `file://${media}` }}
                  style={styles.preview}
                  controls={true}
                  resizeMode="contain"
                />
              )}
              <View style={styles.buttonContainer}>
                <Button title="Save" onPress={() => saveMediaToCameraRoll(media)} />
                <Button title="Discard" onPress={discardMedia} />
              </View>
            </View>
          ) : (
            <>
              <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={mode === 'photo'}
                video={mode === 'video'}
              />
              <Button title="Switch Camera" onPress={changeCamera} />
              <Button title={`Switch to ${mode === 'photo' ? 'Video' : 'Photo'} Mode`} onPress={switchMode} />
              <Button
                title={mode === 'photo' ? 'Take Photo' : (isRecording ? 'Stop Recording' : 'Start Recording')}
                onPress={takePhotoOrRecord}
              />
            </>
          )}
        </>
      ) : (
        <Text style={styles.errorText}>Camera not available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});

export default CameraScreen;
