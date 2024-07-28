import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Camera from "./Camera";
import Screen2 from "./Screen2";
import Screen3 from "./Screen3";
import Screen4 from "./Screen4";

const Tab = createBottomTabNavigator();

const Project = () => {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Screen1" component={Camera} />
          <Tab.Screen name="Screen2" component={Screen2} />
          <Tab.Screen name="Screen3" component={Screen3} />
          <Tab.Screen name="Screen4" component={Screen4} />
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

export default Project;