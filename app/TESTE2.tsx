import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router"; // Alteração no hook para useLocalSearchParams
import axios from "axios";
import { Theme } from "@/app/styles/Theme";

// Define o tipo para os dados do jogo
interface Game {
  capa: string;
  titulo: string;
  ano: number;
  idade: number;
  designer: string;
  artista: string;
  editora: string;
  descricao: string;
}

export default function GameProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>(); // Define 'id' como opcional
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar os dados completos do jogo usando o ID
  const fetchGameDetails = async () => {
    if (!id) return; // Verifica se 'id' está presente antes de continuar

    try {
      const response = await axios.get(
        `https://api-noob-react.onrender.com/api/jogos/${id}` // Requisição para buscar o jogo específico
      );
      setGame(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar os dados do jogo:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameDetails(); // Carregar dados do jogo ao montar o componente
  }, [id]);

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (!game) {
    return <Text>Jogo não encontrado.</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: game.capa }} style={styles.image} />
      <Text style={styles.title}>{game.titulo}</Text>
      <Text style={styles.details}>Ano: {game.ano}</Text>
      <Text style={styles.details}>Idade: {game.idade}+</Text>
      <Text style={styles.details}>Designer: {game.designer}</Text>
      <Text style={styles.details}>Artista: {game.artista}</Text>
      <Text style={styles.details}>Editora: {game.editora}</Text>
      <Text style={styles.description}>{game.descricao}</Text>
    </View>
  );
}

// Estilos para a página de perfil
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Theme.light.background,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Theme.light.text,
    marginVertical: 10,
  },
  details: {
    fontSize: 18,
    color: Theme.light.text,
    marginVertical: 2,
  },
  description: {
    fontSize: 16,
    color: Theme.light.text,
    marginVertical: 10,
  },
});
