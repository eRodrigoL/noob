import React from "react";
import { View, Text } from "react-native";
import { screens } from "@routes/Routes";
import { useLocalSearchParams } from "expo-router";

export default function Ranking() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Conteúdo da aba Ranking</Text>
    </View>
  );
}