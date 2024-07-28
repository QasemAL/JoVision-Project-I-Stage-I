import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Image, RefreshControl, Button } from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

const Slideshow = () => {
  const [photos, setPhotos] = useState([]);
  const [index, setIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [paused, setPaused] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    let interval;
    if (!paused && photos.length > 0) {
      interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % photos.length);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [paused, photos]);

  useEffect(() => {
    if (!paused && flatListRef.current && photos.length > 0) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  }, [index, paused, photos]);

  const loadPhotos = async () => {
    try {
      const result = await CameraRoll.getPhotos({
        first: 20,
        assetType: "Photos",
      });
      setPhotos(result.edges.map(edge => edge.node.image));
    } catch (error) {
      console.log("Error loading photos: ", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPhotos();
    setRefreshing(false);
  };

  const handlePauseResume = () => {
    setPaused(!paused);
  };

  return (
    <View style={styles.container}>
      <Text>Slideshow</Text>
      <FlatList
        ref={flatListRef}
        data={photos}
        keyExtractor={(item) => item.uri}
        numColumns={1}
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={styles.image} />
        )}
        scrollEnabled={paused} 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Button
        title={paused ? "Resume Slideshow" : "Pause Slideshow"}
        onPress={handlePauseResume}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  image: {
    width: 400,
    height: 800,
    resizeMode: "cover",
  },
  button: {
    marginTop: 20,
  },
});

export default Slideshow;
