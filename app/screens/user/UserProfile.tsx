// Importa as bibliotecas necessárias e módulos do React e React Native
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Armazenamento local
import axios from "axios"; // Requisições HTTP
import styles from "@styles/Default"; // Estilos globais
import { Theme } from "@/app/styles/Theme"; // Tema de cores

// Componente de perfil de usuário
const UserProfile = () => {
  const [user, setUser] = useState<any>(null); // Estado para armazenar os dados do usuário
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  // Função para buscar os dados do usuário na API
  const fetchUserData = async () => {
    try {
      // Recupera o ID e o token do usuário do armazenamento local
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");

      // Verifica se o ID ou o token estão ausentes
      if (!userId || !token) {
        Alert.alert("Erro", "ID do usuário ou token não encontrados.");
        return;
      }

      // Configura o cabeçalho da requisição com o token de autorização
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Faz a requisição à API para obter os dados do usuário
      const response = await axios.get(
        `https://api-noob-react.onrender.com/api/usuarios/${userId}`,
        config
      );

      // Atualiza o estado com os dados recebidos
      setUser(response.data);
    } catch (error) {
      // Exibe um alerta caso ocorra um erro na requisição
      console.error("Erro ao buscar os dados do usuário:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
    } finally {
      // Define o estado de carregamento como falso após a requisição
      setLoading(false);
    }
  };

  // UseEffect para buscar os dados do usuário quando o componente for montado
  useEffect(() => {
    fetchUserData();
  }, []);

  // Exibe um indicador de carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando dados do usuário...</Text>
      </View>
    );
  }

  // Exibe uma mensagem de erro se os dados do usuário não forem encontrados
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Erro ao carregar os dados do usuário.</Text>
      </View>
    );
  }

  // Retorna a interface do perfil de usuário com os dados carregados
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Usuário</Text>

      {/* Container da imagem de perfil */}
      <View style={localStyles.profileImageContainer}>
        <Image
          source={{ uri: user.foto || "https://example.com/user-image.jpg" }} // Exibe a imagem do usuário ou uma padrão
          style={localStyles.profileImage}
        />
      </View>

      {/* Exibe o nome do usuário */}
      <Text style={localStyles.label}>Nome:</Text>
      <Text style={localStyles.userInfoText}>{user.nome}</Text>

      {/* Exibe o apelido do usuário */}
      <Text style={localStyles.label}>Apelido:</Text>
      <Text style={localStyles.userInfoText}>{user.apelido}</Text>

      {/* Exibe a data de nascimento do usuário */}
      <Text style={localStyles.label}>Data de Nascimento:</Text>
      <Text style={localStyles.userInfoText}>
        {new Date(user.nascimento).toLocaleDateString()} {/* Formata a data */}
      </Text>

      {/* Botão para editar o perfil */}
      <TouchableOpacity style={styles.buttonPrimary}>
        <Text style={styles.buttonPrimaryText}>Editar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos locais para o perfil de usuário
const localStyles = StyleSheet.create({
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60, // Deixa a imagem redonda
    backgroundColor: Theme.light.secondary.backgroundButton, // Fundo cinza para a imagem
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20, // Espaçamento inferior
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60, // Imagem circular
  },
  label: {
    fontSize: 18, // Tamanho da fonte
    color: Theme.light.text, // Cor do texto
    alignSelf: "flex-start", // Alinha à esquerda
    marginLeft: "10%", // Espaçamento à esquerda
    marginBottom: 8, // Espaçamento inferior
  },
  userInfoText: {
    fontSize: 16, // Tamanho da fonte para informações do usuário
    color: Theme.light.text, // Cor do texto
    marginBottom: 20, // Espaçamento inferior
    alignSelf: "flex-start", // Alinha à esquerda
    marginLeft: "10%", // Espaçamento à esquerda
  },
});

// Exporta o componente UserProfile
export default UserProfile;
