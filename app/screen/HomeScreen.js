import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Swipeable } from "react-native-gesture-handler";
import { Animated } from "react-native";
const quickActions = [
  { id: 'add', title: "Add Schedule", icon: "➕" },
  { id: 'today', title: "Today's Agenda", icon: "📅" },
  { id: 'important', title: "Important Tasks", icon: "⭐" },
  { id: 'settings', title: "Settings", icon: "⚙️" },
];
const API_URL = "http://192.168.1.6:3000";

const renderRightActions = (progress, dragX, onDelete) => {
  const scale = dragX.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <TouchableOpacity onPress={onDelete} activeOpacity={0.6}>
      <View style={styles.deleteButton}>
        <Animated.Text style={[styles.deleteText, { transform: [{ scale }] }]}>
          Delete
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
};
export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [todaySchedule, setTodaySchedule] = useState([]);
  const addSchedule = (newSchedule) => {
    setTodaySchedule((prev) => [newSchedule, ...prev]);
  };
  const onAddPress = () => {
    navigation.navigate("ScheduleCreate", {
      onSave: handleAddSchedule,
    });
  };
  const handleDelete = (id) => {
    setTodaySchedule((prev) => prev.filter((item) => item.id !== id));
  };
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) return;

        // Fetch user from JSON Server by id
        const response = await axios.get(`${API_URL}/users/${userId}`);
        const user = response.data;

        if (user) {
          setUsername(user.username || user.email || "User");
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };

    loadUserData();
  }, []);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerSection}>
        <Image
          source={require("../../assets/profile.jpg")} // or your dynamic image source
          style={styles.avatarPlaceholder}
        />
        <View>
          <Text style={styles.greeting}>Welcome Back!</Text>
          <Text style={styles.username}>{username}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Access</Text>
      <FlatList
  horizontal
  data={quickActions}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.quickCard}
      onPress={() => {
        if (item.id === 'add') {
          navigation.navigate("ScheduleCreate", { addSchedule });
        } else if (item.id === 'today') {
          // scroll or filter today's schedule or show alert for demo
          alert("Show Today's Agenda");
        } else if (item.id === 'important') {
          alert("Show Important Tasks");
        } else if (item.id === 'settings') {
          navigation.navigate("Settings");
        }
      }}
    >
      <Text style={styles.quickCardIcon}>{item.icon}</Text>
      <Text style={styles.quickCardTitle}>{item.title}</Text>
    </TouchableOpacity>
  )}
  contentContainerStyle={styles.horizontalScroll}
  showsHorizontalScrollIndicator={false}
/>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today Schedule</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("ScheduleCreate", { addSchedule })}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={todaySchedule}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={(progress, dragX) =>
                renderRightActions(progress, dragX, () => handleDelete(item.id))
              }
            >
              <TouchableOpacity style={styles.scheduleCard}>
                <Text style={styles.scheduleTitle}>{item.title}</Text>
                <Text style={styles.scheduleTime}>{item.time}</Text>
              </TouchableOpacity>
            </Swipeable>
          )}
          contentContainerStyle={styles.contentContainer}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 100,
  },
  headerContainer: {
    paddingBottom: 20,
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#ddd",
    marginRight: 15,
  },
  greeting: {
    fontSize: 16,
    color: "#777",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#111",
  },
   quickCard: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    borderRadius: 12,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    width: 120,
  },
  quickCardIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  horizontalScroll: {
    marginBottom: 30,
    // paddingRight: 20,
  },
 
  scheduleCard: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  scheduleTitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  scheduleTime: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "transparent",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  scheduleCard: {
    backgroundColor: "white",
    padding: 16,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
});
