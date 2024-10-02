import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from "@styles/Default";
import SCREENS from "@routes/Routes";
import ButtonPrimary from "@components/ButtonPrimary";
import { useRouter } from "expo-router";

const Login: React.FC = () => {
  const router = useRouter();
  const goToRegister = () => {
    SCREENS.SCREENS.user.register(router);
  };

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>
        Noob <Text style={styles.diceIcon}>🎲</Text>
      </Text>

      {/* Entrada para Apelido */}
      <Text style={styles.label}>Apelido:</Text>
      <TextInput style={styles.input} />

      {/* Entrada para Senha */}
      <Text style={styles.label}>Senha:</Text>
      <TextInput style={styles.input} secureTextEntry />

      {/* Botão de Login */}
      <ButtonPrimary title="Entrar" onPress={() => {}} />
      {/* AINDA SEM AÇÃO */}

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
