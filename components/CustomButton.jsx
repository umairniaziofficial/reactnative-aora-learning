import { Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

const CustomButton = ({
  title,
  loadingText = "Loading...",
  containerStyle,
  handlePress,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      className={`bg-secondary rounded-xl justify-center items-center min-h-[62px] ${containerStyle} ${
        isLoading ? "opacity-50" : ""
      }`}
      onPress={handlePress}
      disabled={isLoading}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
        {isLoading ? loadingText : title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
