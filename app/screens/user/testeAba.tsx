import React, { useState, useEffect } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styles from "@styles/Default";
import Header from "@/components/Header";
import ParallaxProfile from "@/components/ParallaxProfile";
import ApiWakeUp from "@/app/services/AcordarAPI";

const UserProfile: React.FC = () => {
  <ApiWakeUp />; // Mantem a API desperta

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<any>(null);

  // Função para buscar os dados do usuário
  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");

      if (!userId || !token) {
        Alert.alert("Erro", "ID do usuário ou token não encontrados.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `https://api-noob-react.onrender.com/api/usuarios/${userId}`,
        config
      );

      setUser(response.data);
      setEditedUser(response.data);
    } catch (error) {
      console.error("Erro ao buscar os dados do usuário:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
    } finally {
      setLoading(false);
    }
  };

  // Função para enviar os dados atualizados
  const updateUserProfile = async () => {
    if (!editedUser || !editedUser.nome || !editedUser.email) {
      Alert.alert("Erro", "Nome e email são obrigatórios.");
      return;
    }

    try {
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");

      if (!userId || !token) {
        Alert.alert("Erro", "ID do usuário ou token não encontrados.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.append("nome", editedUser.nome);
      formData.append("email", editedUser.email);
      formData.append("nascimento", editedUser.nascimento);

      if (editedUser.foto) {
        const localUri = editedUser.foto;
        const filename = localUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename ?? "");
        const fileType = match ? `image/${match[1]}` : `image`;

        formData.append("foto", {
          uri: localUri,
          name: filename ?? "profile.jpg",
          type: fileType,
        } as any);
      }

      await axios.put(
        `https://api-noob-react.onrender.com/api/usuarios/${userId}`,
        formData,
        config
      );

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");

      // Recarregar os dados do usuário após a atualização
      fetchUserData();
    } catch (error: any) {
      if (error.response) {
        console.error("Erro no servidor:", error.response.data);
      } else if (error.request) {
        console.error("Erro de rede:", error.request);
      } else {
        console.error("Erro desconhecido:", error.message);
      }
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    }
  };

  // Função para alternar entre edição e exibição
  const handleEditToggle = () => {
    if (isEditing) {
      // Salva as alterações ao sair do modo de edição
      updateUserProfile();
    }
    setIsEditing(!isEditing);
  };

  const addOneDay = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Adiciona 1 dia
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

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
    <View style={{ flex: 1 }}>
      <Header title="Perfil" />
      <ParallaxProfile
        id={user._id}
        name={user.nome}
        photo={user.foto}
        initialIsEditing={false}
        initialIsRegisting={false}
        isEditing={isEditing}
        onEditChange={setIsEditing}
        setEditedUser={setEditedUser}
      >
        <View style={localStyles.content}>
          <Tabs
            screenOptions={{
              tabBarStyle: localStyles.tabBar,
              tabBarActiveTintColor: "#007AFF",
              tabBarInactiveTintColor: "#8E8E93",
            }}
          >
            <Tabs.Screen
              name="Descricao"
              options={{
                title: "Descrição",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person-outline" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="Desempenho"
              options={{
                title: "Desempenho",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons
                    name="stats-chart-outline"
                    size={size}
                    color={color}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="Historico"
              options={{
                title: "Histórico",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="time-outline" size={size} color={color} />
                ),
              }}
            />
          </Tabs>
        </View>
      </ParallaxProfile>
    </View>
  );
};

const localStyles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  tabBar: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
});

export default UserProfile;