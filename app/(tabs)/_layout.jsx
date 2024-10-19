import React from "react";
import { Tabs } from "expo-router";
import { Image, View, Text } from "react-native";
import { icons } from "../../constants";

const TabIcon = ({ color, focused, icon, name }) => {
  return (
    <View className="flex items-center justify-center gap-2">
      <Image
        source={icon}
        style={{
          width: 24,
          height: 24,
          tintColor: focused ? color : "#CDCDE0",
        }}
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const _layout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 100,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                focused={focused}
                color={color}
                icon={icons.home}
                name="Home"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                focused={focused}
                color={color}
                icon={icons.plus}
                name="Create"
              />
            ),
          }}
        />

       

        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                focused={focused}
                color={color}
                icon={icons.profile}
                name="Profile"
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default _layout;
