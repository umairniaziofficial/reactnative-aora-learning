import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";

export default function App() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Text className="text-3xl pb-3">Hello, Nizzy!</Text>
      <Link href={"/home"} className="text-2xl text-blue-700 font-bold">
        Home
      </Link>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
