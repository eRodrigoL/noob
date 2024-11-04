import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Option = {
  label: string;
  value: string;
};

const options: Option[] = [
  { label: "Opção 1", value: "opcao1" },
  { label: "Opção 2", value: "opcao2" },
  { label: "Opção 3", value: "opcao3" },
];

const RadioButtonGroup = () => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione uma opção:</Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.optionContainer}
          onPress={() => setSelectedValue(option.value)}
        >
          <View style={styles.radioCircle}>
            {selectedValue === option.value && (
              <View style={styles.selectedDot} />
            )}
          </View>
          <Text style={styles.optionLabel}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
  },
  optionLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default RadioButtonGroup;
