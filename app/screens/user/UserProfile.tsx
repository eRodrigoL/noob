import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "@styles/Default";
import { Theme } from "@/app/styles/Theme";

const UserProfile = () => {
  const [user, setUser] = useState<any>(null); // Estado para armazenar os dados do usuário
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar se está em modo de edição
  const [editedUser, setEditedUser] = useState<any>(null); // Estado para armazenar os dados editados

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
      setEditedUser(response.data); // Inicializa o estado de edição com os dados atuais
    } catch (error) {
      console.error("Erro ao buscar os dados do usuário:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Lógica para salvar os dados editados pode ser adicionada aqui
      Alert.alert("Perfil salvo com sucesso!");
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Usuário</Text>

      <View style={localStyles.profileImageContainer}>
        <Image
          source={{ uri: user.foto || "https://example.com/user-image.jpg" }}
          style={localStyles.profileImage}
        />
      </View>

      {/* Nome */}
      <Text style={localStyles.label}>Nome:</Text>
      {isEditing ? (
        <TextInput
          style={localStyles.userInfoTextEditable}
          value={editedUser.nome}
          onChangeText={(text) =>
            setEditedUser((prevState: any) => ({ ...prevState, nome: text }))
          }
        />
      ) : (
        <Text style={localStyles.userInfoText}>{user.nome}</Text>
      )}

      {/* Apelido */}
      <Text style={localStyles.label}>Apelido:</Text>
      {isEditing ? (
        <TextInput
          style={localStyles.userInfoTextEditable}
          value={editedUser.apelido}
          onChangeText={(text) =>
            setEditedUser((prevState: any) => ({ ...prevState, apelido: text }))
          }
        />
      ) : (
        <Text style={localStyles.userInfoText}>{user.apelido}</Text>
      )}

      {/* Data de Nascimento */}
      <Text style={localStyles.label}>Data de Nascimento:</Text>
      {isEditing ? (
        <TextInput
          style={localStyles.userInfoTextEditable}
          value={new Date(editedUser.nascimento)
            .toISOString()
            .substring(0, 10)} // Formato YYYY-MM-DD
          onChangeText={(text) =>
            setEditedUser((prevState: any) => ({
              ...prevState,
              nascimento: text,
            }))
          }
        />
      ) : (
        <Text style={localStyles.userInfoText}>
          {new Date(user.nascimento).toLocaleDateString()}
        </Text>
      )}

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleEditToggle}>
        <Text style={styles.buttonPrimaryText}>
          {isEditing ? "Salvar" : "Editar Perfil"}
        </Text>
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
  userInfoTextEditable: {
    fontSize: 16,
    color: Theme.light.text,
    marginBottom: 20,
    alignSelf: "flex-start",
    marginLeft: "10%",
    borderBottomWidth: 1,
    borderBottomColor: Theme.light.text,
  },
});

export default UserProfile;

