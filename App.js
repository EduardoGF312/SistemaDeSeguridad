import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import RfidScreen from "./src/screens/RfidScreen";
import AppContext from "./src/components/AppContext";
import React, { useState } from "react";

const Stack = createStackNavigator();

export default function App() {
  const [buttonCount, setButtonCount] = useState(0);

  const resetButtonCount = () => {
    setButtonCount((prevCount) => prevCount + 1);
  };

  return (
    <AppContext.Provider value={{resetButtonCount}}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Rfid" component={RfidScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}

