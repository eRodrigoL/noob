import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tipagem para os dados da API
interface Usuario {
  apelido: string;
  _id: string;
}

interface Vencedor {
  apelido: string;
  _id: string;
}

interface Partida {
  _id: string;
  usuarios: Usuario[];
  jogo: string;
  explicacao: string;
  inicio: string;
  fim: string;
  registrador: string;
  vencedor: Vencedor[];
  duracao: number;
  tituloJogo?: string; // Adicionado após buscar o título do jogo
}

export default function Historico() {
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPartidas() {
      try {

        const userId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        // Buscando dados das partidas
        const partidasResponse = await axios.get<Partida[]>("https://api-noob-react.onrender.com/api/partidas/", config);
        const partidasData = partidasResponse.data;

        // Buscando títulos dos jogos com base no ID do campo "jogo"
        const partidasComTitulos: Partida[] = await Promise.all(
          partidasData.map(async (partida) => {
            const jogoResponse = await axios.get<{ titulo: string }>(
              `https://api-noob-react.onrender.com/api/jogos/${partida.jogo}`
            );
            return {
              ...partida,
              tituloJogo: jogoResponse.data.titulo || "Título não disponível",
            };
          })
        );

        setPartidas(partidasComTitulos);
      } catch (error) {
        console.error("Erro ao buscar partidas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPartidas();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Partida }) => {
    const { tituloJogo, usuarios, vencedor, duracao, fim } = item;
    const dataConclusao = new Date(fim).toLocaleString();
    const participantes = usuarios.map((u) => u.apelido).join(", ");
    const vencedorNome = vencedor.map((v) => v.apelido).join(", ");

    return (
      <View style={styles.item}>
        <Text style={styles.title}>Jogo: {tituloJogo}</Text>
        <Text>Data de conclusão: {dataConclusao}</Text>
        <Text>Participantes: {participantes}</Text>
        <Text>Duração: {duracao * 60 } minutos</Text>
        <Text>Vencedor: {vencedorNome || "Nenhum"}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={partidas}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
