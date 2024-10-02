import styles from "@/app/styles/Default";
import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface ButtonPrimaryProps {
  title: string;
  onPress: () => void;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.buttonPrimary} onPress={onPress}>
      <Text style={styles.buttonPrimaryText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonPrimary;
