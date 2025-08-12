import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";

const API_URL = "http://192.168.100.210:3000";

export default function AttendanceScreen() {
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [timeOffRecords, setTimeOffRecords] = useState([]);
  const [filter, setFilter] = useState("All"); // All | Week | Month
  const [view, setView] = useState("Attendance"); // Attendance | Time Off
  const [timeOffForm, setTimeOffForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const timerRef = useRef(null);

  // Load userId and records on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);

          // Fetch attendance records
          try {
            const attendanceRes = await axios.get(
              `${API_URL}/attendance?userId=${storedUserId}`
            );
            const attendanceData = attendanceRes.data.map((record) => ({
              ...record,
              punchIn: new Date(record.punchIn),
              punchOut: new Date(record.punchOut),
            }));
            setAttendanceRecords(attendanceData);
          } catch (error) {
            if (error.response?.status === 404) {
              setAttendanceRecords([]); // Endpoint exists but no records
            } else {
              throw error;
            }
          }

          // Fetch time-off records
          try {
            const timeOffRes = await axios.get(
              `${API_URL}/timeOffs?userId=${storedUserId}`
            );
            const timeOffData = timeOffRes.data.map((record) => ({
              ...record,
              startDate: new Date(record.startDate),
              endDate: new Date(record.endDate),
            }));
            setTimeOffRecords(timeOffData);
          } catch (error) {
            if (error.response?.status === 404) {
              setTimeOffRecords([]); // Endpoint exists but no records
            } else {
              throw error;
            }
          }
        } else {
          Alert.alert("Error", "Please log in to access this feature.");
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "Failed to load records. Please check server connection."
        );
        console.error(error);
      }
    };
    loadData();
  }, []);

  // Update currentTime every second for active punch-in
  useEffect(() => {
    if (punchInTime && !punchOutTime) {
      timerRef.current = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [punchInTime, punchOutTime]);

  const handlePunchIn = async () => {
    if (!punchInTime && userId) {
      const now = new Date();
      setPunchInTime(now);
      setPunchOutTime(null);
      setCurrentTime(now);
    } else if (!userId) {
      Alert.alert("Error", "Please log in to punch in.");
    }
  };

  const handlePunchOut = async () => {
    if (punchInTime && !punchOutTime && userId) {
      const now = new Date();
      setPunchOutTime(now);

      const durationMs = now - punchInTime;

      const newRecord = {
        id: Date.now().toString(),
        date: punchInTime.toDateString(),
        punchIn: punchInTime.toISOString(),
        punchOut: now.toISOString(),
        durationMs,
      };

      try {
        await axios.post(`${API_URL}/attendance`, newRecord, {
          headers: { "x-user-id": userId },
        });
        setAttendanceRecords((prev) => [
          {
            ...newRecord,
            punchIn: new Date(newRecord.punchIn),
            punchOut: new Date(newRecord.punchOut),
          },
          ...prev,
        ]);
        setPunchInTime(null);
        setPunchOutTime(null);
        setCurrentTime(now);
      } catch (error) {
        Alert.alert(
          "Error",
          error.response?.data?.error || "Failed to save attendance record."
        );
        console.error(error);
      }
    } else if (!userId) {
      Alert.alert("Error", "Please log in to punch out.");
    }
  };

  const handleTimeOffSubmit = async () => {
    const { startDate, endDate, reason } = timeOffForm;
    if (!startDate || !endDate || !reason) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      Alert.alert("Error", "End date must be after start date.");
      return;
    }

    const newTimeOff = {
      id: Date.now().toString(),
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      reason,
      status: "Pending",
    };

    try {
      await axios.post(`${API_URL}/timeOffs`, newTimeOff, {
        headers: { "x-user-id": userId },
      });
      setTimeOffRecords((prev) => [
        {
          ...newTimeOff,
          startDate: new Date(newTimeOff.startDate),
          endDate: new Date(newTimeOff.endDate),
        },
        ...prev,
      ]);
      setTimeOffForm({ startDate: "", endDate: "", reason: "" });
      setShowForm(false);
      Alert.alert("Success", "Time-off request submitted.");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to save time-off request."
      );
      console.error(error);
    }
  };

  // Handle date picker changes
  const handleDateChange = (event, selectedDate, field) => {
    if (Platform.OS === "android") {
      setShowStartDatePicker(false);
      setShowEndDatePicker(false);
    }
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
      setTimeOffForm({ ...timeOffForm, [field]: formattedDate });
    }
  };

  // Filter records based on selected filter
  const filterRecords = (records, dateField) => {
    return records.filter((record) => {
      const now = new Date();
      const recordDate = new Date(record[dateField]);
      if (filter === "All") return true;
      if (filter === "Week") {
        const diffTime = now - recordDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      }
      if (filter === "Month") {
        return (
          recordDate.getMonth() === now.getMonth() &&
          recordDate.getFullYear() === now.getFullYear()
        );
      }
      return true;
    });
  };

  const filteredAttendanceRecords = filterRecords(attendanceRecords, "punchIn");
  const filteredTimeOffRecords = filterRecords(timeOffRecords, "startDate");

  const formatTime = (date) => {
    if (!date) return "--:-- --";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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

  const formatDuration = (ms) => {
    if (!ms) return "0 hrs 0 mins";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours} hrs ${minutes} mins`;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.screenContainer}>
        <Text style={styles.header}>Attendance</Text>

        <View style={styles.tabRow}>
          {["Attendance", "Time Off"].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setView(tab)}>
              <Text style={view === tab ? styles.tabActive : styles.tab}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {view === "Attendance" ? (
          <>
            <View style={styles.punchContainer}>
              <TouchableOpacity
                style={[
                  styles.punchInBox,
                  punchInTime ? { backgroundColor: "#0056b3" } : null,
                ]}
                onPress={handlePunchIn}
                disabled={!!punchInTime || !userId}
              >
                <Text style={styles.punchInTitle}>Punch In</Text>
                <Text style={styles.punchInTime}>
                  {formatTime(punchInTime)}
                </Text>
                <Text style={styles.punchInDate}>
                  {formatDate(punchInTime)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.punchOutBox,
                  punchOutTime ? { backgroundColor: "#d3d3d3" } : null,
                  !punchInTime && { opacity: 0.5 },
                ]}
                onPress={handlePunchOut}
                disabled={!punchInTime || !!punchOutTime || !userId}
              >
                <Text style={styles.punchOutTitle}>Punch Out</Text>
                <Text style={styles.punchOutTime}>
                  {punchInTime && !punchOutTime
                    ? formatTime(currentTime)
                    : formatTime(punchOutTime)}
                </Text>
                <Text style={styles.punchOutDate}>
                  {punchInTime && !punchOutTime
                    ? formatDate(currentTime)
                    : formatDate(punchOutTime)}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filterRow}>
              {["All", "Week", "Month"].map((tab) => (
                <TouchableOpacity key={tab} onPress={() => setFilter(tab)}>
                  <Text style={filter === tab ? styles.tabActive : styles.tab}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {filteredAttendanceRecords.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No attendance records yet</Text>
              </View>
            ) : (
              filteredAttendanceRecords.map((record) => (
                <View key={record.id} style={styles.attendanceCard}>
                  <Text style={styles.date}>{formatDate(record.punchIn)}</Text>
                  <Text style={styles.time}>
                    {formatTime(record.punchIn)} - {formatTime(record.punchOut)}
                  </Text>
                  <Text style={styles.duration}>
                    Working - {formatDuration(record.durationMs)}
                  </Text>
                </View>
              ))
            )}
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.requestButton}
              onPress={() => setShowForm(!showForm)}
              disabled={!userId}
            >
              <Text style={styles.requestButtonText}>
                {showForm ? "Cancel" : "Request Time Off"}
              </Text>
            </TouchableOpacity>

            {showForm && (
              <View style={styles.formContainer}>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text style={styles.inputText}>
                    {timeOffForm.startDate || "Select Start Date (YYYY-MM-DD)"}
                  </Text>
                </TouchableOpacity>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={
                      timeOffForm.startDate
                        ? new Date(timeOffForm.startDate)
                        : new Date()
                    }
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    onChange={(event, selectedDate) =>
                      handleDateChange(event, selectedDate, "startDate")
                    }
                  />
                )}

                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Text style={styles.inputText}>
                    {timeOffForm.endDate || "Select End Date (YYYY-MM-DD)"}
                  </Text>
                </TouchableOpacity>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={
                      timeOffForm.endDate
                        ? new Date(timeOffForm.endDate)
                        : new Date()
                    }
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    onChange={(event, selectedDate) =>
                      handleDateChange(event, selectedDate, "endDate")
                    }
                  />
                )}

                <TextInput
                  style={[styles.input, { height: 80 }]}
                  placeholder="Reason"
                  value={timeOffForm.reason}
                  onChangeText={(text) =>
                    setTimeOffForm({ ...timeOffForm, reason: text })
                  }
                  multiline
                />
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleTimeOffSubmit}
                >
                  <Text style={styles.submitButtonText}>Submit Request</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.filterRow}>
              {["All", "Week", "Month"].map((tab) => (
                <TouchableOpacity key={tab} onPress={() => setFilter(tab)}>
                  <Text style={filter === tab ? styles.tabActive : styles.tab}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {filteredTimeOffRecords.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No time-off records yet</Text>
              </View>
            ) : (
              filteredTimeOffRecords.map((record) => (
                <View key={record.id} style={styles.attendanceCard}>
                  <Text style={styles.date}>
                    {formatDate(record.startDate)} -{" "}
                    {formatDate(record.endDate)}
                  </Text>
                  <Text style={styles.time}>Reason: {record.reason}</Text>
                  <Text style={styles.duration}>Status: {record.status}</Text>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: { padding: 20 },
  header: { fontSize: 28, fontWeight: "700", marginBottom: 20,color: "#1E3A8A", },
  punchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  punchInBox: {
    backgroundColor: "#26469eff",
    padding: 16,
    borderRadius: 10,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  punchOutBox: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 10,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  punchInTitle: { fontSize: 16, fontWeight: "600", color: "#fff" },
  punchInTime: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  punchInDate: { fontSize: 14, color: "#fff" },
  punchOutTitle: { fontSize: 16, fontWeight: "600", color: "gray" },
  punchOutTime: { fontSize: 22, fontWeight: "bold", color: "gray" },
  punchOutDate: { fontSize: 14, color: "gray" },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  tab: { color: "gray", fontSize: 16 },
  tabActive: {
    color: "#1E3A8A",
    fontSize: 16,
    borderBottomWidth: 2,
    borderColor: "#1E3A8A",
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
  requestButton: {
    backgroundColor: "#1E3A8A",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  requestButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
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
  submitButton: {
    backgroundColor: "#1E3A8A",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
