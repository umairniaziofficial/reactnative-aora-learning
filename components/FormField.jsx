import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  errorMessage,
  secureTextEntry,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const borderColor = errorMessage ? "border-red-500" : "border-black-200";
  const focusBorderColor = errorMessage ? "focus:border-red-500" : "focus:border-secondary";

  const isPassword = secureTextEntry;

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View
        className={`border-2 ${borderColor} w-full h-16 px-4 bg-black-100 rounded-2xl ${focusBorderColor} items-center flex-row`}
      >
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={showPassword ? icons.eyeHide : icons.eye}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
      {errorMessage && (
        <Text className="text-sm text-red-500 font-pmedium">{errorMessage}</Text>
      )}
    </View>
  );
};

export default FormField;