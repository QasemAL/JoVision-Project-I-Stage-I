import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import requestCameraPermission from "./permissions";

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
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
      const photo = await cameraRef.current.takePhoto();
      if (photo) {
        savePhotoToCameraRoll(photo.path);
      }
    }
  };

  const savePhotoToCameraRoll = async (photoUri) => {
    try {
      await CameraRoll.saveAsset(photoUri, { type: 'photo' });
      console.log('Photo saved to camera roll');
    } catch (error) {
      console.error('Error saving photo to camera roll:', error);
    }
  };

  return (
    <View style={styles.container}>
      {hasPermission && device ? (
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo={true}
        />
      ) : (
        <Text style={styles.errorText}>Camera not available</Text>
      )}
      <Button title="Take Photo" onPress={takePhoto} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
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