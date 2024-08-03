import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl, Dimensions } from "react-native";
import Video from 'react-native-video';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { useRoute } from '@react-navigation/native';
import RNFS from "react-native-fs";

const { width, height } = Dimensions.get('window');

const Slideshow = () => {
  const [photos, setPhotos] = useState([]);
  const [index, setIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Track current playback time
  const flatListRef = useRef(null);
  const videoRef = useRef(null);
  const route = useRoute();
  const { media } = route.params; // Get the initial media from navigation params

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    // Scroll to the current index
    if (flatListRef.current && photos.length > 0) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  }, [index, photos]);

  useEffect(() => {
    if (media) {
      // Find the index of the initial media in the photos array
      const initialIndex = photos.findIndex(photo => photo.uri === media.uri);
      if (initialIndex !== -1) {
        setIndex(initialIndex);
      }
    }
  }, [media, photos]);

  const loadPhotos = async () => {
    try {
      const result = await CameraRoll.getPhotos({
        first: 20,
        assetType: "All",
      });

      const updatedPhotos = await Promise.all(
        result.edges.map(async (edge) => {
          const { uri } = edge.node.image;
          const fileInfo = await RNFS.stat(uri);
          const fileExtension = fileInfo.originalFilepath.split('.').pop().toLowerCase();
          const mediaType = fileExtension === 'mp4' || fileExtension === 'mov' ? 'video' : 'image';

          return { ...edge.node.image, mediaType };
        })
      );

      setPhotos(updatedPhotos);
    } catch (error) {
      console.log("Error loading photos: ", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPhotos();
    setRefreshing(false);
  };

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const handlePrevious = () => {
    setIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  const handleForward = () => {
    if (videoRef.current) {
      videoRef.current.seek(currentTime + 5);
    }
  };

  const handleRewind = () => {
    if (videoRef.current) {
      videoRef.current.seek(currentTime - 5);
    }
  };

  const onProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  const renderItem = ({ item }) => {
    const isVideo = item.mediaType === 'video';

    if (isVideo) {
      return (
        <Video
          ref={videoRef}
          source={{ uri: item.uri }}
          style={styles.video}
          controls
          paused={false} // Ensure video is playing
          onEnd={handleNext}
          onProgress={onProgress} // Track playback time
        />
      );
    } else {
      return (
        <Image source={{ uri: item.uri }} style={styles.image} />
      );
    }
  };

  const getItemLayout = (data, index) => ({
    length: height,
    offset: height * index,
    index,
  });

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={photos}
        keyExtractor={(item) => item.uri}
        numColumns={1}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        getItemLayout={getItemLayout}
      />
      <View style={styles.controls}>
        <TouchableOpacity onPress={handlePrevious}>
          <Text style={styles.controlText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.controlText}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRewind}>
          <Text style={styles.controlText}>Rewind 5s</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForward}>
          <Text style={styles.controlText}>Forward 5s</Text>
        </TouchableOpacity>
      </View>
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
    width: width,
    height: height,
    resizeMode: "cover",
  },
  video: {
    width: width,
    height: height,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: '100%',
  },
  controlText: {
    color: "white",
    fontSize: 16,
    padding: 10,
  },
});

export default Slideshow;
