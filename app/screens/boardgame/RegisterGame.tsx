import React, { useState } from "react"; // Importa React e useState para gerenciar estados
import {
  ScrollView, // Importa componente para scroll
  View, // Importa componente de layout
  Text, // Importa componente de texto
  TextInput, // Importa componente para campos de entrada de texto
  TouchableOpacity, // Importa componente para toque/pressão
  Alert, // Importa componente de alerta
  Image, // Importa componente para exibir imagens
} from "react-native";
import axios from "axios"; // Importa Axios para fazer requisições HTTP
import * as ImagePicker from "expo-image-picker"; // Importa expo-image-picker para selecionar imagens da galeria
import styles from "@styles/Default"; // Importa estilos padrão
import ButtonPrimary from "@components/ButtonPrimary"; // Importa botão primário customizado
import ButtonGoBack from "@/components/ButtonGoBack"; // Importa botão de voltar
import { useRouter } from "expo-router"; // Importa roteamento do Expo

const RegisterGame: React.FC = () => {
  // Estados para armazenar valores dos campos do formulário
  const [titulo, setTitulo] = useState("");
  const [ano, setAno] = useState("");
  const [idade, setIdade] = useState("");
  const [designer, setDesigner] = useState("");
  const [artista, setArtista] = useState("");
  const [editora, setEditora] = useState("");
  const [digital, setDigital] = useState("");
  const [categoria, setCategoria] = useState("");
  const [componentes, setComponentes] = useState("");
  const [descricao, setDescricao] = useState("");
  const [idOriginal, setIdOriginal] = useState("");
  const [capa, setCapa] = useState<string | null>(null); // Estado para armazenar a capa do jogo (URI da imagem)

  const router = useRouter(); // Hook de navegação do Expo

  // Função para selecionar uma imagem da galeria
  const pickImage = async () => {
    // Solicita permissão para acessar a galeria
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permissão para acessar as fotos é necessária!"); // Exibe alerta caso a permissão seja negada
      return;
    }

    // Abre a galeria para selecionar uma imagem
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Somente imagens
      allowsEditing: true, // Permite edição
      aspect: [1, 1], // Define o formato quadrado para a imagem
      quality: 1, // Define a qualidade máxima da imagem
    });

    // Se o usuário selecionar uma imagem, armazena a URI
    if (!result.canceled && result.assets.length > 0) {
      setCapa(result.assets[0].uri); // Define a URI da imagem selecionada como capa
    }
  };

  // Função para registrar o jogo
  const registerGame = async () => {
    if (!titulo) {
      Alert.alert("Erro", "O campo 'Título' é obrigatório."); // Exibe erro se o título estiver vazio
      return;
    }

    try {
      // Faz a requisição para registrar o jogo
      const response = await axios.post(
        "https://api-noob-react.onrender.com/api/jogos/passar",
        {
          titulo, // Dados do jogo
          ano,
          idade: parseInt(idade), // Converte idade para número
          designer,
          artista,
          editora,
          digital,
          categoria,
          componentes,
          descricao,
          idOriginal,
          capa, // URI da capa
        }
      );
      if (response.status === 200) {
        Alert.alert("Sucesso", "Jogo cadastrado com sucesso!"); // Exibe sucesso
        router.push("/"); // Redireciona para a página inicial
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao cadastrar o jogo."); // Exibe erro se o cadastro falhar
      console.error(error); // Loga o erro no console
    }
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          {/* Botão de voltar */}
          <ButtonGoBack />

          {/* Título da página */}
          <Text style={styles.title}>Registrar Jogo</Text>

          {/* Upload da capa do jogo */}
          <TouchableOpacity
            onPress={pickImage}
            style={styles.profileImageContainer}
          >
            {capa ? (
              <Image source={{ uri: capa }} style={styles.profileImage} /> // Mostra a capa selecionada
            ) : (
              <Text style={styles.profileImagePlaceholder}>Adicionar Capa</Text> // Mostra texto se nenhuma capa for selecionada
            )}
          </TouchableOpacity>

          {/* Campos de entrada para os dados do jogo */}
          <TextInput
            style={styles.input}
            placeholder="Título (obrigatório)" // Campo obrigatório
            value={titulo}
            onChangeText={setTitulo} // Atualiza o estado do título
          />
          <TextInput
            style={styles.input}
            placeholder="Ano"
            value={ano}
            onChangeText={setAno} // Atualiza o estado do ano
          />
          <TextInput
            style={styles.input}
            placeholder="Idade"
            keyboardType="numeric" // Define o teclado numérico
            value={idade}
            onChangeText={setIdade} // Atualiza o estado da idade
          />
          <TextInput
            style={styles.input}
            placeholder="Designer"
            value={designer}
            onChangeText={setDesigner} // Atualiza o estado do designer
          />
          <TextInput
            style={styles.input}
            placeholder="Artista"
            value={artista}
            onChangeText={setArtista} // Atualiza o estado do artista
          />
          <TextInput
            style={styles.input}
            placeholder="Editora"
            value={editora}
            onChangeText={setEditora} // Atualiza o estado da editora
          />
          <TextInput
            style={styles.input}
            placeholder="Digital"
            value={digital}
            onChangeText={setDigital} // Atualiza o estado de digital
          />
          <TextInput
            style={styles.input}
            placeholder="Categoria"
            value={categoria}
            onChangeText={setCategoria} // Atualiza o estado da categoria
          />
          <TextInput
            style={styles.input}
            placeholder="Componentes"
            value={componentes}
            onChangeText={setComponentes} // Atualiza o estado de componentes
          />
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao} // Atualiza o estado da descrição
          />
          <TextInput
            style={styles.input}
            placeholder="ID Original"
            value={idOriginal}
            onChangeText={setIdOriginal} // Atualiza o estado do ID original
          />

          {/* Botão para cadastrar o jogo */}
          <ButtonPrimary title="Cadastrar Jogo" onPress={registerGame} />
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterGame;
