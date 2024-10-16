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

const RegisterUser: React.FC = () => {
  // Estados para armazenar os dados do usuário
  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Router para navegação entre as telas
  const router = useRouter();

  // Função responsável por abrir a galeria de imagens e permitir ao usuário escolher uma foto
  const pickImage = async () => {
    // Solicita permissão para acessar a galeria
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    // Verifica se a permissão foi concedida
    if (!permissionResult.granted) {
      alert("Permissão para acessar as fotos é necessária!");
      return;
    }

    // Abre a galeria e permite a escolha de uma imagem
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Filtra apenas imagens
      allowsEditing: true, // Permite edição da imagem selecionada
      aspect: [1, 1], // Define proporção quadrada
      quality: 1, // Define a qualidade da imagem
    });

    // Se uma imagem for selecionada, atualiza o estado com o URI da imagem
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Função que lida com o cadastro do usuário
  const handleRegister = async () => {
    // Valida se todos os campos obrigatórios estão preenchidos
    if (!nome || !apelido || !email || !senha || !confirmarSenha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Verifica se as senhas coincidem
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      // Cria um objeto FormData para enviar os dados de cadastro
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("apelido", apelido);
      formData.append("nascimento", nascimento);
      formData.append("email", email);
      formData.append("senha", senha);

      // Caso uma imagem tenha sido selecionada, inclui-a no formData
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

      // Envia os dados para o servidor para realizar o cadastro do usuário
      const response = await axios.post(
        "https://api-noob-react.onrender.com/api/usuarios",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Define o cabeçalho para envio de arquivos
          },
        }
      );

      // Se o cadastro for bem-sucedido, exibe uma mensagem de sucesso e navega para a tela de login
      if (response.status === 200) {
        const message = response.data.message;
        Alert.alert("Sucesso", message);

        SCREENS.SCREENS.user.login(router); // Redireciona para a tela de login
      }
    } catch (response) {
      // Exibe uma mensagem de erro caso ocorra falha no cadastro
      console.log(response);
      Alert.alert(
        "Erro",
        "Houve um erro ao criar o usuário. Tente com novas credenciais!"
      );
    }
  };

  return (
    // Componente principal da tela de cadastro
    <View>
      <ScrollView>
        <View style={styles.container}>
          <ButtonGoBack /> {/* Botão para voltar à tela anterior */}
          <View style={{ width: 100, height: 70 }}></View>
          <Text style={styles.title}>Crie sua conta:</Text>
          {/* Botão para selecionar uma imagem de perfil */}
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
          {/* Campos de entrada de dados do usuário */}
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
          {/* Botão de cadastro */}
          <ButtonPrimary title="Cadastrar" onPress={handleRegister} />
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterUser;
