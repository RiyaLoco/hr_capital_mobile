const React = require("react");
const { useState } = React;
const {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} = require("react-native");
const axios = require("axios");
const AsyncStorage =
  require("@react-native-async-storage/async-storage").default;

const API_URL = "http://192.168.100.210:3000";

const EmployeeLogin = ({ navigation }) => {
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!employeeId || !email || !password) {
      Alert.alert("Error", "Please enter employee ID, email, and password.");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }
    if (!/^\d+$/.test(employeeId)) {
      Alert.alert("Error", "Employee ID must be numeric.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/users?email=${email}&password=${password}&employeeId=${employeeId}`
      );

      if (res.data.length > 0) {
        const user = res.data[0];
        if (user.role !== "employee") {
          Alert.alert("Error", "This login is for employees only.");
          return;
        }
        await AsyncStorage.setItem("userId", String(user.id));
        await AsyncStorage.setItem("userRole", user.role);
        Alert.alert("Success", `Welcome back, ${user.username || user.email}!`);
        navigation.navigate("Index");
      } else {
        Alert.alert("Error", "Invalid employee ID, email, or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.appTitle}>HR Capital - Employee</Text>
            <Text style={styles.subtitle}>
              Sign in to your employee account
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Employee ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your employee ID"
                placeholderTextColor="#8B8B8B"
                value={employeeId}
                onChangeText={setEmployeeId}
                keyboardType="numeric"
                accessibilityLabel="Employee ID input"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#8B8B8B"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                accessibilityLabel="Email input"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#8B8B8B"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                accessibilityLabel="Password input"
              />
            </View>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Sign in button"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Sign in</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              style={styles.registerLink}
              accessibilityRole="button"
              accessibilityLabel="Register link"
            >
              <Text style={styles.registerText}>
                Don't have an account?{" "}
                <Text style={styles.registerLinkText}>Register</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F7FA",
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#1F2937",
  },
  button: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#93C5FD",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  registerLink: {
    marginTop: 24,
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    color: "#4B5563",
  },
  registerLinkText: {
    color: "#2563EB",
    fontWeight: "600",
  },
});

module.exports = EmployeeLogin;
