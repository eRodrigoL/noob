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
import { StyleSheet } from 'react-native';
import { Theme } from "@/app/styles/Theme";
import { screens } from "@/app/routes/Routes";

const RegistroPartidaScreen = () => {
  const [victory, setVictory] = useState("");
  const [scoreType, setScoreType] = useState("");
  const [partidaId, setPartidaId] = useState(null);

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

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={[styles.title, localStyles.header]}>
          Registro de partida
        </Text>

        {/* Exibir o ID da partida em aberto, se encontrado */}
        {partidaId && (
          <Text style={styles.label}>ID da partida em aberto: {partidaId}</Text>
        )}

        {/* Horário de Fim */}
        <Text style={styles.label}>Fim da partida:</Text>
        <TextInput
          placeholder="18:55"
          style={[styles.input, localStyles.input]}
        />

        {/* Vitória */}
        <Text style={styles.label}>Vitória:</Text>
        <RadioButton.Group
          onValueChange={(newValue) => setVictory(newValue)}
          value={victory}
        >
          <View style={localStyles.radioContainer}>
            <RadioButton value="individual" />
            <Text style={localStyles.radioLabel}>Vitória individual</Text>
          </View>
          <View style={localStyles.radioContainer}>
            <RadioButton value="grupo" />
            <Text style={localStyles.radioLabel}>Vitória em grupo</Text>
          </View>
          <View style={localStyles.radioContainer}>
            <RadioButton value="coletiva" />
            <Text style={localStyles.radioLabel}>Vitória coletiva</Text>
          </View>
          <View style={localStyles.radioContainer}>
            <RadioButton value="derrota" />
            <Text style={localStyles.radioLabel}>
              Derrota coletiva (o jogo venceu)
            </Text>
          </View>
          <View style={localStyles.radioContainer}>
            <RadioButton value="naoConcluido" />
            <Text style={localStyles.radioLabel}>Jogo não concluído</Text>
          </View>
        </RadioButton.Group>


          {/* Pontuação */}
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
            <RadioButton value="tempo" />
            <Text style={localStyles.radioLabel}>Tempo</Text>
          </View>
          <View style={localStyles.radioContainer}>
            <RadioButton value="pontos" />
            <Text style={localStyles.radioLabel}>Pontos</Text>
          </View>
        </RadioButton.Group>

  {/* Pontuação */}
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
            <RadioButton value="tempo" />
            <Text style={localStyles.radioLabel}>Tempo</Text>
          </View>
          <View style={localStyles.radioContainer}>
            <RadioButton value="pontos" />
            <Text style={localStyles.radioLabel}>Pontos</Text>
          </View>
        </RadioButton.Group>

        {/* Botão Registrar */}
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={screens.boardgame.list}
        >
          <Text style={styles.buttonPrimaryText}>Finalizar partida</Text>
        </TouchableOpacity>

        {/* Botão Registrar */}
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={screens.boardgame.list}
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
});

export default RegistroPartidaScreen;

