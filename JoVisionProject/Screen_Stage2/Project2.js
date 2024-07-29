import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CameraScreen from "./CameraS/Camera";
import sensors from "./SensorS/sensors";
import Gallary from "./Gallary";
import Slideshow from "./Slideshow";

const Tab = createBottomTabNavigator();

const Project2 = () => {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Screen1" component={CameraScreen} />
          <Tab.Screen name="Screen2" component={sensors} />
          <Tab.Screen name="Screen3" component={Gallary} />
          <Tab.Screen name="Screen4" component={Slideshow} />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,width:'100%',
  },
});

export default Project2;