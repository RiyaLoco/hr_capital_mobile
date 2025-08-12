import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://192.168.100.210:3000";

export default function SalaryScreen() {
  const [salaries, setSalaries] = useState([]);

  useEffect(() => {
    const loadSalaries = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          Alert.alert("Error", "Please log in to access this feature.");
          return;
        }

        const response = await axios.get(
          `${API_URL}/salaries?userId=${userId}`
        );
        setSalaries(
          response.data.map((item) => ({
            ...item,
            date: new Date(item.date),
          }))
        );
      } catch (error) {
        Alert.alert("Error", "Failed to load salary history.");
        console.error(error);
      }
    };
    loadSalaries();
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Salary History</Text>
      <FlatList
        data={salaries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.salaryCard}>
            <Text style={styles.salaryAmount}>${item.amount}</Text>
            <Text style={styles.salaryDate}>{formatDate(item.date)}</Text>
            <Text style={styles.salaryDescription}>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No salary records yet</Text>
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
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  salaryCard: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  salaryAmount: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  salaryDate: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  salaryDescription: {
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
