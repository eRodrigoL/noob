import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker"; // Biblioteca para seleção de imagens
import styles from "@styles/Default";
import { TextInputMask } from "react-native-masked-text";
import IMAGES from "@routes/Routes";
import { Theme } from "@/app/styles/Theme"; // Importa o tema de cores
import Header from "@/components/Header";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const UserProfile: React.FC = () => {
  // TRECHO PARA O PARALLAX -- INICIO
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const backgroundStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value * 0.3 }], // Parallax mais lento para imagem de fundo
  }));
  // TREHO PARA O PARALLAX -- FIM
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
          "Content-Type": "multipart/form-data", // Certifique-se de que o tipo de conteúdo seja multipart/form-data
        },
      };

      // Usando FormData para envio de arquivos e outros dados
      const formData = new FormData();
      formData.append("nome", editedUser.nome);
      formData.append("email", editedUser.email);
      formData.append("nascimento", editedUser.nascimento);

      if (editedUser.foto) {
        const localUri = editedUser.foto;
        const filename = localUri.split("/").pop(); // Extrai o nome do arquivo
        const match = /\.(\w+)$/.exec(filename ?? ""); // Obtém a extensão do arquivo
        const fileType = match ? `image/${match[1]}` : `image`; // Define o tipo de arquivo

        formData.append("foto", {
          uri: localUri, // URI da imagem selecionada
          name: filename ?? "profile.jpg", // Nome do arquivo
          type: fileType, // Tipo do arquivo (ajustado dinamicamente)
        } as any);
      }

      const response = await axios.put(
        `https://api-noob-react.onrender.com/api/usuarios/${userId}`,
        formData, // Envia o FormData com a imagem e os outros campos
        config
      );

      setUser(response.data);
      setEditedUser(response.data);

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
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
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Erro",
        "Você precisa permitir o acesso à galeria de imagens!"
      );
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
  // TRECHO API -- INICIO

  return (
    <View style={{ flex: 1 }}>
      {/* Exibe o cabeçalho com título */}
      <Header title="Perfil" />
      <View style={localStyles.container}>
        {/* Cabeçalho fixo */}
        <View style={localStyles.header}>
          <ImageBackground
            source={IMAGES.IMAGES.fundo}
            style={localStyles.backgroundImage}
          ></ImageBackground>
        </View>

        <Animated.ScrollView
          contentContainerStyle={localStyles.scrollContent}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          {/* Corpo da tela com conteúdo */}
          <View style={localStyles.bodyContainer}>
            {/* Primeiro container com imagem */}
            <View style={[localStyles.imageContainer, { height: 50 }]}>
              {/* Imagem de Perfil */}
              <Image
                source={{
                  uri: editedUser.foto || "https://example.com/user-image.jpg",
                }}
                style={localStyles.foto}
              />
              {isEditing && (
                <TouchableOpacity
                  style={styles.buttonPrimary}
                  onPress={handleImagePick}
                >
                  <Text style={styles.buttonPrimaryText}>
                    Selecionar nova foto
                  </Text>
                </TouchableOpacity>
              )}

              {/* Apelido (não editável) */}
              <Text style={localStyles.headerTitle}>{user.apelido}</Text>
            </View>

            {/* Segundo container com conteúdo, ajustando o topo para começar após a imagem */}
            <View style={[localStyles.textContainer, { marginTop: 25 }]}>
              {/* Nome */}
              <Text style={localStyles.label}>Nome:</Text>
              {isEditing ? (
                <TextInput
                  style={localStyles.userInfoTextEditable}
                  value={editedUser.nome}
                  onChangeText={(text) =>
                    setEditedUser((prevState: any) => ({
                      ...prevState,
                      nome: text,
                    }))
                  }
                />
              ) : (
                <Text style={localStyles.userInfoText}>{user.nome}</Text>
              )}

              {/* Email */}
              <Text style={localStyles.label}>Email:</Text>
              {isEditing ? (
                <TextInput
                  style={localStyles.userInfoTextEditable}
                  value={editedUser.email}
                  onChangeText={(text) =>
                    setEditedUser((prevState: any) => ({
                      ...prevState,
                      email: text,
                    }))
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
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={handleEditToggle}
              >
                <Text style={styles.buttonPrimaryText}>
                  {isEditing ? "Salvar" : "Editar Perfil"}
                </Text>
              </TouchableOpacity>

              <Text style={localStyles.content}>
                Demais informações...{"\n\n"}
              </Text>
            </View>
          </View>
        </Animated.ScrollView>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.light.background,
  },
  backgroundImage: {
    flex: 1, // Faz a imagem ocupar toda a área disponível
    justifyContent: "center", // Centraliza o conteúdo verticalmente
    alignItems: "center", // Centraliza o conteúdo horizontalmente
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  header: {
    position: "absolute",
    top: 0,
    width: screenWidth,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)", // Fundo semi-transparente
  },
  headerTitle: {
    fontSize: 30, // Aumenta o tamanho do texto
    fontWeight: "bold",
    color: "#333",
    marginLeft: 180, // Margem esquerda ajustada
  },
  scrollContent: {
    paddingTop: 200, // Espaço para exibir o cabeçalho
  },
  bodyContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: Theme.light.background,
  },
  imageContainer: {
    flexDirection: "row", // Adiciona flexDirection para alinhar imagem e texto na horizontal
    alignItems: "center", // Centraliza verticalmente o conteúdo
  },
  foto: {
    width: 150,
    height: 150,
    borderWidth: 5,
    borderColor: "#333",
    borderRadius: 15,
    marginLeft: 15,
    marginBottom: 16,
    backgroundColor: "white",
    position: "absolute",
    top: -90,
  },
  textContainer: {
    paddingLeft: 16,
    flex: 1, // Permite que o container ocupe o espaço restante
  },
  content: {
    fontSize: 16,
    color: "#555",
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