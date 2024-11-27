import React from "react";
import { View, Text, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Svg, { Polygon, Circle, Text as SvgText, Line } from "react-native-svg";


export default function GameDashboard() {
  // Capturando o parâmetro `id` da rota
  const { id } = useLocalSearchParams<{ id?: string }>();

 // Dados do gráfico
 const data = [80, 90, 85, 70, 95]; // Valores das categorias
 const categories = ["Jogabilidade", "Gráficos", "História", "Som", "Diversão"]; // Categorias
 const maxValue = 100; // Valor máximo para o gráfico
 const chartSize = 300; // Tamanho do gráfico
 const radius = chartSize / 2; // Raio do gráfico

 // Função para calcular coordenadas de cada ponto
 const calculateCoordinates = (value: number, index: number, total: number) => {
   const angle = (Math.PI * 2 * index) / total; // Ângulo em radianos
   const distance = (value / maxValue) * radius; // Distância do centro
   const x = radius + distance * Math.sin(angle); // Coordenada X
   const y = radius - distance * Math.cos(angle); // Coordenada Y
   return { x, y };
 };

 // Gerar os pontos para o polígono principal
 const points = data
   .map((value, index) => {
     const { x, y } = calculateCoordinates(value, index, data.length);
     return `${x},${y}`;
   })
   .join(" "); 

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ marginBottom: 20 }}>Conteúdo da aba Gráficos do jogo</Text>
      {id ? (
        <Text style={{ marginBottom: 20 }}>ID do Jogo: {id}</Text>
      ) : (
        <Text style={{ marginBottom: 20 }}>ID não fornecido</Text>
      )}

      {/* Gráfico de Teia de Aranha */}
      <Svg width={chartSize} height={chartSize}>
        {/* Linhas da grade */}
        {[1, 0.75, 0.5, 0.25].map((factor, i) => (
          <Polygon
            key={i}
            points={categories
              .map((_, index) => {
                const { x, y } = calculateCoordinates(
                  factor * maxValue,
                  index,
                  categories.length
                );
                return `${x},${y}`;
              })
              .join(" ")}
            stroke="gray"
            strokeWidth="0.5"
            fill="none"
          />
        ))}

        {/* Eixos */}
        {categories.map((_, index) => {
          const { x, y } = calculateCoordinates(maxValue, index, categories.length);
          return (
            <Line
              key={index}
              x1={radius}
              y1={radius}
              x2={x}
              y2={y}
              stroke="gray"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Polígono dos dados */}
        <Polygon points={points} fill="rgba(26, 255, 146, 0.3)" stroke="green" />

        {/* Categorias */}
        {categories.map((category, index) => {
          const { x, y } = calculateCoordinates(maxValue + 20, index, categories.length);
          return (
            <SvgText
              key={index}
              x={x}
              y={y}
              fontSize="12"
              textAnchor="middle"
              fill="black"
            >
              {category}
            </SvgText>
          );
        })}

        {/* Centro */}
        <Circle cx={radius} cy={radius} r="3" fill="black" />
      </Svg>
    </View>
  );
   
  
}
