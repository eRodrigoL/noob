import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "@styles/Default";
import Header from "@/components/Header";
import ParallaxProfile from "@/components/ParallaxProfile";
import ApiWakeUp from "@/app/services/AcordarAPI";
import { Tabs } from "expo-router";

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
      >
        <Text style={styles.label}>Apelido:</Text>
        <Text style={styles.label}>{user.apelido}</Text>

        {/* Email */}
        <Text style={styles.label}>Email:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editedUser.email}
            onChangeText={(text) =>
              setEditedUser((prevState: any) => ({
                ...prevState,
                email: text,
              }))
            }
          />
        ) : (
          <Text style={styles.label}>{user.email}</Text>
        )}

        {/* Data de Nascimento */}
        <Text style={styles.label}>Data de Nascimento:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={addOneDay(editedUser.nascimento)}
          />
        ) : (
          <Text style={styles.label}>{addOneDay(user.nascimento)}</Text>
        )}

        {/* Botão de Editar/Salvar */}
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={handleEditToggle}
        >
          <Text style={styles.buttonPrimaryText}>
            {isEditing ? "Salvar" : "Editar Perfil"}
          </Text>
        </TouchableOpacity>

        {/* Botão Cancelar visível apenas se isEditing for true */}
        {isEditing && (
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => {
              setIsEditing(false); // Sai do modo de edição
              setEditedUser(user); // Reverte as mudanças, restaurando os dados originais
            }}
          >
            <Text style={styles.buttonSecondaryText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </ParallaxProfile>
    </View>
  );
};

export default UserProfile;
