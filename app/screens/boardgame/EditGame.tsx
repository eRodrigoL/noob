import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "@styles/Default";
import Header from "@/components/Header";
import ParallaxProfile from "@/components/ParallaxProfile";
import ApiWakeUp from "@/app/services/AcordarAPI";
import { router, useLocalSearchParams } from "expo-router";
import { screens } from "@/app/routes/Routes";

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

const EditUser: React.FC = () => {
  <ApiWakeUp />; // Mantem a API desperta

  const { id } = useLocalSearchParams<{ id?: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [editedGame, seteditedGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(true);

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
  // TRECHO API -- FIM

  return (
    <View style={{ flex: 1 }}>
      {/* Exibe o cabeçalho com título */}
      <Header title="Perfil" />

      <ParallaxProfile
        id={id}
        name={`${game.titulo}`}
        photo={game.capa}
        cover={null}
        initialIsEditing={false}
        initialIsRegisting={false}
        isEditing={isEditing}
        setEdited={seteditedGame}
      >
        {/* Ano */}
        <Text style={styles.label}>Ano:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editedGame.ano}
            onChangeText={(text) =>
              seteditedGame((prevState: any) => ({
                ...prevState,
                ano: text,
              }))
            }
          />
        ) : (
          <Text style={styles.label}>{game.ano}</Text>
        )}

        {/* Idade */}
        <Text style={styles.label}>Idade:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editedGame.idade}
            onChangeText={(text) =>
              seteditedGame((prevState: any) => ({
                ...prevState,
                idade: text,
              }))
            }
          />
        ) : (
          <Text style={styles.label}>{game.idade}</Text>
        )}

        {/* designer */}
        <Text style={styles.label}>designer:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={addOneDay(editedGame.designer)}
          />
        ) : (
          <Text style={styles.label}>{addOneDay(game.designer)}</Text>
        )}

        {/* Artista */}
        <Text style={styles.label}>Artista:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editedGame.artista}
            onChangeText={(text) =>
              seteditedGame((prevState: any) => ({
                ...prevState,
                artista: text,
              }))
            }
          />
        ) : (
          <Text style={styles.label}>{game.artista}</Text>
        )}

        {/* Editora */}
        <Text style={styles.label}>Editora:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editedGame.editora}
            onChangeText={(text) =>
              seteditedGame((prevState: any) => ({
                ...prevState,
                editora: text,
              }))
            }
          />
        ) : (
          <Text style={styles.label}>{game.editora}</Text>
        )}

        {/* Descrição */}
        <Text style={styles.label}>Descrição:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editedGame.descricao}
            onChangeText={(text) =>
              seteditedGame((prevState: any) => ({
                ...prevState,
                descricao: text,
              }))
            }
          />
        ) : (
          <Text style={styles.label}>{game.descricao}</Text>
        )}

        {/* Botão de Editar/Salvar */}
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => {
            updateGameProfile();
            router.back();
          }}
        >
          <Text style={styles.buttonPrimaryText}>Salvar</Text>
        </TouchableOpacity>

        {/* Botão Cancelar visível apenas se isEditing for true */}
        {isEditing && (
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => {
              seteditedGame(game); // Reverte as mudanças, restaurando os dados originais
              router.back();
            }}
          >
            <Text style={styles.buttonSecondaryText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </ParallaxProfile>
    </View>
  );
};

export default EditUser;