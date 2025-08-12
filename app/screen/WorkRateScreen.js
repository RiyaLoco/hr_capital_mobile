import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, Alert, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";

const API_URL = "http://192.168.100.210:3000";

export default function WorkRateScreen() {
  const [workRates, setWorkRates] = useState([]);

  useEffect(() => {
    const loadWorkRates = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          Alert.alert("Error", "Please log in to access this feature.");
          return;
        }

        const response = await axios.get(
          `${API_URL}/work_rates?userId=${userId}`
        );
        setWorkRates(
          response.data.map((item) => ({
            ...item,
            date: new Date(item.date),
          }))
        );
      } catch (error) {
        Alert.alert("Error", "Failed to load work rates.");
        console.error(error);
      }
    };
    loadWorkRates();
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
    });
  };

  const chartData = {
    labels: workRates.map((item) => formatDate(item.date)),
    datasets: [
      {
        data: workRates.map((item) => item.hoursWorked),
        color: () => "#007bff", // Blue for Hours Worked
        strokeWidth: 2,
      },
      {
        data: workRates.map((item) => item.tasksCompleted),
        color: () => "#28a745", // Green for Tasks Completed
        strokeWidth: 2,
      },
    ],
    legend: ["Hours Worked", "Tasks Completed"],
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Work Rate</Text>
      {workRates.length > 0 ? (
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={Dimensions.get("window").width - 40} // Adjust for padding
            height={300}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No work rate data available</Text>
        </View>
      )}
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
  chartContainer: {
    padding: 20,
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