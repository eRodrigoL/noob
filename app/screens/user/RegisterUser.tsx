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
import { TextInputMask } from "react-native-masked-text";
import ButtonPrimary from "@components/ButtonPrimary";
import ButtonGoBack from "@/components/ButtonGoBack";
import { useRouter } from "expo-router";
import SCREENS from "@routes/Routes";

const RegisterUser: React.FC = () => {
  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [capaUri, setCapaUri] = useState<string | null>(null); // Novo estado para capa

  const router = useRouter();

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
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
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
      formData.append("apelido", apelido);
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

        SCREENS.SCREENS.user.login(router);
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
    <View>
      <ScrollView>
        <View style={styles.container}>
          <ButtonGoBack />
          <View style={{ width: 100, height: 70 }}></View>
          <Text style={styles.title}>Crie sua conta:</Text>
          {/* Botão para selecionar imagem de perfil */}
          <TouchableOpacity
            onPress={() => pickImage(setImageUri)}
            style={styles.profileImageContainer}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.profileImage} />
            ) : (
              <Text style={styles.profileImagePlaceholder}>
                Adicionar Foto
              </Text>
            )}
          </TouchableOpacity>
          {/* Botão para selecionar capa */}
          <TouchableOpacity
            onPress={() => pickImage(setCapaUri)}
            style={styles.profileImageContainer}
          >
            {capaUri ? (
              <Image source={{ uri: capaUri }} style={styles.profileImage} />
            ) : (
              <Text style={styles.profileImagePlaceholder}>
                Adicionar Capa
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
        <TextInputMask
            style={styles.input}
            type={"datetime"}
            options={{
              format: "DD/MM/YYYY",
            }}
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

export default RegisterUser;
