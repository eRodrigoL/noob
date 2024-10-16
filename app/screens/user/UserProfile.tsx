import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "@styles/Default"; // Estilos globais
import { Theme } from "@/app/styles/Theme"; // Tema de cores

const UserProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar os dados do usuário na API
  const fetchUserData = async () => {
    try {
      // Recuperar o ID e o token do AsyncStorage
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");

      if (!userId || !token) {
        Alert.alert("Erro", "ID do usuário ou token não encontrados.");
        return;
      }

      // Configurações do cabeçalho de autorização com o token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Fazer a chamada à API
      const response = await axios.get(
        `https://api-noob-react.onrender.com/api/usuarios/${userId}`,
        config
      );

      // Atualizar o estado com os dados do usuário
      setUser(response.data);
    } catch (error) {
      console.error("Erro ao buscar os dados do usuário:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
    } finally {
      setLoading(false);
    }
  };

  // UseEffect para buscar os dados quando o componente for montado
  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando dados do usuário...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Erro ao carregar os dados do usuário.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Usuário</Text>

      {/* Container da Imagem do Perfil */}
      <View style={localStyles.profileImageContainer}>
        <Image
          source={{ uri: user.foto || "https://example.com/user-image.jpg" }} // URL da imagem do perfil ou imagem default
          style={localStyles.profileImage}
        />
      </View>

      {/* Nome do Usuário */}
      <Text style={localStyles.label}>Nome:</Text>
      <Text style={localStyles.userInfoText}>{user.nome}</Text>

      {/* Apelido */}
      <Text style={localStyles.label}>Apelido:</Text>
      <Text style={localStyles.userInfoText}>{user.apelido}</Text>

      {/* Data de Nascimento */}
      <Text style={localStyles.label}>Data de Nascimento:</Text>
      <Text style={localStyles.userInfoText}>
        {new Date(user.nascimento).toLocaleDateString()}
      </Text>

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

