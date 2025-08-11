// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   FlatList,
//   SafeAreaView,
//   Modal,
//   Button,
//   Alert,
//   ScrollView,
// } from "react-native";

// export default function EmployeeScreen() {
//   const [employees, setEmployees] = useState([
//     {
//       id: "1",
//       fullname: "Ret Vatthanak",
//       employeeId: "E001",
//       position: "IT",
//       department: "IT",
//       date: "2023-01-01",
//       address: "Phnom Penh",
//     },
//     {
//       id: "2",
//       fullname: "Khiev Sovan",
//       employeeId: "E002",
//       position: "Graphic Designer",
//       department: "Design",
//       date: "2023-02-15",
//       address: "Phnom Penh",
//     },
//   ]);

//   const [departments, setDepartments] = useState([
//     { id: "d1", name: "IT" },
//     { id: "d2", name: "Design" },
//   ]);

//   const [viewMode, setViewMode] = useState("summary"); // summary, employees, departments
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalType, setModalType] = useState(""); // "employee" or "department"

//   const [formEmployee, setFormEmployee] = useState({
//     fullname: "",
//     employeeId: "",
//     position: "",
//     department: departments.length > 0 ? departments[0].name : "",
//     date: "",
//     address: "",
//   });

//   const [formDepartment, setFormDepartment] = useState({
//     name: "",
//   });

//   const resetEmployeeForm = () => {
//     setFormEmployee({
//       fullname: "",
//       employeeId: "",
//       position: "",
//       department: departments.length > 0 ? departments[0].name : "",
//       date: "",
//       address: "",
//     });
//   };

//   const resetDepartmentForm = () => {
//     setFormDepartment({ name: "" });
//   };

//   const openCreateModal = (type) => {
//     if (type === "employee") resetEmployeeForm();
//     if (type === "department") resetDepartmentForm();
//     setModalType(type);
//     setModalVisible(true);
//   };

//   const addEmployee = () => {
//     if (
//       !formEmployee.fullname ||
//       !formEmployee.employeeId ||
//       !formEmployee.position ||
//       !formEmployee.department ||
//       !formEmployee.date
//     ) {
//       alert("Please fill all required fields");
//       return;
//     }
//     setEmployees((prev) => [
//       ...prev,
//       { id: Date.now().toString(), ...formEmployee },
//     ]);
//     setModalVisible(false);
//   };

//   const addDepartment = () => {
//     if (!formDepartment.name.trim()) {
//       alert("Please enter department name");
//       return;
//     }
//     if (
//       departments.some(
//         (d) => d.name.toLowerCase() === formDepartment.name.trim().toLowerCase()
//       )
//     ) {
//       alert("Department already exists");
//       return;
//     }
//     setDepartments((prev) => [
//       ...prev,
//       { id: Date.now().toString(), name: formDepartment.name.trim() },
//     ]);
//     setModalVisible(false);
//   };

//   const deleteEmployee = (id) => {
//     Alert.alert("Delete Employee", "Are you sure?", [
//       { text: "Cancel" },
//       {
//         text: "Delete",
//         onPress: () => {
//           setEmployees((prev) => prev.filter((e) => e.id !== id));
//         },
//         style: "destructive",
//       },
//     ]);
//   };

//   const deleteDepartment = (id) => {
//     Alert.alert("Delete Department", "Are you sure?", [
//       { text: "Cancel" },
//       {
//         text: "Delete",
//         onPress: () => {
//           setDepartments((prev) => prev.filter((d) => d.id !== id));
//           setEmployees((prev) =>
//             prev.map((e) =>
//               e.department === departments.find((d) => d.id === id)?.name
//                 ? { ...e, department: "" }
//                 : e
//             )
//           );
//         },
//         style: "destructive",
//       },
//     ]);
//   };

//   const renderModalContent = () => {
//   if (modalType === "employee") {
//     return (
//       <ScrollView
//         style={styles.modalContent}
//         keyboardShouldPersistTaps="handled"
//         contentContainerStyle={styles.modalContentContainer}
//       >
//         <Text style={styles.modalHeader}>Add New Employee</Text>

//         <View style={styles.inputContainer}>
//           <Text style={styles.inputLabel}>Full Name</Text>
//           <TextInput
//             placeholder="Enter full name"
//             style={styles.input}
//             value={formEmployee.fullname}
//             onChangeText={(text) =>
//               setFormEmployee((f) => ({ ...f, fullname: text }))
//             }
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.inputLabel}>Employee ID</Text>
//           <TextInput
//             placeholder="Enter employee ID"
//             style={styles.input}
//             value={formEmployee.employeeId}
//             onChangeText={(text) =>
//               setFormEmployee((f) => ({ ...f, employeeId: text }))
//             }
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.inputLabel}>Position</Text>
//           <TextInput
//             placeholder="Enter position"
//             style={styles.input}
//             value={formEmployee.position}
//             onChangeText={(text) =>
//               setFormEmployee((f) => ({ ...f, position: text }))
//             }
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.inputLabel}>Department</Text>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             style={styles.departmentScroll}
//             contentContainerStyle={styles.departmentScrollContainer}
//           >
//             {departments.map((item) => (
//               <TouchableOpacity
//                 key={item.id}
//                 style={[
//                   styles.departmentOption,
//                   formEmployee.department === item.name
//                     ? styles.departmentOptionSelected
//                     : styles.departmentOptionUnselected,
//                 ]}
//                 onPress={() =>
//                   setFormEmployee((f) => ({ ...f, department: item.name }))
//                 }
//               >
//                 <Text
//                   style={[
//                     styles.departmentOptionText,
//                     formEmployee.department === item.name
//                       ? styles.departmentOptionTextSelected
//                       : styles.departmentOptionTextUnselected,
//                   ]}
//                 >
//                   {item.name}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.inputLabel}>Date of Joining</Text>
//           <TextInput
//             placeholder="YYYY-MM-DD"
//             style={styles.input}
//             value={formEmployee.date}
//             onChangeText={(text) =>
//               setFormEmployee((f) => ({ ...f, date: text }))
//             }
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.inputLabel}>Address</Text>
//           <TextInput
//             placeholder="Enter address"
//             style={[styles.input, styles.inputMultiline]}
//             value={formEmployee.address}
//             onChangeText={(text) =>
//               setFormEmployee((f) => ({ ...f, address: text }))
//             }
//             multiline
//           />
//         </View>

//         <View style={styles.modalButtonRow}>
//           <TouchableOpacity
//             style={[styles.button, styles.cancelButton]}
//             onPress={() => setModalVisible(false)}
//           >
//             <Text style={styles.buttonText}>Cancel</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.button, styles.saveButton]}
//             onPress={addEmployee}
//           >
//             <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     );
//   }

//   if (modalType === "department") {
//     return (
//       <View style={[styles.modalContent, styles.departmentModalContent]}>
//         <Text style={styles.modalHeader}>Add New Department</Text>

//         <View style={styles.inputContainer}>
//           <Text style={styles.inputLabel}>Department Name</Text>
//           <TextInput
//             placeholder="Enter department name"
//             style={styles.input}
//             value={formDepartment.name}
//             onChangeText={(text) => setFormDepartment({ name: text })}
//           />
//         </View>

//         <View style={styles.modalButtonRow}>
//           <TouchableOpacity
//             style={[styles.button, styles.cancelButton]}
//             onPress={() => setModalVisible(false)}
//           >
//             <Text style={styles.buttonText}>Cancel</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.button, styles.saveButton]}
//             onPress={addDepartment}
//           >
//             <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   return null;
// };

//   if (viewMode === "employees") {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Text style={styles.header}>Employees</Text>

//         {/* Buttons Row */}
//         <View style={styles.buttonsRow}>
//           <TouchableOpacity
//             style={[styles.createButton, styles.backButton]}
//             onPress={() => setViewMode("summary")}
//           >
//             <Text style={styles.createButtonText}>← Back to Summary</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.createButton}
//             onPress={() => openCreateModal("employee")}
//           >
//             <Text style={styles.createButtonText}>+ Create New Employee</Text>
//           </TouchableOpacity>
//         </View>

//         {employees.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No employee records yet.</Text>
//           </View>
//         ) : (
//           <FlatList
//             data={employees}
//             keyExtractor={(item) => item.id}
//             contentContainerStyle={{ paddingVertical: 10 }}
//             renderItem={({ item }) => (
//               <View style={styles.employeeCard}>
//                 <View>
//                   <Text style={styles.employeeName}>{item.fullname}</Text>
//                   <Text style={styles.employeePosition}>{item.position}</Text>
//                   <Text style={styles.employeeDepartment}>
//                     Department: {item.department}
//                   </Text>
//                   <Text style={styles.employeeDetails}>
//                     ID: {item.employeeId} | Date: {item.date}
//                   </Text>
//                   <Text style={styles.employeeDetails}>
//                     Address: {item.address}
//                   </Text>
//                 </View>
//                 <TouchableOpacity
//                   onPress={() => deleteEmployee(item.id)}
//                   style={styles.deleteButton}
//                 >
//                   <Text style={styles.deleteButtonText}>Delete</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           />
//         )}

//         <Modal visible={modalVisible} animationType="slide" transparent={false}>
//           <SafeAreaView style={styles.modalContainer}>
//             {renderModalContent()}
//           </SafeAreaView>
//         </Modal>
//       </SafeAreaView>
//     );
//   }

//   if (viewMode === "departments") {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Text style={styles.header}>Departments</Text>

//         {/* Row container for buttons */}
//         <View style={styles.buttonsRow}>
//              <TouchableOpacity
//             style={[styles.createButton, styles.backButton]} // reuse createButton style for consistent look
//             onPress={() => setViewMode("summary")}
//           >
//             <Text style={styles.createButtonText}>← Back to Summary</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.createButton}
//             onPress={() => openCreateModal("department")}
//           >
//             <Text style={styles.createButtonText}>+ Create New Department</Text>
//           </TouchableOpacity>

       
//         </View>

//         {departments.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No department records yet.</Text>
//           </View>
//         ) : (
//           <FlatList
//             data={departments}
//             keyExtractor={(item) => item.id}
//             contentContainerStyle={{ paddingVertical: 10 }}
//             renderItem={({ item }) => (
//               <View style={styles.departmentCard}>
//                 <Text style={styles.departmentName}>{item.name}</Text>
//                 <TouchableOpacity
//                   onPress={() => deleteDepartment(item.id)}
//                   style={styles.deleteButton}
//                 >
//                   <Text style={styles.deleteButtonText}>Delete</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           />
//         )}

//         <Modal visible={modalVisible} animationType="slide" transparent={false}>
//           <SafeAreaView style={styles.modalContainer}>
//             {renderModalContent()}
//           </SafeAreaView>
//         </Modal>
//       </SafeAreaView>
//     );
//   }

//   // Summary view
//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.header}>Employee Dashboard</Text>
//       <View style={styles.employeeSummaryRow}>
//         <TouchableOpacity
//           onPress={() => setViewMode("employees")}
//           style={styles.summaryBox}
//         >
//           <Text style={styles.summaryNumber}>{employees.length}</Text>
//           <Text style={styles.summaryLabel}>Total Employees</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => setViewMode("departments")}
//           style={[styles.summaryBox, styles.departmentSummaryBox]}
//         >
//           <Text style={styles.summaryNumber}>{departments.length}</Text>
//           <Text style={styles.summaryLabel}>Total Departments</Text>
//         </TouchableOpacity>
//       </View>
//       <View>
//         <Text style={styles.header2}>Employees List</Text>
//       </View>
//       <View style={styles.cardGrid}>
//         {employees.length === 0 ? (
//           <Text style={{ textAlign: "center", width: "100%", color: "#999" }}>
//             No employees yet
//           </Text>
//         ) : (
//           employees.map((emp) => (
//             <View key={emp.id} style={styles.summaryEmployeeCard}>
//               <View style={styles.avatarPlaceholder} />
//               <Text style={styles.summaryEmployeeName}>{emp.fullname}</Text>
//               <Text style={styles.summaryEmployeeRole}>{emp.position}</Text>
//             </View>
//           ))
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#fafafa" },
//   header: {
//     fontSize: 28,
//     fontWeight: "700",
//     marginBottom: 20,
//     color: "#333",
//     margin: 20,
//   },
//   header2: {
//     fontSize: 24,
//     fontWeight: "700",
//     marginBottom: 10,
//     color: "#333",
//     marginLeft: 20,
//   },

//   employeeSummaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 30,
//   },
//   summaryBox: {
//     flex: 1,
//     marginHorizontal: 10,
//     paddingVertical: 30,
//     borderRadius: 16,
//     backgroundColor: "#00c851",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 5,
//   },
//   departmentSummaryBox: {
//     backgroundColor: "#ff4444",
//   },
//   summaryNumber: { fontSize: 36, fontWeight: "bold", color: "#fff" },
//   summaryLabel: {
//     fontSize: 18,
//     color: "#fff",
//     marginTop: 8,
//     fontWeight: "600",
//   },

//   cardGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     margin: 10,
//     gap: 12,
//   },

//   summaryEmployeeCard: {
//     width: "48%",
//     backgroundColor: "#fff", // gray background
//     borderRadius: 12,
//     paddingVertical: 24,
//     paddingHorizontal: 16,
//     marginBottom: 12,
//     alignItems: "center",
//   },

//   avatarPlaceholder: {
//     width: 72,
//     height: 72,
//     borderRadius: 36,
//     backgroundColor: "#ddd",
//     marginBottom: 15,
//   },

//   summaryEmployeeName: {
//     fontWeight: "700",
//     fontSize: 18,
//     color: "#000",
//     marginBottom: 6,
//     textAlign: "center",
//   },

//   summaryEmployeeRole: {
//     fontSize: 14,
//     color: "#777",
//     textAlign: "center",
//   },


//   employeeCard: {
//     width: "48%", // take about half with small gap
//     backgroundColor: "#fff", // clean white card
//     borderRadius: 12,
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     alignItems: "flex-start",
//   },
//   employeeName: {
//     fontWeight: "700",
//     fontSize: 18,
//     color: "#222",
//     marginBottom: 6,
//   },

//   employeeRole: {
//     fontSize: 14,
//     color: "#666",
//   },

//   // Employee list view
//   createButton: {
//     backgroundColor: "#007bff",
//     paddingVertical: 12, // vertical padding
//     paddingHorizontal: 20, // horizontal padding
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//     flex: 1,
//     marginHorizontal: 5,
//   },
//   createButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
//   employeePosition: { fontWeight: "600", color: "#444", marginTop: 4 },
//   employeeDepartment: { fontStyle: "italic", color: "#666", marginTop: 2 },
//   employeeDetails: { color: "#555", marginTop: 2 },

//   employeeCard: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 3,
//   },
//   deleteButton: {
//     backgroundColor: "#ff4d4d",
//     borderRadius: 6,
//     justifyContent: "center",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     alignSelf: "center",
//   },
//   deleteButtonText: {
//     color: "#fff",
//     fontWeight: "600",
//   },

//   // Department list view
//   departmentCard: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 3,
//   },
//   departmentName: { fontWeight: "700", fontSize: 16, color: "#222" },

//   modalContainer: { flex: 1, padding: 20, backgroundColor: "#fafafa" },
//   modalContent: {
//     flex: 1,
//   },
//   modalHeader: {
//     fontSize: 24,
//     fontWeight: "700",
//     marginBottom: 20,
//     color: "#222",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     marginTop: 12,
//     marginBottom: 12, // added margin bottom for spacing between inputs
//     fontSize: 16,
//     color: "#333", // dark text color for better readability
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },

//   label: {
//     marginTop: 15,
//     fontWeight: "600",
//     fontSize: 16,
//     color: "#444",
//   },
//   departmentScroll: {
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   departmentOption: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginRight: 10,
//     borderWidth: 1,
//     borderColor: "#ccc",
//   },
//   departmentOptionSelected: {
//     backgroundColor: "#007bff",
//     borderColor: "#007bff",
//   },
//   departmentOptionUnselected: {
//     backgroundColor: "#f0f0f0",
//   },
//   departmentOptionTextSelected: {
//     color: "#fff",
//     fontWeight: "600",
//   },
//   departmentOptionTextUnselected: {
//     color: "#333",
//   },
//   modalButtonRow: {
//     flexDirection: "row",
//     marginTop: 25,
//     justifyContent: "flex-end",
//   },

//   backButton: {
//     marginTop: 15,
//     alignSelf: "flex-start",
//   },
//   backButtonText: {
//     color: "#007bff",
//     fontSize: 16,
//     fontWeight: "600",
//   },

//   emptyContainer: {
//     marginTop: 60,
//     alignItems: "center",
//   },
//   emptyText: {
//     fontSize: 18,
//     color: "#888",
//     fontStyle: "italic",
//   },
//   buttonsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 15,
//   },

//   backButton: {
//     backgroundColor: "#6c757d", // slightly different color for back, grayish
//   },
//   modalContent: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 40,
//   },
//   departmentModalContent: {
//     paddingBottom: 20,
//   },
//   modalContentContainer: {
//     paddingBottom: 20,
//   },
//   modalHeader: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: '#1a1a1a',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333',
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   inputMultiline: {
//     minHeight: 80,
//     textAlignVertical: 'top',
//   },
//   departmentScroll: {
//     marginVertical: 10,
//   },
//   departmentScrollContainer: {
//     paddingRight: 20,
//   },
//   departmentOption: {
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     marginRight: 10,
//     borderWidth: 1,
//   },
//   departmentOptionSelected: {
//     backgroundColor: '#007bff',
//     borderColor: '#007bff',
//   },
//   departmentOptionUnselected: {
//     backgroundColor: '#fff',
//     borderColor: '#ddd',
//   },
//   departmentOptionText: {
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   departmentOptionTextSelected: {
//     color: '#fff',
//   },
//   departmentOptionTextUnselected: {
//     color: '#333',
//   },
//   modalButtonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   button: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cancelButton: {
//     backgroundColor: '#f1f3f5',
//     marginRight: 10,
//   },
//   saveButton: {
//     backgroundColor: '#007bff',
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   saveButtonText: {
//     color: '#fff',
//   },
// });

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "http://192.168.1.6:3000"; // Replace with your server IP if needed

export default function EmployeeScreen() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [viewMode, setViewMode] = useState("summary");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [loading, setLoading] = useState(true);

  const [formEmployee, setFormEmployee] = useState({
    fullname: "",
    employeeId: "",
    position: "",
    department: "",
    date: "",
    address: "",
  });

  const [formDepartment, setFormDepartment] = useState({
    name: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const storedEmployees = await AsyncStorage.getItem("employees");
        const storedDepartments = await AsyncStorage.getItem("departments");
        if (storedEmployees && storedDepartments) {
          setEmployees(JSON.parse(storedEmployees));
          setDepartments(JSON.parse(storedDepartments));
        }

        try {
          // Create endpoints if they don't exist
          try {
            await axios.get(`${API_URL}/employees`);
          } catch (error) {
            if (error.response?.status === 404) {
              console.log("Creating /employees endpoint");
              await axios.post(`${API_URL}/employees`, []);
            }
          }
          try {
            await axios.get(`${API_URL}/departments`);
          } catch (error) {
            if (error.response?.status === 404) {
              console.log("Creating /departments endpoint");
              await axios.post(`${API_URL}/departments`, []);
            }
          }

          const [employeesRes, departmentsRes] = await Promise.all([
            axios.get(`${API_URL}/employees`),
            axios.get(`${API_URL}/departments`),
          ]);
          console.log("Employees fetched:", employeesRes.data);
          console.log("Departments fetched:", departmentsRes.data);
          setEmployees(employeesRes.data);
          setDepartments(departmentsRes.data);
          await AsyncStorage.setItem("employees", JSON.stringify(employeesRes.data));
          await AsyncStorage.setItem("departments", JSON.stringify(departmentsRes.data));
        } catch (serverError) {
          console.error("Failed to fetch from server:", serverError.response?.data || serverError.message);
          Alert.alert("Error", "Failed to connect to server. Using cached data.");
        }
      } catch (error) {
        console.error("Error loading data:", error);
        Alert.alert("Error", "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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

  const addEmployee = async () => {
    if (
      !formEmployee.fullname ||
      !formEmployee.employeeId ||
      !formEmployee.position ||
      !formEmployee.department ||
      !formEmployee.date
    ) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    const newEmployee = { id: Date.now().toString(), ...formEmployee };

    try {
      console.log("Posting employee to:", `${API_URL}/employees`, newEmployee);
      const response = await axios.post(`${API_URL}/employees`, newEmployee);
      console.log("Employee added:", response.data);
      const updatedEmployees = [...employees, newEmployee];
      setEmployees(updatedEmployees);
      await AsyncStorage.setItem("employees", JSON.stringify(updatedEmployees));
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding employee:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to add employee. Please try again.");
    }
  };

  const addDepartment = async () => {
    if (!formDepartment.name.trim()) {
      Alert.alert("Error", "Please enter department name");
      return;
    }
    if (
      departments.some(
        (d) => d.name.toLowerCase() === formDepartment.name.trim().toLowerCase()
      )
    ) {
      Alert.alert("Error", "Department already exists");
      return;
    }

    const newDepartment = { id: Date.now().toString(), name: formDepartment.name.trim() };

    try {
      console.log("Posting department to:", `${API_URL}/departments`, newDepartment);
      const response = await axios.post(`${API_URL}/departments`, newDepartment);
      console.log("Department added:", response.data);
      const updatedDepartments = [...departments, newDepartment];
      setDepartments(updatedDepartments);
      await AsyncStorage.setItem("departments", JSON.stringify(updatedDepartments));
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding department:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to add department. Please try again.");
    }
  };

  const deleteEmployee = async (id) => {
    Alert.alert("Delete Employee", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            console.log("Deleting employee:", `${API_URL}/employees/${id}`);
            await axios.delete(`${API_URL}/employees/${id}`);
            const updatedEmployees = employees.filter((e) => e.id !== id);
            setEmployees(updatedEmployees);
            await AsyncStorage.setItem("employees", JSON.stringify(updatedEmployees));
          } catch (error) {
            console.error("Error deleting employee:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to delete employee. Please try again.");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const deleteDepartment = async (id) => {
    Alert.alert("Delete Department", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            console.log("Deleting department:", `${API_URL}/departments/${id}`);
            await axios.delete(`${API_URL}/departments/${id}`);
            const departmentName = departments.find((d) => d.id === id)?.name;
            const updatedDepartments = departments.filter((d) => d.id !== id);
            setDepartments(updatedDepartments);
            const updatedEmployees = employees.map((e) =>
              e.department === departmentName ? { ...e, department: "" } : e
            );
            setEmployees(updatedEmployees);
            await AsyncStorage.setItem("departments", JSON.stringify(updatedDepartments));
            await AsyncStorage.setItem("employees", JSON.stringify(updatedEmployees));
          } catch (error) {
            console.error("Error deleting department:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to delete department. Please try again.");
          }
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
          contentContainerStyle={styles.modalContentContainer}
        >
          <Text style={styles.modalHeader}>Add New Employee</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              placeholder="Enter full name"
              style={styles.input}
              value={formEmployee.fullname}
              onChangeText={(text) =>
                setFormEmployee((f) => ({ ...f, fullname: text }))
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Employee ID</Text>
            <TextInput
              placeholder="Enter employee ID"
              style={styles.input}
              value={formEmployee.employeeId}
              onChangeText={(text) =>
                setFormEmployee((f) => ({ ...f, employeeId: text }))
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Position</Text>
            <TextInput
              placeholder="Enter position"
              style={styles.input}
              value={formEmployee.position}
              onChangeText={(text) =>
                setFormEmployee((f) => ({ ...f, position: text }))
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Department</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.departmentScroll}
              contentContainerStyle={styles.departmentScrollContainer}
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
                    style={[
                      styles.departmentOptionText,
                      formEmployee.department === item.name
                        ? styles.departmentOptionTextSelected
                        : styles.departmentOptionTextUnselected,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Date of Joining</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              style={styles.input}
              value={formEmployee.date}
              onChangeText={(text) =>
                setFormEmployee((f) => ({ ...f, date: text }))
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
              placeholder="Enter address"
              style={[styles.input, styles.inputMultiline]}
              value={formEmployee.address}
              onChangeText={(text) =>
                setFormEmployee((f) => ({ ...f, address: text }))
              }
              multiline
            />
          </View>

          <View style={styles.modalButtonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={addEmployee}
            >
              <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }

    if (modalType === "department") {
      return (
        <View style={[styles.modalContent, styles.departmentModalContent]}>
          <Text style={styles.modalHeader}>Add New Department</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Department Name</Text>
            <TextInput
              placeholder="Enter department name"
              style={styles.input}
              value={formDepartment.name}
              onChangeText={(text) => setFormDepartment({ name: text })}
            />
          </View>

          <View style={styles.modalButtonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={addDepartment}
            >
              <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (viewMode === "employees") {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Employees</Text>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.createButton, styles.backButton]}
            onPress={() => setViewMode("summary")}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
            <Text style={styles.createButtonText}>Back to Summary</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => openCreateModal("employee")}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.createButtonText}>Create Employee</Text>
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
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.employeeCard}>
                <View>
                  <Text style={styles.employeeName}>{item.fullname}</Text>
                  <Text style={styles.employeePosition}>{item.position}</Text>
                  <Text style={styles.employeeDepartment}>
                    Department: {item.department || "None"}
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
                  <Ionicons name="trash-outline" size={20} color="#fff" />
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

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.createButton, styles.backButton]}
            onPress={() => setViewMode("summary")}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
            <Text style={styles.createButtonText}>Back to Summary</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => openCreateModal("department")}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.createButtonText}>Create Department</Text>
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
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.departmentCard}>
                <Text style={styles.departmentName}>{item.name}</Text>
                <TouchableOpacity
                  onPress={() => deleteDepartment(item.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={20} color="#fff" />
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
          <Text style={styles.emptyText}>No employees yet</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 24,
    textAlign: "center",
    margin: 20,
  },
  header2: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1a1a1a",
    
    marginBottom: 16,
    marginLeft: 20,
  },
  employeeSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 16,
    marginHorizontal: 15,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  departmentSummaryBox: {
    marginLeft: 0,
  },
  summaryNumber: {
    fontSize: 32,
    fontWeight: "700",
    color: "#007bff",
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginTop: 8,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
    paddingBottom: 24,
    marginHorizontal: 15,
  },
  summaryEmployeeCard: {
    width: "47%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e0e0e0",
    marginBottom: 12,
  },
  summaryEmployeeName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  summaryEmployeeRole: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666",
    marginTop: 6,
    textAlign: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 16,
  },
  createButton: {
    flex: 1,
    backgroundColor: "#007bff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 15
  },
  backButton: {
    backgroundColor: "#6c757d",
    marginLeft: 15
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
  },
  employeeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: 15,
  },
  employeeName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },
  employeePosition: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666",
    marginTop: 6,
  },
  employeeDepartment: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666",
    marginTop: 6,
  },
  employeeDetails: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666",
    marginTop: 6,
  },
  departmentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: 15,
  },
  departmentName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#777",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 40,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  departmentModalContent: {
    paddingBottom: 24,
  },
  modalContentContainer: {
    paddingBottom: 24,
  },
  modalHeader: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  departmentScroll: {
    marginVertical: 12,
  },
  departmentScrollContainer: {
    paddingRight: 24,
    gap: 12,
  },
  departmentOption: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
  },
  departmentOptionSelected: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  departmentOptionUnselected: {
    backgroundColor: "#fff",
    borderColor: "#e0e0e0",
  },
  departmentOptionText: {
    fontSize: 15,
    fontWeight: "500",
  },
  departmentOptionTextSelected: {
    color: "#fff",
  },
  departmentOptionTextUnselected: {
    color: "#333",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f1f3f5",
  },
  saveButton: {
    backgroundColor: "#007bff",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  saveButtonText: {
    color: "#fff",
  },
  listContent: {
    paddingVertical: 16,
    paddingBottom: 100,
  },
});