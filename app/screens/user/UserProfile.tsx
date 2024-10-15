import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import styles from "@styles/Default"; // Importando os estilos globais
import { Theme } from "@/app/styles/Theme"; // Importando o tema de cores

const UserProfile = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Usuário</Text>

      {/* Container da Imagem do Perfil */}
      <View style={localStyles.profileImageContainer}>
        <Image
          source={{ uri: "https://example.com/user-image.jpg" }} // URL da imagem do perfil
          style={localStyles.profileImage}
        />
      </View>

      {/* Nome do Usuário */}
      <Text style={localStyles.label}>Nome:</Text>
      <Text style={localStyles.userInfoText}>Nome do Usuário</Text>

      {/* Apelido */}
      <Text style={localStyles.label}>Apelido:</Text>
      <Text style={localStyles.userInfoText}>@apelido</Text>

      {/* Data de Nascimento */}
      <Text style={localStyles.label}>Data de Nascimento:</Text>
      <Text style={localStyles.userInfoText}>01/01/1990</Text>

      {/* Botão de editar perfil */}
      <TouchableOpacity style={styles.buttonPrimary}>
        <Text style={styles.buttonPrimaryText}>Editar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Theme.light.secondary.backgroundButton,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  label: {
    fontSize: 18,
    color: Theme.light.text,
    alignSelf: "flex-start",
    marginLeft: "10%",
    marginBottom: 8,
  },
  userInfoText: {
    fontSize: 16,
    color: Theme.light.text,
    marginBottom: 20,
    alignSelf: "flex-start",
    marginLeft: "10%",
  },
});

export default UserProfile;
