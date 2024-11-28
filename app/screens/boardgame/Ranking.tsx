import React from "react";
import { View, Text, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BarChart } from "react-native-chart-kit";

export default function Ranking() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const data = {
    labels: ["Jogador 1", "Jogador 2", "Jogador 3", "Jogador 4", "Jogador 5"],
    datasets: [
      {
        data: [95, 87, 78, 65, 45],
      },
    ],
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f9f9f9" }}>
      <Text style={{ marginBottom: 20, fontSize: 16, fontWeight: "bold" }}>Ranking dos Jogadores</Text>
      {id ? (
        <Text style={{ marginBottom: 20, fontSize: 14 }}>ID do Jogo: {id}</Text>
      ) : (
        <Text style={{ marginBottom: 20, fontSize: 14 }}>ID não fornecido</Text>
      )}

      {/* Gráfico de Ranking Horizontal */}
      <BarChart
        data={data}
        width={screenWidth - 40}
        height={300}
        yAxisLabel=""
        yAxisSuffix=""
        showValuesOnTopOfBars={true}
        fromZero={true}
        //horizontal={true} // Configuração para gráfico horizontal
        chartConfig={{
          backgroundColor: "#FFFFFF",
          backgroundGradientFrom: "#FFFFFF",
          backgroundGradientTo: "#FFFFFF",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`, // Verde suave
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Preto para rótulos
          style: {
            borderRadius: 16,
          },
          propsForBackgroundLines: {
            strokeWidth: 0.5,
            stroke: "#e3e3e3", // Linhas mais claras
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
