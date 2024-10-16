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
  const router = useRouter(); // Hook para manipular rotas

  const [apelido, setApelido] = useState(""); // Estado para armazenar o apelido do usuário
  const [senha, setSenha] = useState(""); // Estado para armazenar a senha do usuário

  // Função para navegar para a tela de cadastro de usuário
  const goToRegisterUser = () => {
    SCREENS.SCREENS.user.register(router); // Chama a função de navegação para a tela de cadastro
  };

  // Função de login, que verifica as credenciais do usuário
  const handleLogin = async () => {
    // Verifica se os campos de apelido e senha foram preenchidos
    if (!apelido || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos."); // Exibe um alerta caso os campos estejam vazios
      return;
    }

    try {
      // Faz uma requisição para o backend para autenticação
      const response = await axios.post(
        "https://api-noob-react.onrender.com/api/login",
        { apelido, senha }
      );

      // Se o status da resposta for 200, login é bem-sucedido
      if (response.status === 200) {
        const { token, usuario, msg } = response.data; // Extrai o token, informações do usuário e mensagem da resposta

        // Armazena o token e o ID do usuário no armazenamento local
        await AsyncStorage.multiSet([
          ["token", token],
          ["userId", usuario.id], // Armazena o ID do usuário
        ]);

        Alert.alert("Sucesso", msg); // Exibe mensagem de sucesso

        // Redireciona para a tela inicial ou outra tela <{ARRUMAR: inserir tela desejada}>
        //router.push("/home");
      }
    } catch (error) {
      // Exibe um alerta de erro em caso de falha no login
      Alert.alert("Erro", "Apelido ou senha incorreta. Tente novamente!");
    }
  };

  return (
    <View style={styles.container}>
      {/* Componente para o botão de voltar */}
      <ButtonGoBack />

      {/* Título da página com ícone */}
      <Text style={styles.title}>
        Noob <Text style={styles.diceIcon}>🎲</Text>
      </Text>

      {/* Campo de texto para inserção do apelido */}
      <Text style={styles.label}>Apelido:</Text>
      <TextInput
        style={styles.input}
        value={apelido}
        onChangeText={setApelido} // Atualiza o estado do apelido conforme o usuário digita
      />

      {/* Campo de texto para inserção da senha */}
      <Text style={styles.label}>Senha:</Text>
      <TextInput
        style={styles.input}
        secureTextEntry // Define o campo como senha, ocultando o texto
        value={senha}
        onChangeText={setSenha} // Atualiza o estado da senha conforme o usuário digita
      />

      {/* Botão para realizar o login */}
      <ButtonPrimary title="Entrar" onPress={handleLogin} />

      {/* Texto e link para redirecionar para a tela de cadastro */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.signupText}>Ainda não tem uma conta? </Text>
        <TouchableOpacity onPress={goToRegisterUser}>
          <Text style={styles.signupLink}> Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
