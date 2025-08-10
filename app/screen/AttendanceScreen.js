import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@attendance_records";

export default function AttendanceScreen() {
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filter, setFilter] = useState("All"); // All | Week | Month

  const timerRef = useRef(null);

  // Load stored attendance records on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) {
        setAttendanceRecords(JSON.parse(data));
      }
    });
  }, []);

  // Save attendance records to AsyncStorage whenever changed
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  // Update currentTime every second only if punch in active but punch out not yet
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

  const handlePunchIn = () => {
    if (!punchInTime) {
      const now = new Date();
      setPunchInTime(now);
      setPunchOutTime(null);
      setCurrentTime(now);
    }
  };

  const handlePunchOut = () => {
    if (punchInTime && !punchOutTime) {
      const now = new Date();
      setPunchOutTime(now);

      const durationMs = now - punchInTime;

      const newRecord = {
        id: Date.now().toString(),
        date: punchInTime.toDateString(),
        punchIn: punchInTime,
        punchOut: now,
        durationMs,
      };

      setAttendanceRecords((prev) => [newRecord, ...prev]);
      setPunchInTime(null);
      setPunchOutTime(null);
      setCurrentTime(now);
    }
  };

  // Filters the attendanceRecords array based on selected filter
  const filteredRecords = attendanceRecords.filter((record) => {
    const now = new Date();
    const punchInDate = new Date(record.punchIn);
    if (filter === "All") return true;

    if (filter === "Week") {
      // Check if record is within the last 7 days
      const diffTime = now - punchInDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    }

    if (filter === "Month") {
      // Check if record is in current month and year
      return (
        punchInDate.getMonth() === now.getMonth() &&
        punchInDate.getFullYear() === now.getFullYear()
      );
    }

    return true;
  });

  // Formatting functions same as before
  const formatTime = (date) => {
    if (!date) return "--:-- --";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date) => {
    if (!date) return "-- -- ----";
    return date.toLocaleDateString([], {
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

        <View style={styles.punchContainer}>
          <TouchableOpacity
            style={[
              styles.punchInBox,
              punchInTime ? { backgroundColor: "#0056b3" } : null,
            ]}
            onPress={handlePunchIn}
            disabled={!!punchInTime}
          >
            <Text style={styles.punchInTitle}>Punch In</Text>
            <Text style={styles.punchInTime}>{formatTime(punchInTime)}</Text>
            <Text style={styles.punchInDate}>{formatDate(punchInTime)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.punchOutBox,
              punchOutTime ? { backgroundColor: "#d3d3d3" } : null,
              !punchInTime && { opacity: 0.5 },
            ]}
            onPress={handlePunchOut}
            disabled={!punchInTime || !!punchOutTime}
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

        <View style={styles.tabRow}>
          {["All", "Week", "Month"].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setFilter(tab)}>
              <Text style={filter === tab ? styles.tabActive : styles.tab}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredRecords.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No attendance records yet</Text>
          </View>
        ) : (
          filteredRecords.map((record) => (
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: { padding: 20 },
  header: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
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
  emptyContainer: {
    flex: 1,
    minHeight: 200, // ensure some height to center vertically inside ScrollView
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "gray",
    fontWeight: "600",
  },
});
