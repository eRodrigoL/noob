import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Ranking() {
  // Hook para capturar os parâmetros da rota
  const params = useLocalSearchParams();

  // Acessando o parâmetro `id`
  const id = params.id;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Conteúdo da aba Ranking</Text>
      <Text>ID do Jogo: {id}</Text> {/* Exibe o ID na tela */}
    </View>
  );
}