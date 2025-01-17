import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, RefreshControl, TouchableOpacity, Alert, TextInput } from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import RNFS from "react-native-fs";
import { useNavigation } from '@react-navigation/native';

const Gallary = () => {
  const [photos, setPhotos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newName, setNewName] = useState("");

  const navigation = useNavigation(); // Access navigation prop

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const result = await CameraRoll.getPhotos({
        first: 20,
        assetType: "All",
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

  const handleRename = async () => {
    if (!newName) {
      Alert.alert("Error", "Please enter a new name.");
      return;
    }

    const { uri } = selectedItem;
    const fileInfo = await RNFS.stat(uri);
    const fileExtension = fileInfo.originalFilepath.split('.').pop();
    const newUri = `${RNFS.PicturesDirectoryPath}/${newName}.${fileExtension}`;
    
    try {
       await RNFS.moveFile(fileInfo.originalFilepath, newUri);
       await loadPhotos();
       setSelectedItem(null);
       setNewName("");
    } catch (error) {
      console.log("Error renaming file: ", error);
    }
  };

  const handleDelete = async () => {
    const { uri } = selectedItem;
    const fileInfo = await RNFS.stat(uri);
    
    try {
      await RNFS.unlink(fileInfo.originalFilepath);
      await loadPhotos();
      setSelectedItem(null);
    } catch (error) {
      console.log("Error deleting file: ", error);
    }
  };

  const handleFullScreen = async () => {
    if (selectedItem) {
      const { uri } = selectedItem;
  
      try {
        const fileInfo = await RNFS.stat(uri);
        console.log("fileInfo:", fileInfo);
  
        // Extract the file extension from the URI
        const fileExtension = fileInfo.originalFilepath.split('.').pop().toLowerCase();
        console.log("fileExtension:", fileExtension);
  
        // Validate the extension and assign the type
        const mediaType = fileExtension === 'mp4' || fileExtension === 'mov' ? 'video' : 'image';
        console.log("mediaType:", mediaType);
  
        // Navigate to Screen4 with the media and its type
        navigation.navigate('Screen4', {
          media: {
            uri: selectedItem.uri, // URI of the media
            type: mediaType, // Type of media: 'image' or 'video'
          }
        });
      } catch (error) {
        console.error('Failed to get file info:', error);
      }
    }
  };
  

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedItem(item)}>
      <Image source={{ uri: item.uri }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery</Text>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.uri}
        numColumns={3}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {selectedItem && (
        <View style={styles.actions}>
          <TextInput
            style={styles.input}
            placeholder="Enter new name"
            value={newName}
            onChangeText={setNewName}
          />
          <TouchableOpacity style={styles.button} onPress={handleRename}>
            <Text style={styles.buttonText}>Rename</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleFullScreen}>
            <Text style={styles.buttonText}>Full Screen</Text>
          </TouchableOpacity>
        </View>
      )}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  actions: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "80%",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Gallary;