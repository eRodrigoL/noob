import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Alert } from "react-native";
import { Svg, Circle, Text as SvgText, G } from "react-native-svg";

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
      </View>
    </ScrollView>
  );
}


