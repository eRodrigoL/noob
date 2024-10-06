import React from "react";
import { TextInput, StyleSheet } from "react-native";
import styles from "@styles/Default";

type SearchBarProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
};

export default function SearchBar({
  placeholder,
  value,
  onChangeText,
}: SearchBarProps) {
  return (
    <TextInput
      style={styles.searchBar}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
    />
  );
}
