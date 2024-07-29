import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';

export default function SensorsScreen() {
  const [location, setLocation] = useState(null);
  const [accelerometerData, setAccelerometerData] = useState(null);

  // Get device location every 10 seconds
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
    // Set update interval for accelerometer
    setUpdateIntervalForType(SensorTypes.accelerometer, 500); // 500ms

    const accelerometerSubscription = accelerometer.subscribe(({ x, y, z }) => {
      setAccelerometerData({ x, y, z });
    });

    // Update location every 10 seconds
    const locationInterval = setInterval(updateLocation, 10000);

    // Clean up subscriptions and intervals
    return () => {
      clearInterval(locationInterval);
      accelerometerSubscription.unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
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
  orientationText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
