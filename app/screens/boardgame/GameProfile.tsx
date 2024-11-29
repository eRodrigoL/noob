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
import { useLocalSearchParams } from "expo-router";
import { images } from "@routes/Routes";
import { Theme } from "@/app/styles/Theme"; // Importa o tema de cores
import Header from "@/components/Header";
import ApiWakeUp from "@/app/services/AcordarAPI";
import ButtonPrimary from "@/components/ButtonPrimary";
import { screens } from "@routes/Routes";

// Define o tipo para os dados do jogo
interface Game {
  capa: string;
  titulo: string;
  ano: string; // Ajustado para string, conforme o modelo da API
  idade: number;
  designer: string;
  artista: string;
  editora: string;
  descricao: string;
}

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const GameProfile: React.FC = () => {
  <ApiWakeUp />; // Mantem a API desperta

  // TRECHO PARA O PARALLAX -- INICIO
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const backgroundStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value * 0.3 }], // Parallax mais lento para imagem de fundo
  }));
  // TREHO PARA O PARALLAX -- FIM

  const { id } = useLocalSearchParams<{ id?: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedGame, seteditedGame] = useState<any>(null);

  // Função para buscar os dados do boardgame
  const fetchGameData = async () => {
    try {
      if (!id) {
        Alert.alert("Erro", "ID do jogo não encontrados.");
        return;
      }

      const response = await axios.get(
        `https://api-noob-react.onrender.com/api/jogos/${id}`
      );

      setGame(response.data);
      seteditedGame(response.data);
    } catch (error) {
      console.error("Erro ao buscar os dados do jogo:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do jogo.");
    } finally {
      setLoading(false);
    }
  };

  // Função para enviar os dados atualizados do jogo
  const updateGameProfile = async () => {
    if (!editedGame || !editedGame.titulo) {
      Alert.alert("Erro", "O nome do jogo é obrigatório.");
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
      formData.append("titulo", editedGame.titulo);
      formData.append("ano", editedGame.ano);
      formData.append("idade", editedGame.idade);
      formData.append("designer", editedGame.designer);
      formData.append("artista", editedGame.artista);
      formData.append("editora", editedGame.editora);
      formData.append("descricao", editedGame.descricao);

      if (editedGame.capa) {
        const localUri = editedGame.capa;
        const filename = localUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename ?? "");
        const fileType = match ? `image/${match[1]}` : `image`;

        formData.append("capa", {
          uri: localUri,
          name: filename ?? "game.jpg",
          type: fileType,
        } as any);
      }

      // Faz a requisição para atualizar o jogo com o ID especificado
      await axios.put(
        `https://api-noob-react.onrender.com/api/jogos/${editedGame.id}`,
        formData,
        config
      );

      Alert.alert("Sucesso", "Dados do jogo atualizados com sucesso!");

      // Recarregar os dados do jogo após a atualização
      fetchGameData();
    } catch (error: any) {
      if (error.response) {
        console.error("Erro no servidor:", error.response.data);
      } else if (error.request) {
        console.error("Erro de rede:", error.request);
      } else {
        console.error("Erro desconhecido:", error.message);
      }
      Alert.alert("Erro", "Não foi possível atualizar os dados do jogo.");
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  // Função para alternar entre edição e exibição
  const handleEditToggle = () => {
    if (isEditing) {
      updateGameProfile();
    }
    setIsEditing(!isEditing);
  };

  // Função para selecionar uma nova capa
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
    seteditedGame((prevState: any) => ({ ...prevState, capa: source }));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando dados do jogo...</Text>
      </View>
    );
  }

  if (!game) {
    return (
      <View style={styles.container}>
        <Text>Erro ao carregar os dados do jogo.</Text>
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
            source={images.fundo}
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
                  uri: editedGame.capa || "https://example.com/user-image.jpg",
                }}
                style={localStyles.capa}
              />
              {isEditing && (
                <TouchableOpacity
                  style={styles.buttonPrimary}
                  onPress={handleImagePick}
                >
                  <Text style={styles.buttonPrimaryText}>
                    Selecionar nova capa
                  </Text>
                </TouchableOpacity>
              )}

              {/* Nome do jogo */}
              <Text style={localStyles.headerTitle}>{game.titulo}</Text>
            </View>

            {/* Segundo container com conteúdo, ajustando o topo para começar após a imagem */}
            <View style={[localStyles.textContainer, { marginTop: 25 }]}>
              <Text>{id}</Text>
              {/* Ano */}
              <Text style={localStyles.label}>Ano:</Text>
              {isEditing ? (
                <TextInput
                  style={localStyles.gameInfoTextEditable}
                  value={editedGame.ano}
                  onChangeText={(text) =>
                    seteditedGame((prevState: any) => ({
                      ...prevState,
                      ano: text,
                    }))
                  }
                />
              ) : (
                <Text style={localStyles.gameInfoText}>{game.ano}</Text>
              )}

              {/* Idade */}
              <Text style={localStyles.label}>Idade:</Text>
              {isEditing ? (
                <TextInput
                  style={localStyles.gameInfoTextEditable}
                  value={editedGame.idade}
                  onChangeText={(text) =>
                    seteditedGame((prevState: any) => ({
                      ...prevState,
                      idade: text,
                    }))
                  }
                />
              ) : (
                <Text style={localStyles.gameInfoText}>{game.idade}</Text>
              )}

              {/* designer */}
              <Text style={localStyles.label}>designer:</Text>
              {isEditing ? (
                <TextInput
                  style={localStyles.gameInfoTextEditable}
                  value={addOneDay(editedGame.designer)}
                />
              ) : (
                <Text style={localStyles.gameInfoText}>
                  {addOneDay(game.designer)}
                </Text>
              )}

              {/* Artista */}
              <Text style={localStyles.label}>Artista:</Text>
              {isEditing ? (
                <TextInput
                  style={localStyles.gameInfoTextEditable}
                  value={editedGame.artista}
                  onChangeText={(text) =>
                    seteditedGame((prevState: any) => ({
                      ...prevState,
                      artista: text,
                    }))
                  }
                />
              ) : (
                <Text style={localStyles.gameInfoText}>{game.artista}</Text>
              )}

              {/* Editora */}
              <Text style={localStyles.label}>Editora:</Text>
              {isEditing ? (
                <TextInput
                  style={localStyles.gameInfoTextEditable}
                  value={editedGame.editora}
                  onChangeText={(text) =>
                    seteditedGame((prevState: any) => ({
                      ...prevState,
                      editora: text,
                    }))
                  }
                />
              ) : (
                <Text style={localStyles.gameInfoText}>{game.editora}</Text>
              )}

              {/* Descrição */}
              <Text style={localStyles.label}>Descrição:</Text>
              {isEditing ? (
                <TextInput
                  style={localStyles.gameInfoTextEditable}
                  value={editedGame.descricao}
                  onChangeText={(text) =>
                    seteditedGame((prevState: any) => ({
                      ...prevState,
                      descricao: text,
                    }))
                  }
                />
              ) : (
                <Text style={localStyles.gameInfoText}>{game.descricao}</Text>
              )}

              <View style={{ alignItems: "center", marginTop: 16 }}>
                <TouchableOpacity
                  style={styles.buttonPrimary}
                  onPress={handleEditToggle}
                >
                  <Text style={styles.buttonPrimaryText}>
                    {isEditing ? "Salvar" : "Editar Perfil"}
                  </Text>
                </TouchableOpacity>
                <ButtonPrimary
                  title="Avaliar Jogo"
                  onPress={() => id && screens.boardgame.rating(id)}
                />
                <ButtonPrimary
                  title="Gráficos"
                  onPress={() => id && screens.boardgame.gameDashboard(id)}
                />
                <ButtonPrimary
                  title="Ranking"
                  onPress={() => id && screens.boardgame.ranking(id)}
                />
              </View>
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
  capa: {
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
  gameInfoText: {
    fontSize: 16,
    color: Theme.light.text,
    marginBottom: 20,
    alignSelf: "flex-start",
    marginLeft: "10%",
  },
  gameInfoTextEditable: {
    fontSize: 16,
    color: Theme.light.text,
    marginBottom: 20,
    alignSelf: "flex-start",
    marginLeft: "10%",
    borderBottomWidth: 1,
    borderBottomColor: Theme.light.text,
  },
});

export default GameProfile;
