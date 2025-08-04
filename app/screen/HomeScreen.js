import React from "react";
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

const todaySchedule = [
  { id: "1", title: "Team Meeting", time: "10:00 AM" },
  { id: "2", title: "Interview with Candidate", time: "1:00 PM" },
  { id: "3", title: "Project Planning", time: "3:00 PM" },
];

const quickActions = [1, 2, 3, 4];

export default function HomeScreen() {
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerSection}>
        <View style={styles.avatarPlaceholder} />
        <View>
          <Text style={styles.greeting}>Welcome Back!</Text>
          <Text style={styles.username}>Vatthanak</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Access</Text>
      <FlatList
        horizontal
        data={quickActions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <View style={styles.quickCard} />}
        contentContainerStyle={styles.horizontalScroll}
        showsHorizontalScrollIndicator={false}
      />

      <Text style={styles.sectionTitle}>Today Schedule</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={todaySchedule}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.scheduleCard}>
            <Text style={styles.scheduleTitle}>{item.title}</Text>
            <Text style={styles.scheduleTime}>{item.time}</Text>
          </TouchableOpacity>
        )}
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
  horizontalScroll: {
    marginBottom: 30,
    // paddingRight: 20,
  },
  quickCard: {
    width: 165,
    height: 130,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginRight: 16,
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
});