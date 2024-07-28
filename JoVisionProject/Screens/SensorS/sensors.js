import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Geolocation from '@react-native-community/geolocation';
import { requestLocationPermission } from './locationPermissions';

const Sensors = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      const permissionGranted = await requestLocationPermission();
      if (permissionGranted) {
        Geolocation.getCurrentPosition(
          (position) => {
            setLocation(position.coords);
          },
          (error) => {
            console.log(error);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      }
    };

    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text>sensors</Text>
      {location ? (
        <View>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
        </View>
      ) : (
        <Text>Fetching location...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Sensors;
