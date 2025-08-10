import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  Modal,
  Button,
  Alert,
  ScrollView,
} from "react-native";

export default function EmployeeScreen() {
  const [employees, setEmployees] = useState([
    {
      id: "1",
      fullname: "Ret Vatthanak",
      employeeId: "E001",
      position: "IT",
      department: "IT",
      date: "2023-01-01",
      address: "Phnom Penh",
    },
    {
      id: "2",
      fullname: "Khiev Sovan",
      employeeId: "E002",
      position: "Graphic Designer",
      department: "Design",
      date: "2023-02-15",
      address: "Phnom Penh",
    },
  ]);

  const [departments, setDepartments] = useState([
    { id: "d1", name: "IT" },
    { id: "d2", name: "Design" },
  ]);

  const [viewMode, setViewMode] = useState("summary"); // summary, employees, departments
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // "employee" or "department"

  const [formEmployee, setFormEmployee] = useState({
    fullname: "",
    employeeId: "",
    position: "",
    department: departments.length > 0 ? departments[0].name : "",
    date: "",
    address: "",
  });

  const [formDepartment, setFormDepartment] = useState({
    name: "",
  });

  const resetEmployeeForm = () => {
    setFormEmployee({
      fullname: "",
      employeeId: "",
      position: "",
      department: departments.length > 0 ? departments[0].name : "",
      date: "",
      address: "",
    });
  };

  const resetDepartmentForm = () => {
    setFormDepartment({ name: "" });
  };

  const openCreateModal = (type) => {
    if (type === "employee") resetEmployeeForm();
    if (type === "department") resetDepartmentForm();
    setModalType(type);
    setModalVisible(true);
  };

  const addEmployee = () => {
    if (
      !formEmployee.fullname ||
      !formEmployee.employeeId ||
      !formEmployee.position ||
      !formEmployee.department ||
      !formEmployee.date
    ) {
      alert("Please fill all required fields");
      return;
    }
    setEmployees((prev) => [
      ...prev,
      { id: Date.now().toString(), ...formEmployee },
    ]);
    setModalVisible(false);
  };

  const addDepartment = () => {
    if (!formDepartment.name.trim()) {
      alert("Please enter department name");
      return;
    }
    if (
      departments.some(
        (d) => d.name.toLowerCase() === formDepartment.name.trim().toLowerCase()
      )
    ) {
      alert("Department already exists");
      return;
    }
    setDepartments((prev) => [
      ...prev,
      { id: Date.now().toString(), name: formDepartment.name.trim() },
    ]);
    setModalVisible(false);
  };

  const deleteEmployee = (id) => {
    Alert.alert("Delete Employee", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: () => {
          setEmployees((prev) => prev.filter((e) => e.id !== id));
        },
        style: "destructive",
      },
    ]);
  };

  const deleteDepartment = (id) => {
    Alert.alert("Delete Department", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: () => {
          setDepartments((prev) => prev.filter((d) => d.id !== id));
          setEmployees((prev) =>
            prev.map((e) =>
              e.department === departments.find((d) => d.id === id)?.name
                ? { ...e, department: "" }
                : e
            )
          );
        },
        style: "destructive",
      },
    ]);
  };

  const renderModalContent = () => {
    if (modalType === "employee") {
      return (
        <ScrollView
          style={styles.modalContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.modalHeader}>New Employee</Text>

          <TextInput
            placeholder="Fullname"
            style={styles.input}
            value={formEmployee.fullname}
            onChangeText={(text) =>
              setFormEmployee((f) => ({ ...f, fullname: text }))
            }
          />
          <TextInput
            placeholder="Employee ID"
            style={styles.input}
            value={formEmployee.employeeId}
            onChangeText={(text) =>
              setFormEmployee((f) => ({ ...f, employeeId: text }))
            }
          />
          <TextInput
            placeholder="Position"
            style={styles.input}
            value={formEmployee.position}
            onChangeText={(text) =>
              setFormEmployee((f) => ({ ...f, position: text }))
            }
          />

          <Text style={styles.label}>Department</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.departmentScroll}
          >
            {departments.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.departmentOption,
                  formEmployee.department === item.name
                    ? styles.departmentOptionSelected
                    : styles.departmentOptionUnselected,
                ]}
                onPress={() =>
                  setFormEmployee((f) => ({ ...f, department: item.name }))
                }
              >
                <Text
                  style={
                    formEmployee.department === item.name
                      ? styles.departmentOptionTextSelected
                      : styles.departmentOptionTextUnselected
                  }
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TextInput
            placeholder="Date (YYYY-MM-DD)"
            style={styles.input}
            value={formEmployee.date}
            onChangeText={(text) =>
              setFormEmployee((f) => ({ ...f, date: text }))
            }
          />

          <TextInput
            placeholder="Address"
            style={styles.input}
            value={formEmployee.address}
            onChangeText={(text) =>
              setFormEmployee((f) => ({ ...f, address: text }))
            }
          />

          <View style={styles.modalButtonRow}>
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
            <View style={{ width: 20 }} />
            <Button title="Save" onPress={addEmployee} />
          </View>
        </ScrollView>
      );
    }

    if (modalType === "department") {
      return (
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>New Department</Text>
          <TextInput
            placeholder="Department Name"
            style={styles.input}
            value={formDepartment.name}
            onChangeText={(text) => setFormDepartment({ name: text })}
          />
          <View style={styles.modalButtonRow}>
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
            <View style={{ width: 20 }} />
            <Button title="Save" onPress={addDepartment} />
          </View>
        </View>
      );
    }

    return null;
  };

  if (viewMode === "employees") {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Employees</Text>

        {/* Buttons Row */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.createButton, styles.backButton]}
            onPress={() => setViewMode("summary")}
          >
            <Text style={styles.createButtonText}>← Back to Summary</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => openCreateModal("employee")}
          >
            <Text style={styles.createButtonText}>+ Create New Employee</Text>
          </TouchableOpacity>
        </View>

        {employees.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No employee records yet.</Text>
          </View>
        ) : (
          <FlatList
            data={employees}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 10 }}
            renderItem={({ item }) => (
              <View style={styles.employeeCard}>
                <View>
                  <Text style={styles.employeeName}>{item.fullname}</Text>
                  <Text style={styles.employeePosition}>{item.position}</Text>
                  <Text style={styles.employeeDepartment}>
                    Department: {item.department}
                  </Text>
                  <Text style={styles.employeeDetails}>
                    ID: {item.employeeId} | Date: {item.date}
                  </Text>
                  <Text style={styles.employeeDetails}>
                    Address: {item.address}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => deleteEmployee(item.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        <Modal visible={modalVisible} animationType="slide" transparent={false}>
          <SafeAreaView style={styles.modalContainer}>
            {renderModalContent()}
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    );
  }

  if (viewMode === "departments") {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Departments</Text>

        {/* Row container for buttons */}
        <View style={styles.buttonsRow}>
             <TouchableOpacity
            style={[styles.createButton, styles.backButton]} // reuse createButton style for consistent look
            onPress={() => setViewMode("summary")}
          >
            <Text style={styles.createButtonText}>← Back to Summary</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => openCreateModal("department")}
          >
            <Text style={styles.createButtonText}>+ Create New Department</Text>
          </TouchableOpacity>

       
        </View>

        {departments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No department records yet.</Text>
          </View>
        ) : (
          <FlatList
            data={departments}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 10 }}
            renderItem={({ item }) => (
              <View style={styles.departmentCard}>
                <Text style={styles.departmentName}>{item.name}</Text>
                <TouchableOpacity
                  onPress={() => deleteDepartment(item.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        <Modal visible={modalVisible} animationType="slide" transparent={false}>
          <SafeAreaView style={styles.modalContainer}>
            {renderModalContent()}
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    );
  }

  // Summary view
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Employee Dashboard</Text>
      <View style={styles.employeeSummaryRow}>
        <TouchableOpacity
          onPress={() => setViewMode("employees")}
          style={styles.summaryBox}
        >
          <Text style={styles.summaryNumber}>{employees.length}</Text>
          <Text style={styles.summaryLabel}>Total Employees</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setViewMode("departments")}
          style={[styles.summaryBox, styles.departmentSummaryBox]}
        >
          <Text style={styles.summaryNumber}>{departments.length}</Text>
          <Text style={styles.summaryLabel}>Total Departments</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.header2}>Employees List</Text>
      </View>
      <View style={styles.cardGrid}>
        {employees.length === 0 ? (
          <Text style={{ textAlign: "center", width: "100%", color: "#999" }}>
            No employees yet
          </Text>
        ) : (
          employees.map((emp) => (
            <View key={emp.id} style={styles.summaryEmployeeCard}>
              <View style={styles.avatarPlaceholder} />
              <Text style={styles.summaryEmployeeName}>{emp.fullname}</Text>
              <Text style={styles.summaryEmployeeRole}>{emp.position}</Text>
            </View>
          ))
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fafafa" },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    color: "#333",
    margin: 20,
  },
  header2: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
    marginLeft: 20,
  },

  employeeSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  summaryBox: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 30,
    borderRadius: 16,
    backgroundColor: "#00c851",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  departmentSummaryBox: {
    backgroundColor: "#ff4444",
  },
  summaryNumber: { fontSize: 36, fontWeight: "bold", color: "#fff" },
  summaryLabel: {
    fontSize: 18,
    color: "#fff",
    marginTop: 8,
    fontWeight: "600",
  },

  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    margin: 10,
    gap: 12,
  },

  summaryEmployeeCard: {
    width: "48%",
    backgroundColor: "#fff", // gray background
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: "center",
  },

  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#ddd",
    marginBottom: 15,
  },

  summaryEmployeeName: {
    fontWeight: "700",
    fontSize: 18,
    color: "#000",
    marginBottom: 6,
    textAlign: "center",
  },

  summaryEmployeeRole: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
  // employeeCard: {
  //   width: "48%",
  //   backgroundColor: "#fff",
  //   borderRadius: 12,
  //   padding: 20,
  //   marginBottom: 15,
  //   shadowColor: "#000",
  //   shadowOpacity: 0.05,
  //   shadowRadius: 6,
  //   shadowOffset: { width: 0, height: 3 },
  //   elevation: 3,
  // },
  //   employeeName: { fontWeight: "700", fontSize: 16, color: "#222" },
  // employeeRole: { marginTop: 6, fontSize: 14, color: "#666" },

  employeeCard: {
    width: "48%", // take about half with small gap
    backgroundColor: "#fff", // clean white card
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "flex-start",
    // Optional for smooth text shadow on iOS
    // textShadowColor: "rgba(0,0,0,0.1)",
    // textShadowOffset: {width: 0, height: 1},
    // textShadowRadius: 1,
  },
  employeeName: {
    fontWeight: "700",
    fontSize: 18,
    color: "#222",
    marginBottom: 6,
  },

  employeeRole: {
    fontSize: 14,
    color: "#666",
  },

  // Employee list view
  createButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12, // vertical padding
    paddingHorizontal: 20, // horizontal padding
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  createButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  employeePosition: { fontWeight: "600", color: "#444", marginTop: 4 },
  employeeDepartment: { fontStyle: "italic", color: "#666", marginTop: 2 },
  employeeDetails: { color: "#555", marginTop: 2 },

  employeeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    borderRadius: 6,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  // Department list view
  departmentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  departmentName: { fontWeight: "700", fontSize: 16, color: "#222" },

  modalContainer: { flex: 1, padding: 20, backgroundColor: "#fafafa" },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#222",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginTop: 12,
    marginBottom: 12, // added margin bottom for spacing between inputs
    fontSize: 16,
    color: "#333", // dark text color for better readability
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  label: {
    marginTop: 15,
    fontWeight: "600",
    fontSize: 16,
    color: "#444",
  },
  departmentScroll: {
    marginTop: 10,
    marginBottom: 20,
  },
  departmentOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  departmentOptionSelected: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  departmentOptionUnselected: {
    backgroundColor: "#f0f0f0",
  },
  departmentOptionTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  departmentOptionTextUnselected: {
    color: "#333",
  },
  modalButtonRow: {
    flexDirection: "row",
    marginTop: 25,
    justifyContent: "flex-end",
  },

  backButton: {
    marginTop: 15,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "600",
  },

  emptyContainer: {
    marginTop: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    fontStyle: "italic",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  backButton: {
    backgroundColor: "#6c757d", // slightly different color for back, grayish
  },
});
