import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "@styles/Default";
import { screens } from "@routes/Routes";
import ButtonGoBack from "@/components/ButtonGoBack";
import { useRouter } from "expo-router";
import ApiWakeUp from "@/app/services/AcordarAPI";
import Header from "@/components/Header";

const Login: React.FC = () => {
  <ApiWakeUp />; // Mantem a API desperta

  const router = useRouter(); // Hook para manipular rotas

  const [apelido, setApelido] = useState(""); // Estado para armazenar o apelido do usuário
  const [senha, setSenha] = useState(""); // Estado para armazenar a senha do usuário

  // Função de login, que verifica as credenciais do usuário
  const handleLogin = async () => {
    // Verifica se os campos de apelido e senha foram preenchidos
    if (!apelido || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos."); // Exibe um alerta caso os campos estejam vazios
      return;
    }

    const apelidoCorrigido = `@${apelido}`;

    try {
      // Faz uma requisição para o backend para autenticação
      const response = await axios.post(
        "https://api-noob-react.onrender.com/api/login",
        { apelido: apelidoCorrigido, senha }
      );

      // Se o status da resposta for 200, login é bem-sucedido
      if (response.status === 200) {
        const { token, usuario, msg } = response.data; // Extrai o token, informações do usuário e mensagem da resposta

        // Armazena o token e o ID do usuário no armazenamento local
        await AsyncStorage.multiSet([
          ["token", token],
          ["userId", usuario.id], // Armazena o ID do usuário
        ]);

        Alert.alert("Sucesso", msg, [
          {
            text: "OK",
            onPress: () => {
              screens.boardgame.list();
            },
          },
        ]);
      }
    } catch (error) {
      // Exibe um alerta de erro em caso de falha no login
      Alert.alert("Erro", "Apelido ou senha incorreta. Tente novamente!");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Login" />
      <View style={styles.container}>
        {/* Título da página com ícone */}
        <Text style={styles.title}>
          Noob <Text style={styles.diceIcon}>🎲</Text>
        </Text>

        {/* Campo de texto para inserção do apelido */}
        <Text style={styles.label}>Apelido:</Text>
        <TextInput
          style={styles.input}
          placeholder="Insira seu nome de usário"
          value={`@${apelido}`}
          onChangeText={(text) => {
            const sanitizedText = text.replace("@", ""); // Remove qualquer '@'
            setApelido(sanitizedText);
          }}
          autoCapitalize="none"
        />

        {/* Campo de texto para inserção da senha */}
        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          secureTextEntry // Define o campo como senha, ocultando o texto
          value={senha}
          onChangeText={setSenha} // Atualiza o estado da senha conforme o usuário digita
          placeholder=""
        />

        {/* Botão para realizar o login */}
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => {
            handleLogin();
          }}
        >
          <Text style={styles.buttonPrimaryText}>Entrar</Text>
        </TouchableOpacity>

        {/* Botão para cancelar o login */}
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => {
            router.back();
          }}
        >
          <Text style={styles.buttonPrimaryText}>Voltar</Text>
        </TouchableOpacity>

        {/* Texto e link para redirecionar para a tela de cadastro */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.signupText}>Ainda não tem uma conta? </Text>
          <TouchableOpacity onPress={screens.user.register}>
            <Text style={styles.signupLink}> Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
