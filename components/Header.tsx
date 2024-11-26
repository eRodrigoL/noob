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
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticação

  // Função para verificar se o usuário está autenticado
  const checkAuthentication = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");
      setIsAuthenticated(!!userId && !!token); // Verifica se ambos existem
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      setIsAuthenticated(false);
    }
  };

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
      checkAuthentication(); // Verifica autenticação ao focar
      if (isAuthenticated) {
        checkOpenMatches(); // Verifica partidas abertas apenas se autenticado
      }
      return () => {
        setModalVisible(false); // Fecha o modal sempre que a tela perder o foco
      };
    }, [isAuthenticated])
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

    {/* Espaço reservado para o ícone de configurações */}
    <View style={localStyles.iconPlaceholder}>
      {isAuthenticated && (
        <TouchableOpacity
          style={localStyles.settingsButton}
          onPress={handleSettingsPress}
        >
          <Text style={localStyles.text}>🎲</Text>
        </TouchableOpacity>
      )}
    </View>
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
    textAlign: "center", // Garante que o texto é centralizado
    flex: 1, // Ocupa o espaço restante entre os botões
  },
  text: {
    fontSize: 30,
  },
  settingsButton: {
    padding: 10,
  },
  iconPlaceholder: {
    width: 55, // Largura equivalente ao ícone
    alignItems: "center", // Centraliza o ícone (se exibido)
  },
});


export default Header;
