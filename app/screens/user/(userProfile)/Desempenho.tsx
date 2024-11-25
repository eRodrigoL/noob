import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Alert } from "react-native";
import { Svg, Circle, Text as SvgText, G, Line, Polygon } from "react-native-svg";

export default function Desempenho() {
  // Estados
  const [apelido, setApelido] = useState<string | null>(null);
  const [vitorias, setVitorias] = useState<number>(0);
  const [derrotas, setDerrotas] = useState<number>(0);

  // Função para buscar o apelido do usuário
  const buscarApelido = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");

      if (!userId || !token) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const response = await axios.get(
        `https://api-noob-react.onrender.com/api/usuarios/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApelido(response.data.apelido);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Erro na API:", error.response?.data || error.message);
        Alert.alert("Erro", "Não foi possível buscar o apelido.");
      } else {
        console.error("Erro desconhecido:", error);
        Alert.alert("Erro", "Ocorreu um erro inesperado.");
      }
    }
  };

  // Função para buscar as partidas e calcular vitórias e derrotas
  const buscarPartidas = async (apelido: string) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Erro", "Token de autenticação não encontrado.");
        return;
      }

      const response = await axios.get(
        "https://api-noob-react.onrender.com/api/partidas/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const partidas = response.data;

      // Filtrar vitórias e derrotas
      const vitorias = partidas.filter((partida: any) =>
        partida.vencedor.some((v: any) => v.apelido === apelido)
      ).length;

      const derrotas = partidas.filter((partida: any) =>
        partida.usuarios.some((u: any) => u.apelido === apelido)
      ).length - vitorias;

      setVitorias(vitorias);
      setDerrotas(derrotas);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Erro na API:", error.response?.data || error.message);
        Alert.alert("Erro", "Não foi possível buscar as partidas.");
      } else {
        console.error("Erro desconhecido:", error);
        Alert.alert("Erro", "Ocorreu um erro inesperado.");
      }
    }
  };

  useEffect(() => {
    buscarApelido();
  }, []);

  useEffect(() => {
    if (apelido) {
      buscarPartidas(apelido);
    }
  }, [apelido]);

  // Dados do gráfico de indicador
  const total = vitorias + derrotas;
  const vitoriasPercent = total > 0 ? (vitorias / total) * 100 : 0;
  const derrotasPercent = total > 0 ? (derrotas / total) * 100 : 0;

  const radius = 100;
  const strokeWidth = 20;
  const circumference = Math.PI * radius;
  const offsetDerrotas = (1 - derrotasPercent / 100) * circumference;

   // Dados do gráfico de teia de aranha
   const labels = ["Força", "Velocidade", "Agilidade", "Resistência", "Inteligência"];
   const values = [80, 70, 90, 60, 75]; // Percentuais
   const max = 100; // Valor máximo
   const centerX = 125;
   const centerY = 125;
   const chartRadius = 100;
 
   const calculatePoints = (values: number[], radius: number) =>
     values.map((value, index) => {
       const angle = (2 * Math.PI * index) / values.length - Math.PI / 2; // Divide 360 graus entre os pontos
       return {
         x: centerX + radius * Math.cos(angle),
         y: centerY + radius * Math.sin(angle),
       };
     });
 
   const outerPoints = calculatePoints(Array(labels.length).fill(max), chartRadius);
   const valuePoints = calculatePoints(
     values.map((v) => (v / max) * chartRadius),
     chartRadius
   );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
      <View style={{ alignItems: "center", paddingVertical: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Desempenho</Text>

        {/* Gráfico de Indicador */}
        <Svg height={150} width={250} viewBox="0 0 250 150">
          <G rotation="-90" origin="125, 125">
            {/* Círculo completo (background) */}
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
            {/* Círculo de derrotas (vermelho) */}
            <Circle
              cx="125"
              cy="125"
              r={radius}
              stroke="#f44336"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={offsetDerrotas}
            />
            {/* Círculo de vitórias (verde) */}
            <Circle
              cx="125"
              cy="125"
              r={radius}
              stroke="#4caf50"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={circumference - offsetDerrotas}
            />
          </G>
          <SvgText
            x="125"
            y="120"
            textAnchor="middle"
            fontSize="20"
            fill="#333"
            dy="8"
          >
            {`${vitoriasPercent.toFixed(1)}%`}
          </SvgText>
        </Svg>

        <Text style={{ fontSize: 16, marginTop: 10 }}>
          Vitórias: {vitorias} | Derrotas: {derrotas}
        </Text>

        <Text style={{ fontSize: 18, marginVertical: 20 }}>
          Desempenho por categoria
        </Text>

        {/* Gráfico de Teia de Aranha */}
        <Svg height={250} width={250} viewBox="0 0 250 250">
          {outerPoints.map((point, index) => (
            <Line
              key={`line-${index}`}
              x1={centerX}
              y1={centerY}
              x2={point.x}
              y2={point.y}
              stroke="#ccc"
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: 5 }, (_, i) => {
            const innerRadius = (chartRadius / 5) * (i + 1);
            const innerPoints = calculatePoints(Array(labels.length).fill(max), innerRadius);
            return (
              <Polygon
                key={`polygon-${i}`}
                points={innerPoints.map((p) => `${p.x},${p.y}`).join(" ")}
                stroke="#ccc"
                strokeWidth={1}
                fill="none"
              />
            );
          })}
          <Polygon
            points={valuePoints.map((p) => `${p.x},${p.y}`).join(" ")}
            stroke="#4caf50"
            strokeWidth={2}
            fill="rgba(76, 175, 80, 0.4)"
          />
          {outerPoints.map((point, index) => (
            <SvgText
              key={`label-${index}`}
              x={point.x}
              y={point.y}
              textAnchor="middle"
              fontSize="10"
              fill="#333"
              dx={point.x > centerX ? 5 : point.x < centerX ? -5 : 0}
              dy={point.y > centerY ? 10 : point.y < centerY ? -10 : 0}
            >
              {labels[index]}
            </SvgText>
          ))}
        </Svg>
      
      </View>

    </ScrollView>
  );
}


