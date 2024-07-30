import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';

import car from './Assets/car.png';
import walkingperson from './Assets/personwalking.jpg';
import sittingperson from './Assets/personsitting.png';

export default function SensorsScreen() {
  const [location, setLocation] = useState(null);
  const [accelerometerData, setAccelerometerData] = useState(null);
  const [orientationText, setOrientationText] = useState('Portrait'); // Default orientation

  const updateLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, altitude, speed } = position.coords;
        setLocation({ latitude, longitude, altitude, speed });
      },
      (error) => console.error(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 500);

    const accelerometerSubscription = accelerometer.subscribe(({ x, y, z }) => {
      setAccelerometerData({ x, y, z });
      determineOrientation({ x, y, z }); // Call determineOrientation
    });

    const locationInterval = setInterval(updateLocation, 10000);

    return () => {
      clearInterval(locationInterval);
      accelerometerSubscription.unsubscribe();
    };
  }, []);

  const determineOrientation = ({ x, y, z }) => {
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    const absZ = Math.abs(z);

    if (absX > absY && absX > absZ) {
      if (x > 0) {
        setOrientationText('Landscape Left');
      } else {
        setOrientationText('Landscape Right');
      }
    } else if (absY > absX && absY > absZ) {
      if (y > 0) {
        setOrientationText('Portrait Upside Down');
      } else {
        setOrientationText('Portrait');
      }
    }
  };

  const getSpeedImage = () => {
    if (location) {
      if (location.speed > 20) {
        return car;
      } else if (location.speed > 5) {
        return walkingperson;
      } else {
        return sittingperson;
      }
    }
    return null;
  };

  const getOrientationOverlayStyle = () => {
    switch (orientationText) {
      case 'Portrait':
        return { backgroundColor: 'rgba(0,0,0,0.5)' };
      case 'Landscape Left':
        return { backgroundColor: 'rgba(0,0,255,0.5)' };
      case 'Landscape Right':
        return { backgroundColor: 'rgba(0,255,0,0.5)' };
      case 'Portrait Upside Down':
        return { backgroundColor: 'rgba(255,0,0,0.5)' };
      default:
        return { backgroundColor: 'rgba(128,128,128,0.5)' };
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.text}>Sensors</Text>

        <Text style={styles.text}>Location Details</Text>
        {location ? (
          <View style={styles.dataContainer}>
            <Text>Latitude: {location.latitude}</Text>
            <Text>Longitude: {location.longitude}</Text>
            <Text>Altitude: {location.altitude}</Text>
            <Text>Speed: {location.speed}</Text>
          </View>
        ) : (
          <Text>Loading location...</Text>
        )}

        <Image source={getSpeedImage()} style={styles.image} />

        <Text style={styles.text}>Accelerometer Data</Text>
        {accelerometerData ? (
          <View style={styles.dataContainer}>
            <Text>X: {accelerometerData.x.toFixed(2)}</Text>
            <Text>Y: {accelerometerData.y.toFixed(2)}</Text>
            <Text>Z: {accelerometerData.z.toFixed(2)}</Text>
          </View>
        ) : (
          <Text>Loading accelerometer data...</Text>
        )}

        <View style={[styles.orientationContainer, getOrientationOverlayStyle()]}>
          <Text style={styles.orientationText}>Orientation: {orientationText}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dataContainer: {
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  orientationContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  orientationText: {
    fontSize: 16,
    color: '#fff',
  },
});
