import React, { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Biblioteca de ícones
import { Theme } from "@/app/styles/Theme";
import SandwichMenu from "./SandwichMenu";
import { useFocusEffect } from "@react-navigation/native"; // Importa o hook de navegação
import { screens } from "@routes/Routes";

// Definição do componente Header que recebe o título como prop
const Header = ({ title }: { title: string }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Garante que o modal será fechado sempre que a tela perder o foco e reabrirá corretamente ao focar novamente.
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setModalVisible(false); // Fecha o modal sempre que a tela perder o foco
      };
    }, [])
  );

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
        onPress={() => screens.matches.play()}
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
