import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
// import * as ImagePicker from "expo-image-picker";

const API_URL = "http://192.168.100.210:3000";

export default function ProfileScreen({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
          const response = await axios.get(`${API_URL}/users/${storedUserId}`);
          const user = response.data;
          setUsername(user.username || "");
          setEmail(user.email || "");
          setProfilePicture(user.profilePicture || null);
        } else {
          Alert.alert("Error", "Please log in to access this feature.");
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load user data.");
        console.error(error);
      }
    };
    loadUserData();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Error", "Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setProfilePicture(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSave = async () => {
    if (!password && !profilePicture) {
      Alert.alert("Error", "Please provide a new password or profile picture.");
      return;
    }

    try {
      const updateData = {};
      if (password) updateData.password = password;
      if (profilePicture) updateData.profilePicture = profilePicture;

      await axios.patch(`${API_URL}/users/${userId}`, updateData, {
        headers: { "x-user-id": userId },
      });
      Alert.alert("Success", "Profile updated successfully.");
      setPassword("");
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to update profile."
      );
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={pickImage}>
          {profilePicture ? (
            <Image
              source={{ uri: profilePicture }}
              style={styles.profilePicture}
            />
          ) : (
            <Image
              source={require("../../assets/profile.jpg")}
              style={styles.profilePicture}
            />
          )}
          <Text style={styles.changePictureText}>Change Picture</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          editable={false}
          placeholder="Username"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          editable={false}
          placeholder="Email"
        />

        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter new password"
          secureTextEntry
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  profileContainer: {
    alignItems: "center",
    margin:15
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  changePictureText: {
    color: "#1E3A8A",
    fontSize: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E3A8A",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    borderColor: "#d3d3d3",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#1E3A8A",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
