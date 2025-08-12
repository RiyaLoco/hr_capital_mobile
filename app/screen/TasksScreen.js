import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";

const API_URL = "http://192.168.100.210:3000";

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", dueDate: "" });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          Alert.alert("Error", "Please log in to access this feature.");
          return;
        }

        const response = await axios.get(`${API_URL}/tasks?userId=${userId}`);
        setTasks(
          response.data.map((item) => ({
            ...item,
            dueDate: new Date(item.dueDate),
          }))
        );
      } catch (error) {
        Alert.alert("Error", "Failed to load tasks.");
        console.error(error);
      }
    };
    loadTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.dueDate) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const userId = await AsyncStorage.getItem("userId");
      const task = {
        id: Date.now().toString(),
        userId,
        title: newTask.title,
        status: "pending",
        dueDate: new Date(newTask.dueDate).toISOString(),
      };

      await axios.post(`${API_URL}/tasks`, task, {
        headers: { "x-user-id": userId },
      });
      setTasks((prev) => [
        ...prev,
        { ...task, dueDate: new Date(task.dueDate) },
      ]);
      setNewTask({ title: "", dueDate: "" });
      Alert.alert("Success", "Task added.");
    } catch (error) {
      Alert.alert("Error", "Failed to add task.");
      console.error(error);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const newStatus = currentStatus === "pending" ? "completed" : "pending";
      await axios.patch(
        `${API_URL}/tasks/${id}`,
        { status: newStatus },
        { headers: { "x-user-id": userId } }
      );
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update task status.");
      console.error(error);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Task Title"
          value={newTask.title}
          onChangeText={(text) => setNewTask({ ...newTask, title: text })}
        />
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.inputText}>
            {newTask.dueDate
              ? formatDate(new Date(newTask.dueDate))
              : "Select Due Date"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={newTask.dueDate ? new Date(newTask.dueDate) : new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setNewTask({
                  ...newTask,
                  dueDate: selectedDate.toISOString().split("T")[0],
                });
              }
            }}
          />
        )}
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.taskCard}
            onPress={() => handleToggleStatus(item.id, item.status)}
          >
            <Text
              style={[
                styles.taskTitle,
                item.status === "completed" && styles.taskCompleted,
              ]}
            >
              {item.title}
            </Text>
            <Text style={styles.taskDueDate}>
              Due: {formatDate(item.dueDate)}
            </Text>
            <Text style={styles.taskStatus}>Status: {item.status}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks yet</Text>
          </View>
        }
        contentContainerStyle={styles.contentContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E3A8A",
    padding: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    borderColor: "#d3d3d3",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    justifyContent: "center",
  },
  inputText: {
    fontSize: 16,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  taskCard: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  taskCompleted: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  taskDueDate: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  taskStatus: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "gray",
    fontWeight: "600",
  },
});
