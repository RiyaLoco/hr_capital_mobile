import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Swipeable } from "react-native-gesture-handler";
import { Animated } from "react-native";

const API_URL = "http://192.168.100.210:3000";

const quickActions = [
  { id: "salary", title: "View Salary", icon: "💰", screen: "Salary" },
  { id: "task", title: "My Tasks", icon: "📋", screen: "Tasks" },
  { id: "work_rate", title: "Work Rate", icon: "📈", screen: "WorkRate" },
  { id: "team", title: "Team", icon: "👥", screen: "Team" },
];

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
  const [recentActivity, setRecentActivity] = useState([]);
  const [activityFilter, setActivityFilter] = useState("All");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          Alert.alert("Error", "Please log in to access this feature.");
          return;
        }

        const userResponse = await axios.get(`${API_URL}/users/${userId}`);
        const user = userResponse.data;
        if (user) {
          setUsername(user.username || user.email || "User");
        }

        // Fetch recent activity
        try {
          const attendanceRes = await axios.get(
            `${API_URL}/attendance?userId=${userId}`
          );
          const timeOffRes = await axios.get(
            `${API_URL}/timeOffs?userId=${userId}`
          );

          console.log("Attendance data:", attendanceRes.data);
          console.log("TimeOff data:", timeOffRes.data);

          const attendanceData = attendanceRes.data.map((record) => ({
            ...record,
            type: "attendance",
            date: new Date(record.punchIn),
          }));
          const timeOffData = timeOffRes.data.map((record) => ({
            ...record,
            type: "timeOff",
            date: new Date(record.startDate),
          }));

          const combinedData = [...attendanceData, ...timeOffData].sort(
            (a, b) => b.date - a.date
          );
          console.log("Combined data:", combinedData);
          setRecentActivity(combinedData.slice(0, 10));
        } catch (error) {
          console.error("Error fetching activity:", error);
          if (error.response?.status === 404) {
            setRecentActivity([]);
          } else {
            Alert.alert(
              "Error",
              "Failed to load recent activity. Please check server connection."
            );
          }
        }
      } catch (err) {
        console.error("Error loading user:", err);
        Alert.alert("Error", "Failed to load user data.");
      }
    };

    loadUserData();
  }, []);

  const handleDelete = async (id, type) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      await axios.delete(`${API_URL}/${type}s/${id}`, {
        headers: { "x-user-id": userId },
      });
      setRecentActivity((prev) => prev.filter((item) => item.id !== id));
      Alert.alert("Success", "Record deleted.");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to delete record."
      );
      console.error(error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-- -- ----";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "--:-- --";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const filterActivity = (records) => {
    if (activityFilter === "All") return records;
    const filtered = records.filter((record) => {
      const matches =
        record.type.toLowerCase() === activityFilter.toLowerCase();
      console.log(
        `Filtering ${record.id}: type=${record.type}, filter=${activityFilter}, matches=${matches}`
      );
      return matches;
    });
    console.log(
      `Filtered records for ${activityFilter}: ${JSON.stringify(filtered)}`
    );
    return filtered;
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerSection}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          style={styles.avatarContainer}
        >
          <Image
            source={require("../../assets/profile.jpg")}
            style={styles.avatarPlaceholder}
          />
        </TouchableOpacity>
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
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.quickCardIcon}>{item.icon}</Text>
            <Text style={styles.quickCardTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.horizontalScroll}
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.filterRow}>
          {["All", "Attendance", "TimeOff"].map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActivityFilter(filter)}
              style={
                activityFilter === filter ? styles.filterActive : styles.filter
              }
            >
              <Text
                style={
                  activityFilter === filter
                    ? styles.filterTextActive
                    : styles.filterText
                }
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={filterActivity(recentActivity)}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={(progress, dragX) =>
                renderRightActions(progress, dragX, () =>
                  handleDelete(item.id, item.type)
                )
              }
            >
              <View style={styles.activityCard}>
                {item.type === "attendance" ? (
                  <>
                    <Text style={styles.activityTitle}>
                      Attendance - {formatDate(item.punchIn)}
                    </Text>
                    <Text style={styles.activityDetails}>
                      {formatTime(item.punchIn)} - {formatTime(item.punchOut)}
                    </Text>
                    <Text style={styles.activityStatus}>
                      Duration:{" "}
                      {item.durationMs
                        ? `${Math.floor(
                            item.durationMs / 3600000
                          )} hrs ${Math.floor(
                            (item.durationMs % 3600000) / 60000
                          )} mins`
                        : "N/A"}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.activityTitle}>
                      Time Off - {formatDate(item.startDate)}
                    </Text>
                    <Text style={styles.activityDetails}>
                      {formatDate(item.startDate)} to {formatDate(item.endDate)}
                    </Text>
                    <Text style={styles.activityDetails}>
                      Reason: {item.reason}
                    </Text>
                    <Text
                      style={[
                        styles.activityStatus,
                        {
                          color:
                            item.status === "Approved"
                              ? "green"
                              : item.status === "Pending"
                              ? "orange"
                              : "red",
                        },
                      ]}
                    >
                      Status: {item.status}
                    </Text>
                  </>
                )}
              </View>
            </Swipeable>
          )}
          contentContainerStyle={styles.contentContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No recent activity</Text>
            </View>
          }
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
  avatarContainer: {
    marginRight: 15,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ddd",
  },
  greeting: {
    fontSize: 16,
    color: "#777",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#1E3A8A",
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
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  filter: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  filterActive: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 2,
    borderColor: "#1E3A8A",
  },
  filterText: {
    fontSize: 14,
    color: "gray",
  },
  filterTextActive: {
    fontSize: 14,
    color: "#1E3A8A",
    fontWeight: "600",
  },
  activityCard: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  activityDetails: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  activityStatus: {
    fontSize: 13,
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "85%",
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
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
