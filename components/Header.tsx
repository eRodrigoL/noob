import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Biblioteca de ícones
import { Theme } from "@/app/styles/Theme";
import SandwichMenu from "./SandwichMenu";
import { useFocusEffect } from "@react-navigation/native"; // Importa o hook de navegação
import { screens } from "@routes/Routes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Definição do componente Header que recebe o título como prop
const Header = ({ title }: { title: string }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [hasOpenMatch, setHasOpenMatch] = useState(false);

  // Função para verificar se há partidas em aberto
  const checkOpenMatches = async () => {
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
          `https://api-noob-react.onrender.com/api/partidas/filtro?registrador=${userId}&fim=null`,
          config
        );
        setHasOpenMatch(response.data.length > 0);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Verifica se o erro é do tipo AxiosError
        if (error.response && error.response.status === 404) {
          setHasOpenMatch(false); // Nenhuma partida em aberto
        } else {
          console.error("Erro ao verificar partidas em aberto:", error);
        }
      } else {
        console.error("Erro desconhecido:", error);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      checkOpenMatches(); // Verifica as partidas ao focar a tela
      return () => {
        setModalVisible(false); // Fecha o modal sempre que a tela perder o foco
      };
    }, [])
  );

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Função para decidir qual tela abrir ao clicar no botão de configurações
  const handleSettingsPress = () => {
    if (hasOpenMatch) {
      screens.matches.finish();
    } else {
      screens.matches.play();
    }
  };

  return (
    <View style={localStyles.headerContainer}>
      {/* Menu sanduíche à esquerda */}
      <TouchableOpacity
        style={localStyles.menuButton}
        onPress={handleOpenModal}
      >
        <Ionicons name="menu" size={30} color="black" />
      </TouchableOpacity>
      {/* Modal */}
      <SandwichMenu visible={modalVisible} onClose={handleCloseModal} />

      {/* Título centralizado */}
      <Text style={localStyles.title}>{title}</Text>

      {/* Botão de configurações à direita */}
      <TouchableOpacity
        style={localStyles.settingsButton}
        onPress={handleSettingsPress}
      >
        <Text style={localStyles.text}>🎲</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos para o cabeçalho
const localStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
    backgroundColor: Theme.light.backgroundHeader,
    height: 60,
    zIndex: 1,
  },
  menuButton: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Theme.light.text,
  },
  text: {
    fontSize: 30,
  },
  settingsButton: {
    padding: 10,
  },
});

export default Header;
