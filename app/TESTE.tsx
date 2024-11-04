import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { Theme } from "@/app/styles/Theme";

interface Avaliacao {
  id: string; // ID da avaliação
  usuario: string; // ID do usuário que fez a avaliação
  jogo: string; // ID do jogo avaliado
  beleza: number;
  divertimento: number;
  duracao: number;
  preco: number;
  armazenamento: number;
  nota: number;
}

export default function AvaliacaoList() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar as avaliações do banco de dados
  const fetchAvaliacoes = async () => {
    try {
      const response = await axios.get(
        "https://api-noob-react.onrender.com/api/avaliacoes/"
      );
      setAvaliacoes(response.data);
    } catch (err) {
      setError("Erro ao carregar as avaliações.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvaliacoes();
  }, []);

  // Renderiza cada avaliação na lista
  const renderItem = ({ item }: { item: Avaliacao }) => (
    <View style={localStyles.card}>
      <Text style={localStyles.title}>Avaliação de ID: {item.id}</Text>
      <Text>Beleza: {item.beleza}</Text>
      <Text>Divertimento: {item.divertimento}</Text>
      <Text>Duração: {item.duracao}</Text>
      <Text>Preço: {item.preco}</Text>
      <Text>Armazenamento: {item.armazenamento}</Text>
      <Text>Nota Geral: {item.nota}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={localStyles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.light.background} />
        <Text style={localStyles.loadingText}>Carregando avaliações...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={localStyles.errorContainer}>
        <Text style={localStyles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={localStyles.container}>
      <FlatList
        data={avaliacoes}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id || index.toString()}
      />
    </View>
  );
}

// Estilos para a tela de avaliações
const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Theme.light.background,
  },
  card: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: Theme.light.backgroundCard,
    elevation: 1, // Para Android
    shadowColor: "#000", // Para iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: Theme.light.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.light.background,
  },
  loadingText: {
    marginTop: 10,
    color: Theme.light.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.light.background,
  },
  errorText: {
    color: "#800000", // Cor vinho
  },
});
