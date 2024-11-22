import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "@styles/Default";
import Header from "@/components/Header";
import ParallaxProfile from "@/components/ParallaxProfile";
import ApiWakeUp from "@/app/services/AcordarAPI";
import UserProfileDescription from "./Descricao";

// Criação do Stack Navigator
const Stack = createStackNavigator();

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

  // Função para alternar entre edição e exibição
  const handleEditToggle = () => {
    if (isEditing) {
      // Salva as alterações ao sair do modo de edição
      updateUserProfile();
    }
    setIsEditing(!isEditing);
  };

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

  const addOneDay = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Adiciona 1 dia
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  // TRECHO API -- FIM

  return (
    <View style={{ flex: 1 }}>
      {/* Exibe o cabeçalho com título */}
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
      />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Descrição"
            options={{ title: "Descrição do Perfil" }}
          >
            {(props) => (
              <UserProfileDescription
                {...props}
                user={user}
                editedUser={editedUser}
                isEditing={isEditing}
                handleEditToggle={handleEditToggle}
                setEditedUser={setEditedUser}
                addOneDay={addOneDay}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default UserProfile;
