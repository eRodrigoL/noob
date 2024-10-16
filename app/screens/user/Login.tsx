import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "@styles/Default";
import SCREENS from "@routes/Routes";
import ButtonPrimary from "@components/ButtonPrimary";
import ButtonGoBack from "@/components/ButtonGoBack";
import { useRouter } from "expo-router";

const Login: React.FC = () => {
  const router = useRouter();

  // Estados para armazenar apelido e senha
  const [apelido, setApelido] = useState("");
  const [senha, setSenha] = useState("");

  // Função para redirecionar para a tela de cadastro
  const goToRegister = () => {
    SCREENS.SCREENS.user.register(router);
  };

  // Função de login
  const handleLogin = async () => {
    if (!apelido || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await axios.post(
        "https://api-noob-react.onrender.com/api/login",
        { apelido, senha }
      );

      if (response.status === 200) {
        const { token, usuario, msg } = response.data;

        // Armazenar o token no AsyncStorage
        await AsyncStorage.setItem("token", token);

        // Exibir mensagem de sucesso
        Alert.alert("Sucesso", msg);

        // Redirecionar o usuário, por exemplo, para a página inicial
        // COLOCAR AQUI TELA A SER REDIRECIONADA
        //router.push("/home");
      }
    } catch (error) {
      // Exibir mensagem de erro
        Alert.alert("Erro", "Apelido ou senha incorreta. Tente novamente!");
    }
  };

  return (
    <View style={styles.container}>
      {/* Botão de voltar (X) */}
      <ButtonGoBack />

      {/* Título */}
      <Text style={styles.title}>
        Noob <Text style={styles.diceIcon}>🎲</Text>
      </Text>

      {/* Entrada para Apelido */}
      <Text style={styles.label}>Apelido:</Text>
      <TextInput
        style={styles.input}
        value={apelido}
        onChangeText={setApelido} // Atualiza o estado do apelido
      />

      {/* Entrada para Senha */}
      <Text style={styles.label}>Senha:</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={senha}
        onChangeText={setSenha} // Atualiza o estado da senha
      />

      {/* Botão de Login */}
      <ButtonPrimary title="Entrar" onPress={handleLogin} />

      {/* Texto de Cadastrar-se */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.signupText}>Ainda não tem uma conta? </Text>
        <TouchableOpacity onPress={goToRegister}>
          <Text style={styles.signupLink}> Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

