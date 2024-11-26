import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import axios from "axios"; // Biblioteca para realizar requisições HTTP
import styles from "@styles/Default"; // Importa estilos pré-definidos
import { TextInputMask } from "react-native-masked-text"; // Componente para entradas com máscara
import ButtonPrimary from "@components/ButtonPrimary"; // Botão customizado
import { screens } from "@routes/Routes"; // Função para navegação entre telas
import ApiWakeUp from "@/app/services/AcordarAPI"; // Serviço para "acordar" a API
import Header from "@/components/Header"; // Componente de cabeçalho
import ParallaxProfile from "@/components/ParallaxProfile"; // Componente para exibição de perfil com efeitos

const RegisterUser: React.FC = () => {
  <ApiWakeUp />; // Mantém a API ativa durante o uso do app

  // Definindo estados para os campos do formulário
  const [apelido, setApelido] = useState(""); // Armazena o apelido
  const [nascimento, setNascimento] = useState(""); // Armazena a data de nascimento
  const [email, setEmail] = useState(""); // Armazena o email
  const [senha, setSenha] = useState(""); // Armazena a senha
  const [confirmarSenha, setConfirmarSenha] = useState(""); // Armazena a confirmação da senha
  const [editedUser, setEditedUser] = useState<any>({ nome: "", foto: null, capa: null }); // Armazena informações editadas do usuário

  // Função para verificar a força da senha
  const isPasswordStrong = (password: string) => {
    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Requer: 1 letra maiúscula, 1 número, 1 caractere especial, mínimo 8 caracteres
    return strongPasswordRegex.test(password);
  };

  // Função para manipular o registro do usuário
  const handleRegister = async () => {
    // Validações básicas
    if (
      !editedUser.nome || // Verifica se o nome foi preenchido
      !apelido || // Verifica o apelido
      !email || // Verifica o email
      !senha || // Verifica a senha
      !confirmarSenha // Verifica a confirmação da senha
    ) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios."); // Exibe mensagem de erro
      return;
    }

    // Valida se as senhas coincidem
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    // Verifica a força da senha
    if (!isPasswordStrong(senha)) {
      Alert.alert(
        "Erro",
        "A senha deve ter pelo menos 8 caracteres, uma letra maiúscula e um caractere especial."
      );
      return;
    }

    try {
      // Cria o objeto FormData para envio dos dados
      const formData = new FormData();
      formData.append("nome", editedUser.nome);
      formData.append("apelido", `@${apelido}`); // Adiciona um '@' antes do apelido
      formData.append("nascimento", nascimento); // Adiciona a data de nascimento
      formData.append("email", email); // Adiciona o email
      formData.append("senha", senha); // Adiciona a senha

      // Verifica e anexa a foto do usuário, se disponível
      if (editedUser.foto) {
        const filename = editedUser.foto.split("/").pop(); // Extrai o nome do arquivo
        const match = /\.(\w+)$/.exec(filename ?? ""); // Verifica a extensão
        const fileType = match ? `image/${match[1]}` : `image`; // Define o tipo do arquivo

        formData.append("foto", {
          uri: editedUser.foto,
          name: filename,
          type: fileType,
        } as any); // Adiciona a foto ao FormData
      }

      if (editedUser.capa) {
        const filename = editedUser.capa.split("/").pop(); // Extrai o nome do arquivo
        const match = /\.(\w+)$/.exec(filename ?? ""); // Verifica a extensão
        const fileType = match ? `image/${match[1]}` : `image`; // Define o tipo do arquivo

        formData.append("capa", {
          uri: editedUser.capa,
          name: filename,
          type: fileType,
        } as any); // Adiciona a foto ao FormData
      }

      // Faz a requisição HTTP para o endpoint da API
      const response = await axios.post(
        "https://api-noob-react.onrender.com/api/usuarios",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Verifica se o registro foi bem-sucedido
      if (response.status === 201) {
        Alert.alert("Sucesso", response.data.message); // Exibe mensagem de sucesso
        screens.user.login(); // Redireciona para a tela de login
      }
    } catch (error: any) {
      // Trata erros na requisição
      if (error.response && error.response.status === 401) {
        Alert.alert("Erro", error.response.data.message); // Exibe erro de autenticação
      } else {
        Alert.alert(
          "Erro",
          "Houve um erro ao criar o usuário. Tente com novas credenciais!"
        ); // Exibe erro genérico
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Componente de cabeçalho com título */}
      <Header title="Cadastro de conta" />

      <ParallaxProfile
        id={null} // Nenhum ID inicial
        name={editedUser.nome} // Nome editado do usuário
        photo={editedUser.foto} // Foto do usuário
        cover={editedUser.capa} // Foto do usuário
        initialIsEditing={false} // Indica que o perfil não está sendo editado
        initialIsRegisting={true} // Indica que está no modo de registro
        setEditedUser={setEditedUser} // Função para atualizar os dados do usuário
      >
        {/* Campo para o apelido */}
        <Text style={styles.label}>Apelido:</Text>
        <TextInput
          style={styles.input}
          value={apelido}
          placeholder="Apelido"
          onChangeText={setApelido}
        />

        {/* Campo para a data de nascimento */}
        <Text style={styles.label}>Data de nascimento:</Text>
        <TextInputMask
          style={styles.input}
          type={"datetime"} // Máscara para data e hora
          options={{ format: "DD/MM/YYYY" }}
          placeholder="Data nascimento"
          value={nascimento}
          onChangeText={setNascimento}
        />

        {/* Campo para o email */}
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Campo para a senha */}
        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry // Oculta o texto da senha
          value={senha}
          onChangeText={setSenha}
        />

        {/* Campo para a confirmação da senha */}
        <Text style={styles.label}>Confirmação de senha:</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirme a senha"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        {/* Botão para confirmar o cadastro */}
        <ButtonPrimary title="Confirmar cadastro" onPress={handleRegister} />
      </ParallaxProfile>
    </View>
  );
};

export default RegisterUser;
