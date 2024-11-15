import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import axios from "axios";
import styles from "@styles/Default";
import { TextInputMask } from "react-native-masked-text";
import ButtonPrimary from "@components/ButtonPrimary";
import { screens } from "@routes/Routes";
import ApiWakeUp from "@/app/services/AcordarAPI";
import Header from "@/components/Header";
import ParallaxProfile from "@/components/ParallaxProfile";

const RegisterUser: React.FC = () => {
  // Estados dos campos do formulário
  const [apelido, setApelido] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [editedUser, setEditedUser] = useState<any>({ nome: "", foto: null });

  const isPasswordStrong = (password: string) => {
    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleRegister = async () => {
    if (
      !editedUser.nome || // Verifica o nome atualizado
      !apelido ||
      !email ||
      !senha ||
      !confirmarSenha
    ) {
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
      formData.append("nome", editedUser.nome);
      formData.append("apelido", `@${apelido}`);
      formData.append("nascimento", nascimento);
      formData.append("email", email);
      formData.append("senha", senha);

      if (editedUser.foto) {
        const filename = editedUser.foto.split("/").pop();
        const match = /\.(\w+)$/.exec(filename ?? "");
        const fileType = match ? `image/${match[1]}` : `image`;

        formData.append("foto", {
          uri: editedUser.foto,
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

      if (response.status === 201) {
        Alert.alert("Sucesso", response.data.message);
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
        name={editedUser.nome}
        photo={editedUser.foto}
        initialIsEditing={false}
        initialIsRegisting={true}
        setEditedUser={setEditedUser}
      >
        {/* Apelido */}
        <Text style={styles.label}>Apelido:</Text>
        <TextInput
          style={styles.input}
          value={apelido}
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
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Senha */}
        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {/* Confirmação de Senha */}
        <Text style={styles.label}>Confirmação de senha:</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirme a senha"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        <ButtonPrimary title="Confirmar cadastro" onPress={handleRegister} />
      </ParallaxProfile>
    </View>
  );
};

export default RegisterUser;