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
import * as ImagePicker from "expo-image-picker"; // Biblioteca para seleção de imagens
import styles from "@styles/Default";
import { TextInputMask } from 'react-native-masked-text';
import { Theme } from "@/app/styles/Theme";

const UserProfile = () => {
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
        'Content-Type': 'multipart/form-data',
      },
    };

    const formData = new FormData();
    formData.append('nome', editedUser.nome);
    formData.append('email', editedUser.email);
    formData.append('nascimento', editedUser.nascimento);

    if (editedUser.foto) {
      const localUri = editedUser.foto;
      const filename = localUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename ?? '');
      const fileType = match ? `image/${match[1]}` : `image`;

      formData.append('foto', {
        uri: localUri,
        name: filename ?? 'profile.jpg',
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
      updateUserProfile();
    }
    setIsEditing(!isEditing);
  };

  // Função para selecionar uma nova foto
  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Erro", "Você precisa permitir o acesso à galeria de imagens!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      console.log("Usuário cancelou a seleção da imagem.");
      return;
    }

    const source = result.assets[0].uri;
    setEditedUser((prevState: any) => ({ ...prevState, foto: source }));
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Usuário</Text>

      {/* Imagem de Perfil */}
      <Text style={localStyles.label}>Foto:</Text>
      <View style={localStyles.profileImageContainer}>
        <Image
          source={{ uri: editedUser.foto || "https://example.com/user-image.jpg" }}
          style={localStyles.profileImage}
        />
        {isEditing && (
          <TouchableOpacity style={styles.buttonPrimary} onPress={handleImagePick}>
            <Text style={styles.buttonPrimaryText}>Selecionar nova foto</Text>
          </TouchableOpacity>
        )}
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

      {/* Apelido (não editável) */}
      <Text style={localStyles.label}>Apelido:</Text>
      <Text style={localStyles.userInfoText}>{user.apelido}</Text>

      {/* Email */}
      <Text style={localStyles.label}>Email:</Text>
      {isEditing ? (
        <TextInput
          style={localStyles.userInfoTextEditable}
          value={editedUser.email}
          onChangeText={(text) =>
            setEditedUser((prevState: any) => ({ ...prevState, email: text }))
          }
        />
      ) : (
        <Text style={localStyles.userInfoText}>{user.email}</Text>
      )}

      

      {/* Data de Nascimento */}
      <Text style={localStyles.label}>Data de Nascimento:</Text>
      {isEditing ? (
        <TextInput
          style={localStyles.userInfoTextEditable}
            value={addOneDay(editedUser.nascimento)} 
            
        />
      ) : (
        <Text style={localStyles.userInfoText}>
          {addOneDay(user.nascimento)}
        </Text>
      )}

      {/* Botão de Editar/Salvar */}
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
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
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








