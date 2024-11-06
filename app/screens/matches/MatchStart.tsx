import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
} from "react-native";
import { RadioButton } from "react-native-paper";
import styles from "@/app/styles/Default";
import { Theme } from "@/app/styles/Theme";
import ApiWakeUp from "@/components/AcordarAPI";
import { screens } from "@/app/routes/Routes";

const RegistroPartidaScreen = () => {
  <ApiWakeUp />; // Mantém a API desperta

  const [explicacao, setExplicacao] = useState(false);
  const [tempoExplicacao, setTempoExplicacao] = useState("");
  const [inputText, setInputText] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [victory, setVictory] = useState("");
  const [scoreType, setScoreType] = useState("");
  const [winners, setWinners] = useState<string[]>([]);
  const [winnerInput, setWinnerInput] = useState("");

  const addParticipant = () => {
    if (inputText.trim()) {
      setParticipants([...participants, inputText.trim()]);
      setInputText("");
    }
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const addWinner = () => {
    if (winnerInput.trim()) {
      setWinners([...winners, winnerInput.trim()]);
      setWinnerInput("");
    }
  };

  const removeWinner = (index: number) => {
    setWinners(winners.filter((_, i) => i !== index));
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
        />

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

        {/* Ganhadores */}
        <Text style={styles.label}>Ganhadores:</Text>
        <TextInput
          placeholder="Digite o nome do vencedor e pressione Enter..."
          style={[styles.input, localStyles.input]}
          value={winnerInput}
          onChangeText={setWinnerInput}
          onSubmitEditing={addWinner}
        />
        <TouchableOpacity style={localStyles.addButton} onPress={addWinner}>
          <Text style={localStyles.addButtonText}>Adicionar Vencedor</Text>
        </TouchableOpacity>

        {/* Exibição dos chips de vencedores */}
        <ScrollView horizontal style={localStyles.tagContainer}>
          {winners.map((winner, index) => (
            <View key={index} style={localStyles.tag}>
              <Text style={localStyles.tagText}>{winner}</Text>
              <TouchableOpacity onPress={() => removeWinner(index)}>
                <Text style={localStyles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Botão Registrar */}
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={screens.boardgame.list}
        >
          <Text style={styles.buttonPrimaryText}>Finalizar</Text>
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
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  radioLabel: {
    fontSize: 16,
    color: Theme.light.textButton,
  },
  inputTime: {
    backgroundColor: Theme.light.backgroundCard,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    width: 100, // Definindo largura específica para campo de tempo
    textAlign: "center", // Centralizando o texto no campo
  },
});

export default RegistroPartidaScreen;
