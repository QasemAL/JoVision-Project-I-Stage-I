import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, RefreshControl } from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

const Gallary = () => {
  const [photos, setPhotos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const result = await CameraRoll.getPhotos({
        first: 20, // Number of photos to load
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

  return (
    <View style={styles.container}>
      <Text>Gallery</Text>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.uri}
        numColumns={3}
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={styles.image} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
    width: 100,
    height: 100,
    margin: 5,
  },
});

export default Gallary;
