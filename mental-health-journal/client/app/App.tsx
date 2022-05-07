import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { primary, light, backgroundColor } from "./constants";

import { Home, Gratitude, Affirmation, Mood } from "./views";

const Stack = createNativeStackNavigator();

const BottomTab = () => {
  const Tab = createBottomTabNavigator();
  const { Navigator, Screen } = Tab;
  return (
    <Navigator
      initialRouteName={"Home"}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;
          switch (rn) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Gratitude":
              iconName = focused ? "heart" : "heart-outline";
              break;
            case "Affirmation":
              iconName = focused
                ? "checkmark-circle"
                : "checkmark-circle-outline";
              break;
            case "Mood":
              iconName = focused ? "happy" : "happy-outline";
              break;
          }
          return <Ionicons name={iconName} size={30} color={color} />;
        },
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: "#BBBBBB",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: backgroundColor,
          borderTopColor: backgroundColor,
        },
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerTitleStyle: {
          color: primary,
        },
      })}
    >
      <Screen name="Home" component={Home} />
      <Screen name="Gratitude" component={Gratitude} />
      <Screen name="Affirmation" component={Affirmation} />
      <Screen name="Mood" component={Mood} />
    </Navigator>
  );
};

export default function App() {
  const { Navigator, Screen } = Stack;
  return (
    <NavigationContainer>
      <Navigator initialRouteName="BottomTab"
        screenOptions={({ route }) => ({
          headerShown: false,
        })}
      >
        <Screen
          name="BottomTab"
          component={BottomTab}
          options={{ headerShown: false }}
        />
      </Navigator>
    </NavigationContainer>
  );
}
