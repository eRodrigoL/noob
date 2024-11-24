import React from "react";
import { View, Text } from "react-native";
import { Svg, Circle, Text as SvgText, G } from "react-native-svg";

export default function Desempenho() {
  // Dados do indicador
  const total = 100; // Valor total representado no indicador
  const valor1 = 70; // Categoria 1
  const valor2 = total - valor1; // Categoria 2

  // Cores e configurações
  const radius = 100; // Raio do gráfico
  const strokeWidth = 20; // Largura do arco
  const circumference = Math.PI * radius; // Circunferência de um semicírculo
  const offset1 = (1 - valor1 / total) * circumference;
  const offset2 = (1 - valor2 / total) * circumference;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}> Desempenho </Text>
      <Svg height={150} width={250} viewBox="0 0 250 150">
        <G rotation="-90" origin="125, 125">
          {/* Fundo do semicírculo */}
          <Circle
            cx="125"
            cy="125"
            r={radius}
            stroke="#ddd"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={0}
          />
          {/* Categoria 1 */}
          <Circle
            cx="125"
            cy="125"
            r={radius}
            stroke="#4caf50"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset1}
          />
          {/* Categoria 2 */}
          <Circle
            cx="125"
            cy="125"
            r={radius}
            stroke="#f44336"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset2}
          />
        </G>
        {/* Texto central */}
        <SvgText
          x="125"
          y="120"
          textAnchor="middle"
          fontSize="20"
          fill="#333"
          dy="8"
        >
          {`${valor1}%`}
        </SvgText>
      </Svg>
    </View>
  );
}

