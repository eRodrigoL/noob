import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  Alert,
} from "react-native";
import styles from "@/app/styles/Default";
import { Theme } from "@/app/styles/Theme";
import ApiWakeUp from "@/app/services/AcordarAPI";
import { screens } from "@/app/routes/Routes";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaskedTextInput } from "react-native-mask-text";

const RegistroPartidaScreen = () => {
  <ApiWakeUp />; // Mantém a API desperta

  const [explicacao, setExplicacao] = useState(false);
  const [tempoExplicacao, setTempoExplicacao] = useState("");
  const [inputText, setInputText] = useState("");
  const [inputJogo, setInputJogo] = useState("");
  const [inicioPartida, setInicioPartida] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [validNicknames, setValidNicknames] = useState<string[]>([]);
  const [validGames, setValidGames] = useState<{ id: string; titulo: string }[]>([]);

  useEffect(() => {
    const fetchNicknames = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        const response = await axios.get(
          "https://api-noob-react.onrender.com/api/usuarios",
          config
        );
        const nicknames = response.data.map((usuario: any) => usuario.apelido);
        setValidNicknames(nicknames);
      } catch (error) {
        console.error("Erro ao buscar apelidos:", error);
      }
    };

    const fetchGames = async () => {
      try {
        const response = await axios.get(
          "https://api-noob-react.onrender.com/api/jogos"
        );
        const games = response.data.map((jogo: any) => ({
          id: jogo._id,
          titulo: jogo.titulo,
        }));
        setValidGames(games);
      } catch (error) {
        console.error("Erro ao buscar jogos:", error);
      }
    };

    fetchNicknames();
    fetchGames();
  }, []);

  const addParticipant = () => {
    const trimmedInput = inputText.trim();

    if (!trimmedInput) return;

    if (trimmedInput.startsWith("@")) {
      if (validNicknames.includes(trimmedInput)) {
        setParticipants([...participants, trimmedInput]);
        setInputText("");
      } else {
        alert("Apelido não encontrado. Por favor, insira um apelido válido.");
      }
    } else {
      setParticipants([...participants, trimmedInput]);
      setInputText("");
    }
  };

  const validateGame = () => {
    const selectedGame = validGames.find((game) => game.titulo === inputJogo.trim());
    if (!selectedGame) {
      alert("Jogo não encontrado. Por favor, insira um jogo válido.");
    }
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const registrarPartida = async () => {
    if (participants.length === 0 || !inputJogo || !inicioPartida) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }
  
    const selectedGame = validGames.find((game) => game.titulo === inputJogo.trim());
    if (!selectedGame) {
      Alert.alert("Erro", "Jogo não encontrado. Por favor, insira um jogo válido.");
      return;
    }
  
    try {
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
  
      const horarioRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      const trimmedInicioPartida = inicioPartida.trim();
  
      // Validando o formato do horário
      if (trimmedInicioPartida.length !== 5 || !horarioRegex.test(trimmedInicioPartida)) {
        throw new Error("Horário inválido. Insira no formato hh:mm.");
      }
  
      const [hours, minutes] = trimmedInicioPartida.split(":").map(Number);
      const now = new Date();
      const inicio = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  
      const usuarios = participants.map((apelido) => ({ apelido }));
  
      const partidaData = {
        usuarios,
        jogo: selectedGame.id,
        explicacao: tempoExplicacao,
        inicio: inicio.toISOString(),
        registrador: userId,
      };
  
      const response = await axios.post(
        "https://api-noob-react.onrender.com/api/partidas",
        partidaData,
        config
      );
  
      if (response.status === 201) {
        Alert.alert("Sucesso", "Partida registrada com sucesso!");
        setParticipants([]);
        setInputJogo("");
        setTempoExplicacao("");
        setInicioPartida("");
        setExplicacao(false);
  
        screens.matches.finish();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erro ao registrar a partida:", error.message);
        Alert.alert("Erro", error.message || "Ocorreu um erro ao registrar a partida.");
      } else {
        console.error("Erro desconhecido:", error);
        Alert.alert("Erro", "Ocorreu um erro inesperado.");
      }
    }
  };
  
  

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={[styles.title, localStyles.header]}>Registro de partida</Text>

        <Text style={styles.label}>Participantes:</Text>
        <TextInput
          placeholder="Digite o jogador a adicionar e pressione Enter..."
          style={[styles.input, localStyles.input]}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={addParticipant}
        />
        <TouchableOpacity style={localStyles.addButton} onPress={addParticipant}>
          <Text style={localStyles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>

        <ScrollView horizontal style={localStyles.tagContainer}>
          {participants.map((participant, index) => (
            <View key={index} style={localStyles.tag}>
              <Text style={localStyles.tagText}>{participant}</Text>
              <TouchableOpacity onPress={() => removeParticipant(index)}>
                <Text style={localStyles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.label}>Jogo:</Text>
        <TextInput
          placeholder="Digite o jogo a pesquisar..."
          style={[styles.input, localStyles.input]}
          value={inputJogo}
          onChangeText={setInputJogo}
          onBlur={validateGame}
        />

        <View style={localStyles.explicacaoContainer}>
          <View style={localStyles.rowContainer}>
            <Text style={styles.label}>Tempo de explicação:</Text>
            <TextInput
              placeholder="Minutos"
              style={[styles.input, localStyles.inputTime]}
              value={tempoExplicacao}
              onChangeText={setTempoExplicacao}
              editable={!explicacao}
              keyboardType="numeric"
            />
          </View>
          <View style={localStyles.switchContainer}>
            <Switch
              value={explicacao}
              onValueChange={setExplicacao}
              style={localStyles.switch}
            />
            <Text style={localStyles.switchLabel}>não houve</Text>
          </View>
        </View>


        <Text style={styles.label}>Início da partida:</Text>
        <MaskedTextInput
          mask="99:99"
          placeholder="18:30"
          style={[styles.input, localStyles.input]}
          value={inicioPartida}
          onChangeText={(text, rawText) => {
            const horarioRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
            const formattedText = rawText.replace(/^(\d{2})(\d{2})$/, "$1:$2");
          
            if (formattedText.length === 5 && !horarioRegex.test(formattedText)) {
              Alert.alert("Erro", "Formato de horário inválido. Use hh:mm.");
            }
          
            setInicioPartida(formattedText.trim());
          }}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.buttonPrimary} onPress={registrarPartida}>
          <Text style={styles.buttonPrimaryText}>Registrar Partida</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  header: {
    color: Theme.light.backgroundButton,
    textAlign: "center",
  },
  input: {
    backgroundColor: Theme.light.backgroundCard,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: Theme.light.secondary.background,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.light.secondary.backgroundButton,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    color: Theme.light.textButton,
    marginRight: 8,
  },
  removeButtonText: {
    color: Theme.light.textButton,
    fontWeight: "bold",
  },
  explicacaoContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
    marginRight: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: "#000",
  },
  inputTime: {
    backgroundColor: Theme.light.backgroundCard,
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    width: 80,
    textAlign: "center",
  },
});

export default RegistroPartidaScreen;