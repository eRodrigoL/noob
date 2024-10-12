import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Biblioteca de ícones
import { Theme } from "@/app/styles/Colors";

// Definição do componente Header que recebe o título como prop
const Header = ({ title }: { title: string }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Menu sanduíche à esquerda */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => console.log("Menu aberto")}
      >
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>

      {/* Título centralizado */}
      <Text style={styles.title}>{title}</Text>

      {/* Botão de configurações à direita */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => console.log("Configurações abertas")}
      >
        <Ionicons name="settings" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

// Estilos para o cabeçalho
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
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
  settingsButton: {
    padding: 10,
  },
});

export default Header;
