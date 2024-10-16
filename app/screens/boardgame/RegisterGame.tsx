import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import styles from "@styles/Default";
import ButtonPrimary from "@components/ButtonPrimary";
import ButtonGoBack from "@/components/ButtonGoBack";
import { useRouter } from "expo-router";

const RegisterGame: React.FC = () => {
  const [titulo, setTitulo] = useState("");
  const [ano, setAno] = useState("");
  const [idade, setIdade] = useState("");
  const [designer, setDesigner] = useState("");
  const [artista, setArtista] = useState("");
  const [editora, setEditora] = useState("");
  const [digital, setDigital] = useState("");
  const [categoria, setCategoria] = useState("");
  const [componentes, setComponentes] = useState("");
  const [descricao, setDescricao] = useState("");
  const [idOriginal, setIdOriginal] = useState("");
  const [capa, setCapa] = useState<string | null>(null);

  const router = useRouter();

  // Função para selecionar uma imagem da galeria
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permissão para acessar as fotos é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // formato quadrado
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setCapa(result.assets[0].uri); // Define a URI da capa
    }
  };

  // Função para registrar o jogo
  const registerGame = async () => {
    if (!titulo) {
      Alert.alert("Erro", "O campo 'Título' é obrigatório.");
      return;
    }

    try {
      const response = await axios.post(
        "https://api-noob-react.onrender.com/api/jogos/passar",
        {
          titulo,
          ano,
          idade: parseInt(idade),
          designer,
          artista,
          editora,
          digital,
          categoria,
          componentes,
          descricao,
          idOriginal,
          capa,
        }
      );
      if (response.status === 200) {
        Alert.alert("Sucesso", "Jogo cadastrado com sucesso!");
        router.push("/"); // Redireciona após o cadastro
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao cadastrar o jogo.");
      console.error(error);
    }
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          {/* Botão de voltar */}
          <ButtonGoBack />

          <Text style={styles.title}>Registrar Jogo</Text>

          {/* Upload da capa do jogo */}
          <TouchableOpacity
            onPress={pickImage}
            style={styles.profileImageContainer}
          >
            {capa ? (
              <Image source={{ uri: capa }} style={styles.profileImage} />
            ) : (
              <Text style={styles.profileImagePlaceholder}>Adicionar Capa</Text>
            )}
          </TouchableOpacity>

          {/* Campos de entrada */}
          <TextInput
            style={styles.input}
            placeholder="Título (obrigatório)"
            value={titulo}
            onChangeText={setTitulo}
          />
          <TextInput
            style={styles.input}
            placeholder="Ano"
            value={ano}
            onChangeText={setAno}
          />
          <TextInput
            style={styles.input}
            placeholder="Idade"
            keyboardType="numeric"
            value={idade}
            onChangeText={setIdade}
          />
          <TextInput
            style={styles.input}
            placeholder="Designer"
            value={designer}
            onChangeText={setDesigner}
          />
          <TextInput
            style={styles.input}
            placeholder="Artista"
            value={artista}
            onChangeText={setArtista}
          />
          <TextInput
            style={styles.input}
            placeholder="Editora"
            value={editora}
            onChangeText={setEditora}
          />
          <TextInput
            style={styles.input}
            placeholder="Digital"
            value={digital}
            onChangeText={setDigital}
          />
          <TextInput
            style={styles.input}
            placeholder="Categoria"
            value={categoria}
            onChangeText={setCategoria}
          />
          <TextInput
            style={styles.input}
            placeholder="Componentes"
            value={componentes}
            onChangeText={setComponentes}
          />
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao}
          />
          <TextInput
            style={styles.input}
            placeholder="ID Original"
            value={idOriginal}
            onChangeText={setIdOriginal}
          />

          {/* Botão para cadastrar o jogo */}
          <ButtonPrimary title="Cadastrar Jogo" onPress={registerGame} />
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterGame;
