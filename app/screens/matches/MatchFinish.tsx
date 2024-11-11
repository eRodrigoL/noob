import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { RadioButton } from "react-native-paper";
import styles from "@/app/styles/Default";
import { Theme } from "@/app/styles/Theme";
import { screens } from "@/app/routes/Routes";
import ApiWakeUp from "@/app/services/AcordarAPI";

const RegistroPartidaScreen = () => {
  <ApiWakeUp />; // Mantém a API desperta

  const [victory, setVictory] = useState("");
  const [scoreType, setScoreType] = useState("");

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={[styles.title, localStyles.header]}>
          Registro de partida
        </Text>

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
