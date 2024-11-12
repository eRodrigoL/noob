import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { RadioButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "@/app/styles/Default";
import { StyleSheet } from "react-native";
import { Theme } from "@/app/styles/Theme";
import { screens } from "@/app/routes/Routes";
import { useNavigation } from '@react-navigation/native';
import ApiWakeUp from "@/app/services/AcordarAPI";

const RegistroPartidaScreen = () => {
  <ApiWakeUp />; // Mantém a API desperta

  const [victory, setVictory] = useState("");
  const [scoreType, setScoreType] = useState("");
  const [score, setScore] = useState<string | null>(null);
  const [endTime, setEndTime] = useState("");
  const [partidaId, setPartidaId] = useState(null);
  const [inputText, setInputText] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [validNicknames, setValidNicknames] = useState<string[]>([]);
  const navigation = useNavigation();

  const refreshScreen = () => {
    // Atualiza o estado para refletir a mudança na tela
    setVictory("");
    setScoreType("");
    setScore(null);
    setEndTime("");
    setParticipants([]);
    setInputText("");
  };

  useEffect(() => {
    const fetchPartidaEmAberto = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("token");

        if (userId && token) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          };

          const response = await axios.get(
            `https://api-noob-react.onrender.com/api/partidas?registrador=${userId}&fim=null`,
            config
          );

          if (response.data && response.data.length > 0) {
            const partidaAberta = response.data[0];
            setPartidaId(partidaAberta._id);
            
            const nicknames = partidaAberta.usuarios.map((user: { apelido: string }) => user.apelido);
            setValidNicknames(nicknames);
          } else {
            Alert.alert("Info", "Nenhuma partida em aberto encontrada.");
          }
        } else {
          Alert.alert("Erro", "Usuário não autenticado.");
        }
      } catch (error) {
        console.error("Erro ao buscar partida:", error);
        Alert.alert("Erro", "Não foi possível buscar a partida.");
      }
    };

    fetchPartidaEmAberto();
  }, []);

  const addParticipant = () => {
    const trimmedInput = inputText.trim();
    if (trimmedInput && validNicknames.includes(trimmedInput) && !participants.includes(trimmedInput)) {
      setParticipants([...participants, trimmedInput]);
      setInputText("");
    } else if (participants.includes(trimmedInput)) {
      Alert.alert("Info", "Participante já adicionado.");
    } else {
      Alert.alert("Erro", "Apelido não encontrado. Por favor, insira um apelido válido.");
    }
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleSaveMatch = async () => {
    if (!partidaId) return;

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      let vencedor;
      if (victory === "coletiva") {
        vencedor = validNicknames.map((apelido) => ({ apelido }));
      } else if (victory === "derrota") {
        vencedor = [{ apelido: "derrota coletiva" }];
      } else if (victory === "naoConcluido") {
        await axios.delete(`https://api-noob-react.onrender.com/api/partidas/${partidaId}`, config);
        Alert.alert("Partida não concluída", "A partida foi excluída com sucesso.");
        screens.boardgame.list(); 
        return;
      } else {
        vencedor = participants.map((apelido) => ({ apelido }));
      }

      const partidaData = {
        fim: endTime,
        vencedor,
        pontuacao: scoreType === "pontos" ? parseInt(score || "0", 10) : null,
      };

      await axios.put(
        `https://api-noob-react.onrender.com/api/partidas/${partidaId}`,
        partidaData,
        config
      );

      Alert.alert("Sucesso", "A partida foi atualizada com sucesso.");
      refreshScreen();
      screens.boardgame.list(); // Redireciona para a lista após salvar
      
    } catch (error) {
      console.error("Erro ao atualizar a partida:", error);
      Alert.alert("Erro", "Não foi possível atualizar a partida.");
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={[styles.title, localStyles.header]}>Registro de partida</Text>

        {partidaId && (
          <Text style={styles.label}>ID da partida em aberto: {partidaId}</Text>
        )}

        <Text style={styles.label}>Fim da partida:</Text>
        <TextInput
          placeholder="18:55"
          style={[styles.input, localStyles.input]}
          value={endTime}
          onChangeText={setEndTime}
        />

        <Text style={styles.label}>Vitória:</Text>
        <TextInput
          placeholder="Digite o/os vencedores e pressione Enter..."
          style={[styles.input, localStyles.input]}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={victory === "" ? addParticipant : undefined}
          editable={victory === ""}
        />
        <TouchableOpacity
          style={localStyles.addButton}
          onPress={victory === "" ? addParticipant : undefined}
          disabled={victory !== ""}
        >
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

        <Text style={styles.label}>Ou selecione as opções abaixo:</Text>
        <RadioButton.Group
          onValueChange={(newValue) => {
            setVictory(newValue);
            setParticipants([]);
          }}
          value={victory}
        >
          <View style={localStyles.radioContainer}>
            <RadioButton value="coletiva" />
            <Text style={localStyles.radioLabel}>Vitória coletiva</Text>
          </View>
          <View style={localStyles.radioContainer}>
            <RadioButton value="derrota" />
            <Text style={localStyles.radioLabel}>Derrota coletiva (o jogo venceu)</Text>
          </View>
          <View style={localStyles.radioContainer}>
            <RadioButton value="naoConcluido" />
            <Text style={localStyles.radioLabel}>Jogo não concluído</Text>
          </View>
        </RadioButton.Group>

        <Text style={styles.label}>Pontuações:</Text>
        <RadioButton.Group
          onValueChange={(newValue) => setScoreType(newValue)}
          value={scoreType}
        >
          <View style={localStyles.radioContainer}>
            <RadioButton value="semPontuacao" />
            <Text style={localStyles.radioLabel}>Sem pontuação</Text>
          </View>
          <View style={localStyles.radioContainer}>
            <RadioButton value="pontos" />
            <Text style={localStyles.radioLabel}>Pontos</Text>
          </View>
        </RadioButton.Group>

        {scoreType === "pontos" && (
          <TextInput
            placeholder="Digite a pontuação"
            style={[styles.input, localStyles.input]}
            keyboardType="numeric"
            value={score || ""}
            onChangeText={(text) => setScore(text)}
          />
        )}

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleSaveMatch}>
          <Text style={styles.buttonPrimaryText}>Salvar Partida</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => {
          screens.boardgame.list();// Redireciona para a lista ao finalizar depois
            refreshScreen();
          }}
        >
          <Text style={styles.buttonPrimaryText}>Finalizar depois</Text>
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
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  radioLabel: {
    color: Theme.light.text,
    marginLeft: 5,
  },
  addButton: {
    backgroundColor: Theme.light.backgroundButton,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  addButtonText: {
    color: Theme.light.textButton,
  },
  tagContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  tag: {
    flexDirection: "row",
    backgroundColor: Theme.light.backgroundButton,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: "center",
    marginRight: 10,
  },
  tagText: {
    color: Theme.light.textButton,
    marginRight: 5,
  },
  removeButtonText: {
    color: Theme.light.textButton,
    fontWeight: "bold",
  },
});

export default RegistroPartidaScreen;


