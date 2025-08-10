import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";

export default function ScheduleCreate({ navigation, route }) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  const handleSave = () => {
    if (!title.trim() || !time.trim()) {
      Alert.alert("Error", "Please enter both title and time");
      return;
    }

    // Pass new schedule back to HomeScreen
    route.params?.addSchedule({ id: Date.now().toString(), title, time });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Time (e.g., 10:00 AM)"
        value={time}
        onChangeText={setTime}
        style={styles.input}
      />
      <Button title="Save Schedule" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
