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
        cover={user.capa}
        initialIsEditing={false}
        initialIsRegisting={false}
        isEditing={isEditing}
        setEditedUser={setEditedUser}
      >
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: localStyles.tabBar,
            tabBarActiveTintColor: "#000",
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
            initialParams={{ user: user }}
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
      </ParallaxProfile>
    </View>
  );
};

const localStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  tabBarItemStyle: {
    flex: 1,
  },
});

export default UserProfile;
