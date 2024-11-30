import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "@/app/styles/Default";
import { screens } from "@/app/routes/Routes";
import { useLocalSearchParams } from "expo-router";

const screenWidth = Dimensions.get("window").width;

// Componente principal
export default function Descricao() {
  // Estado para armazenar os dados do jogo ou usuário
  const { id } = useLocalSearchParams<{ id: string }>();
  const [game, setGame] = useState<any>(null);

  if (!id) {
    Alert.alert("Erro", "ID do jogo não encontrado.");
    return;
  }

  // Hook useEffect para buscar os dados do jogo/usuário assim que o componente for montado
  useEffect(() => {
    fetchGameData();
  }, []);

  // Função para buscar dados do jogo/usuário na API
  const fetchGameData = async () => {
    try {
      // Recupera o ID do usuário e o token do AsyncStorage
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");

      // Verifica se os dados foram encontrados
      if (!userId || !token) {
        Alert.alert("Erro", "ID do usuário ou token não encontrados."); // Mostra um alerta se algo estiver ausente
        return;
      }

      // Configura o cabeçalho da requisição com o token de autorização
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Faz uma requisição GET para a API usando o ID do usuário
      const response = await axios.get(
        `https://api-noob-react.onrender.com/api/jogos/${id}`,
        config
      );

      // Atualiza o estado com os dados recebidos
      setGame(response.data);
    } catch (error) {
      console.error("Erro ao buscar os dados do usuário:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
    }
  };

  // Função para adicionar um dia a uma data e formatá-la
  const addOneDay = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }); // Retorna a data formatada no padrão brasileiro
  };

  // Enquanto os dados do jogo/usuário ainda não foram carregados, exibe um texto de "Carregando..."
  if (!game) {
    return <Text>Carregando...</Text>;
  }

  // Renderização do conteúdo principal quando os dados do jogo/usuário estão disponíveis
  return (
    <View style={localStyles.container}>
      <ScrollView style={{ flex: 1, width: screenWidth }}>
        {/* Idade */}
        <Text style={styles.label}>Idade:</Text>
        <Text style={styles.label}>{game.idade}</Text>

        {/* Designer */}
        <Text style={styles.label}>Designer:</Text>
        <Text style={styles.label}>{addOneDay(game.designer)}</Text>

        {/* Editora */}
        <Text style={styles.label}>Editora:</Text>
        <Text style={styles.label}>{addOneDay(game.editora)}</Text>

        {/* Versão digital */}
        <Text style={styles.label}>Versão digital:</Text>
        <Text style={styles.label}>{addOneDay(game.digital)}</Text>

        {/* Categoria */}
        <Text style={styles.label}>Categoria:</Text>
        <Text style={styles.label}>{addOneDay(game.categoria)}</Text>

        {/* Componentes */}
        <Text style={styles.label}>Componentes:</Text>
        <Text style={styles.label}>{addOneDay(game.componentes)}</Text>

        {/* Descrição */}
        <Text style={styles.label}>Descrição:</Text>
        <Text style={styles.label}>{addOneDay(game.descricao)}</Text>

        {/* Botão de Editar */}
        <View style={{ flex: 1, alignItems: "center" }}>
        <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => screens.boardgame.editGame(id)}
          >
            <Text style={styles.buttonPrimaryText}>Editar Jogo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    minWidth: screenWidth,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});
