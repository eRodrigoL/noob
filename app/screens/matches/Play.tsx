import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
} from "react-native";
import axios from "axios";
import { Theme } from "@/app/styles/Theme";
import ButtonPrimary from "@components/ButtonPrimary";
import { useRouter } from "expo-router";

// Definição de tipos
interface Usuario {
  _id: string;
  nome: string;
}

interface Jogo {
  _id: string;
  titulo: string;
}

export default function RegisterMatch() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [pontuacoes, setPontuacoes] = useState<{ [key: string]: string }>({});
  const [winners, setWinners] = useState<string[]>([]);
  const router = useRouter();

  // Carrega jogadores e jogos da API
  useEffect(() => {
    fetchUsuarios();
    fetchJogos();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(
        "https://api-noob-react.onrender.com/api/usuarios"
      );
      setUsuarios(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const fetchJogos = async () => {
    try {
      const response = await axios.get(
        "https://api-noob-react.onrender.com/api/jogos/"
      );
      setJogos(response.data);
    } catch (error) {
      console.error("Erro ao buscar jogos:", error);
    }
  };

  // Manipula a seleção de jogadores
  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Seleciona o jogo
  const handleGameSelection = (gameId: string) => {
    setSelectedGame(gameId);
  };

  // Função para iniciar a partida
  const startMatch = () => {
    if (!selectedUsers.length || !selectedGame) {
      Alert.alert("Erro", "Por favor, selecione jogadores e um jogo.");
      return;
    }

    setStartTime(new Date()); // Define o horário de início
  };

  // Função para finalizar a partida e registrar os dados no banco
  const finishMatch = async () => {
    if (!startTime || !selectedUsers.length || !selectedGame) {
      Alert.alert("Erro", "Informações incompletas para finalizar a partida.");
      return;
    }

    setEndTime(new Date()); // Define o horário de término

    const matchData = {
      usuarios: selectedUsers,
      jogo: selectedGame,
      duracao: `${startTime?.toLocaleTimeString()} - ${new Date().toLocaleTimeString()}`, // Calcula o intervalo
      vencedor: winners, // Lista de ganhadores
      pontuacoes, // Objeto com pontuações dos jogadores
      inicio: startTime,
      fim: new Date(),
    };

    try {
      const response = await axios.post(
        "https://api-noob-react.onrender.com/api/partidas",
        matchData
      );
      Alert.alert("Sucesso", "Partida registrada com sucesso!");
      router.push("./"); // <{MUDAR}> Navega para a lista de partidas (assumindo que haja uma rota de listagem)
    } catch (error) {
      console.error("Erro ao registrar a partida:", error);
    }
  };

  // Renderiza a lista de jogadores
  const renderUser = ({ item }: { item: Usuario }) => (
    <TouchableOpacity
      onPress={() => toggleUserSelection(item._id)}
      style={[
        localStyles.userItem,
        selectedUsers.includes(item._id) && localStyles.selectedUser,
      ]}
    >
      <Text style={localStyles.userName}>{item.nome}</Text>
    </TouchableOpacity>
  );

  // Renderiza a lista de jogos
  const renderGame = ({ item }: { item: Jogo }) => (
    <TouchableOpacity
      onPress={() => handleGameSelection(item._id)}
      style={[
        localStyles.gameItem,
        selectedGame === item._id && localStyles.selectedGame,
      ]}
    >
      <Text style={localStyles.gameTitle}>{item.titulo}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={localStyles.title}>Registrar Partida</Text>

      {/* Lista de jogadores */}
      <Text style={localStyles.sectionTitle}>Selecione os jogadores:</Text>
      <FlatList
        data={usuarios}
        renderItem={renderUser}
        keyExtractor={(item) => item._id}
        extraData={selectedUsers}
      />

      {/* Lista de jogos */}
      <Text style={localStyles.sectionTitle}>Selecione o jogo:</Text>
      <FlatList
        data={jogos}
        renderItem={renderGame}
        keyExtractor={(item) => item._id}
        extraData={selectedGame}
      />

      {/* Botão de iniciar partida */}
      <ButtonPrimary title="Iniciar" onPress={startMatch} />

      {/* Pontuações */}
      {startTime && (
        <View>
          <Text style={localStyles.sectionTitle}>Pontuações:</Text>
          {selectedUsers.map((userId) => (
            <View key={userId} style={localStyles.scoreContainer}>
              <Text>{usuarios.find((user) => user._id === userId)?.nome}</Text>
              <TextInput
                style={localStyles.scoreInput}
                keyboardType="numeric"
                placeholder="Pontuação"
                onChangeText={(text) =>
                  setPontuacoes({ ...pontuacoes, [userId]: text })
                }
              />
            </View>
          ))}

          {/* Botão de finalizar partida */}
          <ButtonPrimary title="Finalizar" onPress={finishMatch} />
        </View>
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Theme.light.text,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Theme.light.text,
    marginTop: 20,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Theme.light.borda,
  },
  selectedUser: {
    backgroundColor: Theme.light.background,
  },
  userName: {
    fontSize: 16,
    color: Theme.light.text,
  },
  gameItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Theme.light.borda,
  },
  selectedGame: {
    backgroundColor: Theme.light.background,
  },
  gameTitle: {
    fontSize: 16,
    color: Theme.light.text,
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  scoreInput: {
    borderBottomWidth: 1,
    borderBottomColor: Theme.light.borda,
    width: 100,
    textAlign: "center",
  },
});
