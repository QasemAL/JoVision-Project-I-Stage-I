import React from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CameraScreen from "./CameraS/Camera";
import Sensors from "./SensorS/sensors";
import Gallary from "./Gallary";
import FullScreenView from "./Slideshow";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Screen1" component={CameraScreen} />
    <Tab.Screen name="Screen2" component={Sensors} />
    <Tab.Screen name="Screen3" component={Gallary} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="Screen4" component={FullScreenView} />
  </Stack.Navigator>
);

const Project = () => {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

export default Project;
