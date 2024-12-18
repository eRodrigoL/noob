import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import styles from "@styles/Default";
import ButtonPrimary from "@components/ButtonPrimary";
import ButtonGoBack from "@/components/ButtonGoBack";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiWakeUp from "@/app/services/AcordarAPI";
import { screens } from "@routes/Routes";

const RegisterGame: React.FC = () => {
  <ApiWakeUp />; // Mantem a API desperta

  // Estados para armazenar os dados do jogo
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
  const [imageUri, setImageUri] = useState<string | null>(null); // Foto
  const [capaUri, setCapaUri] = useState<string | null>(null); // Capa

  const router = useRouter();

  // Função responsável por abrir a galeria de imagens para escolher a foto
  const pickImage = async (
    setImageCallback: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permissão para acessar as fotos é necessária!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageCallback(result.assets[0].uri);
    }
  };

  // Função que lida com o cadastro do jogo
  const gameRegister = async () => {
    if (!titulo) {
      Alert.alert("Erro", "O campo 'Título' é obrigatório.");
      return;
    }

    try {
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");

      if (!userId || !token) {
        Alert.alert("Erro", "ID do usuário ou token não encontrados.");
        return;
      }

      // Cria um FormData para o envio dos dados
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("ano", ano);
      formData.append("idade", idade);
      formData.append("designer", designer);
      formData.append("artista", artista);
      formData.append("editora", editora);
      formData.append("digital", digital);
      formData.append("categoria", categoria);
      formData.append("componentes", componentes);
      formData.append("descricao", descricao);
      formData.append("idOriginal", idOriginal);

      // Adiciona a foto e a capa no FormData, caso tenham sido escolhidas
      if (imageUri) {
        const filename = imageUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename ?? "");
        const fileType = match ? `image/${match[1]}` : `image`;
        formData.append("foto", {
          uri: imageUri,
          name: filename,
          type: fileType,
        } as any);
      }

      if (capaUri) {
        const filename = capaUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename ?? "");
        const fileType = match ? `image/${match[1]}` : `image`;
        formData.append("capa", {
          uri: capaUri,
          name: filename,
          type: fileType,
        } as any);
      }

      // Envia a requisição com os dados para o backend
      const response = await axios.post(
        "https://api-noob-react.onrender.com/api/jogos",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        const message = response.data.msg;
        Alert.alert("Sucesso", message);
        //router.push("/success"); // Redireciona para uma página de sucesso
      }
    } catch (error) {
      Alert.alert("Erro", "Houve um erro ao criar o jogo. Tente novamente!");
    }
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          <ButtonGoBack />
          <View style={{ width: 100, height: 70 }}></View>
          <Text style={styles.title}>Registrar Jogo:</Text>

          {/* Selecionar a foto */}
          <TouchableOpacity
            onPress={() => pickImage(setImageUri)}
            style={styles.profileImageContainer}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.profileImage} />
            ) : (
              <Text style={styles.profileImagePlaceholder}>Adicionar Foto</Text>
            )}
          </TouchableOpacity>

          {/* Selecionar a capa */}
          <TouchableOpacity
            onPress={() => pickImage(setCapaUri)}
            style={styles.profileImageContainer}
          >
            {capaUri ? (
              <Image source={{ uri: capaUri }} style={styles.profileImage} />
            ) : (
              <Text style={styles.profileImagePlaceholder}>Adicionar Capa</Text>
            )}
          </TouchableOpacity>

          {/* Campos de entrada do jogo */}
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
          <ButtonPrimary title="Cadastrar Jogo" onPress={gameRegister} />
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterGame;
