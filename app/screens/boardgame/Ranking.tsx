import React from "react";
import { View, Text, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BarChart } from "react-native-chart-kit";

export default function Ranking() {
  // Capturando o parâmetro `id` da rota
  const { id } = useLocalSearchParams<{ id?: string }>();

  // Dados fictícios do ranking
  const data = {
    labels: ["Jogador 1", "Jogador 2", "Jogador 3", "Jogador 4", "Jogador 5"], // Nomes no ranking
    datasets: [
      {
        data: [95, 87, 78, 65, 45], // Pontuações correspondentes
      },
    ],
  };

  const screenWidth = Dimensions.get("window").width; // Largura da tela

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ marginBottom: 20 }}>Conteúdo da aba Ranking</Text>
      {id ? (
        <Text style={{ marginBottom: 20 }}>ID do Jogo: {id}</Text>
      ) : (
        <Text style={{ marginBottom: 20 }}>ID não fornecido</Text>
      )}

      {/* Gráfico de Ranking */}
      <BarChart
        data={data}
        width={screenWidth - 40} // Largura do gráfico
        height={220} // Altura do gráfico
        yAxisLabel="" // Prefixo do eixo Y
        yAxisSuffix="" // Sufixo obrigatório do eixo Y (aqui vazio)
        chartConfig={{
          backgroundColor: "#1E2923",
          backgroundGradientFrom: "#08130D",
          backgroundGradientTo: "#1F4E45",
          decimalPlaces: 0, // Sem casas decimais nos valores
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForBackgroundLines: {
            strokeWidth: 0.5,
            stroke: "gray",
          },
        }}
        style={{
          marginVertical: 10,
          borderRadius: 16,
        }}
      />
    </View>
  );
}

