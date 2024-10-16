import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as yup from 'yup';
import { loginUser } from "../(tabs)"; 

const signInSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Signin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 

  const validate = async () => {
    try {
      await signInSchema.validate(form, { abortEarly: false });
      return true;
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      return false;
    }
  };

  const submit = async () => {
    if (!(await validate())) return;

    try {
      setIsSubmitting(true);
      setSuccessMessage(""); 
      setErrorMessage(""); 
      await loginUser(form.email, form.password);
      setSuccessMessage("Login Successful! Redirecting...");

      setTimeout(() => {
        router.replace("/home");
      }, 2000); 
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <StatusBar backgroundColor="#161622" style="light" />
      <ScrollView>
        <View className="w-full justify-center min-h-[84vh] px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl font-semibold mt-10 font-psemibold text-white">
            Log in to Aora
          </Text>
          
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
            errorMessage={errors.email}
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            keyboardType="default"
            secureTextEntry={true}
            errorMessage={errors.password}
          />
          <CustomButton
            title={isSubmitting ? "Signing in..." : "Sign in"}
            handlePress={submit}
            containerStyle={"mt-7"}
            isLoading={isSubmitting}
          />
          
          {/* Success message */}
          {successMessage && (
            <Text className="text-lg text-green-500 font-pmedium mt-3">{successMessage}</Text>
          )}
          
          {/* Error message */}
          {errorMessage && (
            <Text className="text-lg text-red-500 font-pmedium mt-3">{errorMessage}</Text>
          )}
          
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?{" "} 
            </Text>
            <Link href={"/sign-up"} className="text-lg font-psemibold text-secondary">Signup</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signin;
