import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";
import CustomButton from "../../components/CustomButton";
import { logoutUser } from ".";
import { useRouter } from "expo-router";

const Profile = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <CustomButton
        title="Logout"
        containerStyle={"w-1/2"}
        handlePress={async () => {
          try {
            await logoutUser();
            router.replace("/sign-in");
          } catch (err) {
            console.error(err);
          }
        }}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Profile;
