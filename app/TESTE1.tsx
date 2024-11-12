import React, { useState } from "react";
import {
  Dimensions,
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import styles from "@styles/Default";
import { TextInputMask } from "react-native-masked-text";
import ButtonPrimary from "@components/ButtonPrimary";
import ButtonGoBack from "@/components/ButtonGoBack";
import { screens } from "@routes/Routes";
import ApiWakeUp from "@/app/services/AcordarAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme } from "@/app/styles/Theme"; // Importa o tema de cores
import Header from "@/components/Header";
import ParallaxProfile from "@/components/ParallaxProfile";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const RegisterUser: React.FC = () => {
  <ApiWakeUp />; // Mantem a API desperta

  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [capaUri, setCapaUri] = useState<string | null>(null); // Novo estado para capa
  const isEditing = () => {}; // Função vazia, serve apenas como parametro para o Parallax
  const [editedUser] = useState<any>(null);

  const pickImage = async (setImage: (uri: string | null) => void) => {
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
      setImage(result.assets[0].uri);
    }
  };

  const isPasswordStrong = (password: string) => {
    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleRegister = async () => {
    if (!nome || !apelido || !email || !senha || !confirmarSenha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    if (!isPasswordStrong(senha)) {
      Alert.alert(
        "Erro",
        "A senha deve ter pelo menos 8 caracteres, uma letra maiúscula e um caractere especial."
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("apelido", `@${apelido}`);
      formData.append("nascimento", nascimento);
      formData.append("email", email);
      formData.append("senha", senha);

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

      const response = await axios.post(
        "https://api-noob-react.onrender.com/api/usuarios",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      //
      if (response.status === 201) {
        const message = response.data.message;
        Alert.alert("Sucesso", message);

        screens.user.login();
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        Alert.alert("Erro", error.response.data.message);
      } else {
        Alert.alert(
          "Erro",
          "Houve um erro ao criar o usuário. Tente com novas credenciais!"
        );
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Exibe o cabeçalho com título */}
      <Header title="Cadastro de conta" />

      <ParallaxProfile
        id={null}
        name={nome}
        photo={imageUri}
        initialIsEditing={false}
        initialIsRegisting={false}
        isEditing={true}
        onEditChange={isEditing}
        setEditedUser={editedUser}
      >
        {/* Apelido */}
        <Text style={styles.label}>Apelido:</Text>
        <TextInput
          style={styles.input}
          value={nome}
          placeholder="Apelido"
          onChangeText={setApelido}
        />

        {/* Nascimento */}
        <Text style={styles.label}>Data de nascimento:</Text>
        <TextInputMask
          style={styles.input}
          type={"datetime"}
          options={{ format: "DD/MM/YYYY" }}
          placeholder="Data nascimento"
          value={nascimento}
          onChangeText={setNascimento}
        />

        {/* Email */}
        <Text style={styles.label}>Data de nascimento:</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Senha */}
        <Text style={styles.label}>Data de nascimento:</Text>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {/* Confirmação de sSenha */}
        <Text style={styles.label}>Data de nascimento:</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirme a senha"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        <ButtonPrimary title="Confirmar cadastrar" onPress={handleRegister} />
      </ParallaxProfile>
    </View>
  );
};

export default RegisterUser;
