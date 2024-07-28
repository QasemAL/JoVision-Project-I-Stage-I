import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import requestCameraPermission from "./permissions";

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [photo, setPhoto] = useState(null);
  const device = useCameraDevice('back');
  const cameraRef = useRef(null);

  useEffect(() => {
    const getPermission = async () => {
      const granted = await requestCameraPermission();
      setHasPermission(granted);
    };
    getPermission();
  }, []);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const takenPhoto = await cameraRef.current.takePhoto();
      if (takenPhoto) {
        setPhoto(takenPhoto);
      }
    }
  };

  const savePhotoToCameraRoll = async (photoUri) => {
    try {
      await CameraRoll.save(photoUri, { type: 'photo' });
      console.log('Photo saved to camera roll');
      setPhoto(null); // Clear the photo state after saving
    } catch (error) {
      console.error('Error saving photo to camera roll:', error);
    }
  };

  const discardPhoto = () => {
    setPhoto(null);
  };

  return (
    <View style={styles.container}>
      {hasPermission && device ? (
        <>
          {photo ? (
            <>
              <Image source={{ uri: `file://${photo.path}` }} style={styles.preview} />
              <View style={styles.buttonContainer}>
                <Button title="Save" onPress={() => savePhotoToCameraRoll(photo.path)} />
                <Button title="Discard" onPress={discardPhoto} />
              </View>
            </>
          ) : (
            <>
              <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
              />
              <Button title="Take Photo" onPress={takePhoto} />
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
  preview: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'contain',
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
