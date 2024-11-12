import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme } from "@/app/styles/Theme";
import styles from "@/app/styles/Default";
import { useLocalSearchParams } from "expo-router";
import ApiWakeUp from "@/app/services/AcordarAPI";

interface Game {
  titulo: string;
}

// Define o tipo para os dados da avaliação
interface Avaliacao {
  beleza: number;
  divertimento: number;
  duracao: number;
  preco: number;
  armazenamento: number;
  nota: number;
}

export default function GameReview() {
  <ApiWakeUp />; // Mantem a API desperta

  const { id: jogo } = useLocalSearchParams<{ id?: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [avaliacao, setAvaliacao] = useState<Avaliacao>({
    beleza: 0,
    divertimento: 0,
    duracao: 0,
    preco: 0,
    armazenamento: 0,
    nota: 0,
  });
  const [loading, setLoading] = useState(false);

  // Função para calcular a média
  const calculateAverage = (avaliacao: Avaliacao) => {
    const { beleza, divertimento, duracao, preco, armazenamento } = avaliacao;
    const totalNotas = beleza + divertimento + duracao + preco + armazenamento;
    const numberOfFields = 5; // Número de campos que estão sendo avaliados
    return Math.floor(totalNotas / numberOfFields); // Retorna a média inteira
  };

  const handleInputChange = (field: keyof Avaliacao, value: string) => {
    setAvaliacao((prev) => {
      const updatedAvaliacao = {
        ...prev,
        [field]: Number(value),
      };

      // Chama a função para calcular a média da nota
      return {
        ...updatedAvaliacao,
        nota: calculateAverage(updatedAvaliacao), // Atualiza a nota geral
      };
    });
  };

  // Função para buscar os dados completos do jogo usando o ID
  const fetchGameDetails = async () => {
    if (!jogo) {
      console.warn("ID não fornecido!"); // Aviso para id ausente
      return;
    }

    try {
      const response = await axios.get(
        `https://api-noob-react.onrender.com/api/jogos/${jogo}`
      );

      if (response.data) {
        setGame(response.data);
      } else {
        console.warn("Nenhum dado encontrado para este ID.");
      }
    } catch (error) {
      console.error("Erro ao buscar os dados do jogo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameDetails();
  }, [jogo]);

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (!game) {
    return <Text>Jogo não encontrado.</Text>;
  }

  // Função para enviar a avaliação para o banco de dados
  const submitReview = async () => {
    const userId = await AsyncStorage.getItem("userId");
    const token = await AsyncStorage.getItem("token");

    if (!userId || !token) {
      Alert.alert("Erro", "ID do usuário ou token não encontrados.");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const data = {
      usuario: userId,
      jogo,
      ...avaliacao,
    };

    setLoading(true);

    try {
      const response = await axios.post(
        "https://api-noob-react.onrender.com/api/avaliacoes/",
        data,
        config
      );
      if (response.status === 201) {
        Alert.alert("Sucesso", "Avaliação enviada com sucesso!");
        setAvaliacao({
          beleza: 0,
          divertimento: 0,
          duracao: 0,
          preco: 0,
          armazenamento: 0,
          nota: 0,
        });
      }
    } catch (error) {
      console.error("Erro ao enviar a avaliação:", error);
      Alert.alert("Erro", "Não foi possível enviar a avaliação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={localStyles.container}>
      <Text style={localStyles.title}>Avalie o Jogo</Text>
      <Text style={styles.title}>{game.titulo}</Text>
      <Text>Beleza:</Text>
      <TextInput
        style={localStyles.input}
        placeholder="Beleza"
        keyboardType="numeric"
        value={avaliacao.beleza.toString()}
        onChangeText={(value) => handleInputChange("beleza", value)}
      />
      <Text>Divertimento:</Text>
      <TextInput
        style={localStyles.input}
        placeholder="Divertimento"
        keyboardType="numeric"
        value={avaliacao.divertimento.toString()}
        onChangeText={(value) => handleInputChange("divertimento", value)}
      />
      <Text>Duração:</Text>
      <TextInput
        style={localStyles.input}
        placeholder="Duração"
        keyboardType="numeric"
        value={avaliacao.duracao.toString()}
        onChangeText={(value) => handleInputChange("duracao", value)}
      />
      <Text>Preço:</Text>
      <TextInput
        style={localStyles.input}
        placeholder="Preço"
        keyboardType="numeric"
        value={avaliacao.preco.toString()}
        onChangeText={(value) => handleInputChange("preco", value)}
      />
      <Text>Tamanho da caixa:</Text>
      <TextInput
        style={localStyles.input}
        placeholder="Armazenamento"
        keyboardType="numeric"
        value={avaliacao.armazenamento.toString()}
        onChangeText={(value) => handleInputChange("armazenamento", value)}
      />

      {/* Campo para mostrar a Nota Geral */}
      <Text style={localStyles.label}>Nota Geral:</Text>
      <Text style={localStyles.input}>{avaliacao.nota.toString()}</Text>

      <Button
        title="Enviar Avaliação"
        onPress={submitReview}
        disabled={loading}
      />
    </View>
  );
}

// Estilos para a página de avaliação
const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Theme.light.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Theme.light.text,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.light.text,
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    fontSize: 18,
    color: Theme.light.text,
  },
  label: {
    fontSize: 18,
    color: Theme.light.text,
    marginVertical: 5,
  },
});
