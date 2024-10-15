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
import SCREENS from "@routes/Routes";

const Register: React.FC = () => {
  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
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
      aspect: [1, 1], 
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Função para cadastrar o usuário
  const handleRegister = async () => {

    if (!nome || !apelido || !email || !senha || !confirmarSenha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("apelido", apelido);
      formData.append("nascimento", nascimento);
      formData.append("email", email);
      formData.append("senha", senha);

      // Se a imagem foi selecionada, adicioná-la ao formData
      if (imageUri) {
        const filename = imageUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename ?? "");
        const fileType = match ? `image/${match[1]}` : `image`;

        formData.append("file", {
          uri: imageUri,
          name: filename,
          type: fileType,
        } as any);
      }

      const response = await axios.post(
        "https://api-noob-react.onrender.com/api/usuarios",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {

      const message = response.data.message;
      Alert.alert("Sucesso", message);

      SCREENS.SCREENS.user.login(router);

      }
    } catch (response) {
    console.log(response);
      Alert.alert("Erro", "Houve um erro ao criar o usuário. Tente com novas credenciais!");
    
    }
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          <ButtonGoBack />

          <View style={{ width: 100, height: 70 }}></View>

          <Text style={styles.title}>Crie sua conta:</Text>

          <TouchableOpacity
            onPress={pickImage}
            style={styles.profileImageContainer}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.profileImage} />
            ) : (
              <Text style={styles.profileImagePlaceholder}>
                Adicionar Imagem
              </Text>
            )}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            style={styles.input}
            placeholder="Apelido"
            value={apelido}
            onChangeText={setApelido}
          />

          <TextInput
            style={styles.input}
            placeholder="Data nascimento"
            value={nascimento}
            onChangeText={setNascimento}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirmar senha"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />

          <ButtonPrimary title="Cadastrar" onPress={handleRegister} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Register;
