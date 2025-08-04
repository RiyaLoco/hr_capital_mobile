import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

export default function EmployeeScreen() {
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.screenContainer}>
        <Text style={styles.header}>Employee</Text>
        <View style={styles.employeeSummaryRow}>
          <View style={[styles.summaryBox, { backgroundColor: "#00C851" }]}>
            <Text style={styles.summaryNumber}>10</Text>
            <Text style={styles.summaryLabel}>Total Employee</Text>
          </View>
          <View style={[styles.summaryBox, { backgroundColor: "#ff4444" }]}>
            <Text style={styles.summaryNumber}>10</Text>
            <Text style={styles.summaryLabel}>Total Department</Text>
          </View>
        </View>
        <View style={styles.cardGrid}>
          <View style={styles.employeeCard}>
            <Text style={styles.employeeName}>Ret Vatthanak</Text>
            <Text style={styles.employeeRole}>IT</Text>
          </View>
          <View style={styles.employeeCard}>
            <Text style={styles.employeeName}>Khiev Sovan</Text>
            <Text style={styles.employeeRole}>Graphic Designer</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screenContainer: { padding: 20 },
  title: { fontSize: 20, fontWeight: "600" },
  subtitle: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
  header: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
  cardGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    width: "45%",
    height: 100,
    backgroundColor: "#eee",
    borderRadius: 12,
  },
  sectionTitle: { fontSize: 20, marginTop: 30, marginBottom: 10 },
  largeCard: { height: 160, backgroundColor: "#eee", borderRadius: 12 },
  punchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  punchInBox: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 10,
    flex: 1,
    marginRight: 8,
  },
  punchOutBox: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 10,
    flex: 1,
    marginLeft: 8,
  },
  punchTitle: { fontSize: 16, fontWeight: "600", color: "#fff" },
  punchTime: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  punchDate: { fontSize: 14, color: "#fff" },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  tab: { color: "gray", fontSize: 16 },
  tabActive: {
    color: "#007bff",
    fontSize: 16,
    borderBottomWidth: 2,
    borderColor: "#007bff",
  },
  attendanceCard: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 10,
  },
  date: { fontWeight: "600" },
  time: { color: "#333" },
  duration: { color: "gray" },
  employeeSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  summaryBox: { flex: 1, padding: 16, borderRadius: 12, marginHorizontal: 5 },
  summaryNumber: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  summaryLabel: { color: "#fff" },
  employeeCard: {
    width: "45%",
    padding: 20,
    backgroundColor: "#eee",
    borderRadius: 12,
    alignItems: "center",
  },
  employeeName: { fontWeight: "bold", fontSize: 16 },
  employeeRole: { color: "gray" },
});
