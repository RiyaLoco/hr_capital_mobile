import * as React from "react";
import { useEffect } from "react"; // ← You missed this
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./app/screen/auth/login";
import Register from "./app/screen/auth/register";
import ScheduleCreate from "./app/screen/ScheduleCreate";
import Index from "./app/index";
import { initDB } from "./db";
import MainTabs from "./app/MainTabs";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    initDB(); // ← Important to create the "users" table
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Index"
            component={MainTabs}
          />
           <Stack.Screen
            name="ScheduleCreate"
            component={ScheduleCreate}
            options={{ title: "Add Schedule" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
