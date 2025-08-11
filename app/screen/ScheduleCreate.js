import React, { useState } from "react";
import { View, TextInput, Platform, TouchableOpacity, Text, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

export default function ScheduleCreate({ navigation, route }) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !time) {
      Alert.alert("Error", "Please enter both title and time");
      return;
    }

    const newSchedule = {
      id: Date.now().toString(),
      title,
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    try {
      // Load existing schedules from AsyncStorage
      const storedSchedules = await AsyncStorage.getItem('schedules');
      const schedules = storedSchedules ? JSON.parse(storedSchedules) : [];
      
      // Add new schedule to the array
      schedules.push(newSchedule);
      
      // Save updated schedules back to AsyncStorage
      await AsyncStorage.setItem('schedules', JSON.stringify(schedules));
      
      // Pass the new schedule to the parent component
      route.params?.addSchedule(newSchedule);
      
      // Navigate back
      navigation.goBack();
    } catch (error) {
      console.error('Error saving schedule:', error);
      Alert.alert("Error", "Failed to save schedule. Please try again.");
    }
  };

  const onChange = (event, selectedTime) => {
    setShowPicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create New Schedule</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Title</Text>
        <TextInput
          placeholder="Enter schedule title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Time</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.timeButtonText}>
            {time
              ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "Select Time"}
          </Text>
          <Ionicons name="time-outline" size={24} color="#333" />
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={false}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChange}
            style={styles.datePicker}
          />
        )}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Schedule</Text>
      </TouchableOpacity>
    </View>
  );
}

// Sample function to load schedules (implement in parent component or global state)
const loadSchedules = async () => {
  try {
    const storedSchedules = await AsyncStorage.getItem('schedules');
    return storedSchedules ? JSON.parse(storedSchedules) : [];
  } catch (error) {
    console.error('Error loading schedules:', error);
    return [];
  }
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeButtonText: {
    fontSize: 16,
    color: '#333',
  },
  datePicker: {
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
};