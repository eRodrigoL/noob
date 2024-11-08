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
import ApiWakeUp from "@/components/AcordarAPI";
import { screens } from "@/app/routes/Routes";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegistroPartidaScreen = () => {
  <ApiWakeUp />; // Mantém a API desperta

  const [explicacao, setExplicacao] = useState(false);
  const [tempoExplicacao, setTempoExplicacao] = useState("");
  const [inputText, setInputText] = useState("");
  const [inputJogo, setInputJogo] = useState("");
  const [inicioPartida, setInicioPartida] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [validNicknames, setValidNicknames] = useState<string[]>([]);
  const [validGames, setValidGames] = useState<string[]>([]);

  // Buscar apelidos válidos e jogos válidos na API ao carregar o componente
  useEffect(() => {
    const fetchNicknames = async () => {
      try {

        const userId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        };

        
        const response = await axios.get("https://api-noob-react.onrender.com/api/usuarios", config);
        const nicknames = response.data.map((usuario: any) => usuario.apelido);
        setValidNicknames(nicknames);
      } catch (error) {
        console.error("Erro ao buscar apelidos:", error);
      }
    };

    const fetchGames = async () => {
      try {
        const response = await axios.get("https://api-noob-react.onrender.com/api/jogos");
        const games = response.data.map((jogo: any) => jogo.titulo);
        setValidGames(games);
      } catch (error) {
        console.error("Erro ao buscar jogos:", error);
      }
    };

    fetchNicknames();
    fetchGames();
  }, []);

  const addParticipant = () => {
    if (inputText.trim()) {
      if (validNicknames.includes(inputText.trim())) {
        setParticipants([...participants, inputText.trim()]);
        setInputText("");
      } else {
        alert("Apelido não encontrado. Por favor, insira um apelido válido.");
      }
    }
  };

  const validateGame = () => {
    if (!validGames.includes(inputJogo.trim())) {
      alert("Jogo não encontrado. Por favor, insira um jogo válido.");
    }
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  // Função para registrar a partida na API
  const registrarPartida = async () => {
    if (participants.length === 0 || !inputJogo || !inicioPartida) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
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
  
      // Transformar cada apelido em um objeto { apelido: "apelido" }
      const usuarios = participants.map(apelido => ({ apelido }));
  
      const partidaData = {
        usuarios, // Agora é uma lista de objetos
        jogo: inputJogo,
        explicacao: explicacao ? {tempoExplicacao} : "",
        inicio: inicioPartida,
      };
  
      const response = await axios.post(
        "https://api-noob-react.onrender.com/api/partidas",
        partidaData,
        config
      );
  
      if (response.status === 201) {
        Alert.alert("Sucesso", "Partida registrada com sucesso!");
        // Limpar os campos após o sucesso
        setParticipants([]);
        setInputJogo("");
        setTempoExplicacao("");
        setInicioPartida("");
        setExplicacao(false);
      }
    } catch (error) {
      console.error("Erro ao registrar a partida:", error);
      Alert.alert("Erro", "Não foi possível registrar a partida. Tente novamente.");
    }
  };  
  
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={[styles.title, localStyles.header]}>
          Registro de partida
        </Text>

        {/* Campo Participantes */}
        <Text style={styles.label}>Participantes:</Text>
        <TextInput
          placeholder="Digite o jogador a adicionar e pressione Enter..."
          style={[styles.input, localStyles.input]}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={addParticipant}
        />
        <TouchableOpacity
          style={localStyles.addButton}
          onPress={addParticipant}
        >
          <Text style={localStyles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>

        {/* Exibição dos chips de participantes */}
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

        {/* Campo Jogo */}
        <Text style={styles.label}>Jogo:</Text>
        <TextInput
          placeholder="Digite o jogo a pesquisar..."
          style={[styles.input, localStyles.input]}
          value={inputJogo}
          onChangeText={setInputJogo}
          onBlur={validateGame} // Verifica o jogo quando o campo perde o foco
        />

        {/* Explicação das Regras */}
        <View style={localStyles.explicacaoContainer}>
          <Switch
            value={explicacao}
            onValueChange={setExplicacao}
            style={localStyles.switch}
          />
          <Text style={localStyles.switchLabel}>não houve</Text>
          <Text style={styles.label}>Tempo de explicação:</Text>
          <TextInput
            placeholder="Minutos"
            style={[styles.input, localStyles.inputTime]}
            value={tempoExplicacao}
            onChangeText={setTempoExplicacao}
            editable={!explicacao}
          />
        </View>

        {/* Horário de Início */}
        <Text style={styles.label}>Início da partida:</Text>
        <TextInput
          placeholder="18:30"
          style={[styles.input, localStyles.input]}
          value={inicioPartida}
          onChangeText={setInicioPartida}
        />

        {/* Botão Registrar */}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
    marginRight: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: Theme.light.textButton,
  },
  inputTime: {
    backgroundColor: Theme.light.backgroundCard,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    width: 100,
    textAlign: "center",
  },
});

export default RegistroPartidaScreen;
