// Importa as bibliotecas e componentes necessários para o funcionamento do componente
import React, { useState, useEffect } from "react";
import {
  View, // Para criar contêineres de layout
  Text, // Para exibir texto na tela
  TextInput, // Para entrada de texto pelo usuário
  StyleSheet, // Para aplicar estilos personalizados
  Dimensions, // Para obter informações de tamanho da tela
  Image, // Para exibir imagens
  ImageBackground, // Para imagens de fundo
  ScrollView, // Para permitir rolagem no conteúdo
  TouchableOpacity, // Para criar botões clicáveis
} from "react-native";
import Animated, {
  useAnimatedScrollHandler, // Para manipular eventos de rolagem animados
  useAnimatedStyle, // Para definir estilos animados
  useSharedValue, // Para gerenciar valores compartilhados de animação
} from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker"; // Para permitir a seleção de imagens da galeria do dispositivo
import { Theme } from "@/app/styles/Theme"; // Importa a paleta de cores do tema

// Obtém as dimensões da tela e define valores constantes para o cabeçalho e cobertura da página
const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const heightPageCover = 200; // Altura da cobertura da página
const heightHeader = 90; // Altura do cabeçalho

// Define as propriedades aceitas pelo componente ParallaxProfile
export interface ParallaxProfileProps {
  id?: string | null; // Identificador opcional do perfil
  name?: string | null; // Nome inicial no perfil
  photo?: string | null; // URL opcional para a foto do perfil
  cover?: string | null; // URL opcional para a capa do perfil
  initialIsEditing?: boolean; // Se o modo de edição é ativado inicialmente
  initialIsRegisting?: boolean; // Se o modo de registro é ativado inicialmente
  children?: React.ReactNode; // Elementos filhos para exibição adicional
  isEditing?: boolean; // Controle externo para ativar o modo de edição
  onEditChange?: React.Dispatch<React.SetStateAction<boolean>>; // Callback para alterações no modo de edição
  setEditedUser?: React.Dispatch<React.SetStateAction<User>>; // Função para atualizar o estado global do usuário
}

// Define a interface para o objeto User
interface User {
  id?: string; // Identificador do perfil
  nome: string; // Nome no perfil
  foto?: string | null; // URL opcional da foto do perfil
  capa?: string | null; // URL opcional da capa do perfil
}

// Componente funcional principal ParallaxProfile
const ParallaxProfile: React.FC<ParallaxProfileProps> = ({
  id, // Identificador do perfil
  name: initialName = null, // Nome inicial no perfil
  photo, // Foto inicial do perfil
  cover, // Capa inicial do do perfil
  isEditing = false, // Define o estado inicial do modo de edição
  initialIsRegisting = false, // Define o estado inicial do modo de registro
  children, // Elementos filhos adicionais
  setEditedUser, // Função para atualizar o estado do usuário
}) => {
  // Estados locais para controlar o registro, foto e nome do perfil
  const [isRegisting, setIsRegisting] = useState<boolean>(
    !id || initialIsRegisting // Modo de registro é ativado se o id não existir
  );
  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState<
    string | null
  >(
    cover || null // Inicializa a imagem selecionada com a foto ou null
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(
    photo || null // Inicializa a imagem selecionada com a capa ou null
  );
  const [name, setName] = useState<string | null>(initialName); // Nome inicial no perfil

  // Efeito colateral para ativar o modo de registro caso o id seja indefinido
  useEffect(() => {
    if (!id) {
      setIsRegisting(true);
    }
  }, [id]);

  // CAPA - Função para selecionar uma imagem da galeria do dispositivo
  const pickBackgroudImage = async () => {
    // Solicita permissão para acessar a galeria
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permissão para acessar a galeria é necessária!"); // Exibe um alerta se a permissão for negada
      return;
    }

    // Abre a galeria para o usuário selecionar uma imagem
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Apenas imagens
      allowsEditing: true, // Permite edição básica da imagem
      aspect: [16, 9], // Define a proporção da imagem
      quality: 1, // Define a qualidade máxima da imagem
    });

    // Atualiza o estado local e global com a imagem selecionada
    if (!result.canceled) {
      setSelectedBackgroundImage(result.assets[0].uri); // Define a URI da imagem selecionada
      setEditedUser &&
        setEditedUser((prev) => ({
          ...prev,
          capa: result.assets[0].uri, // Atualiza a foto no estado global
        }));
    }
  };

  // FOTO - Função para selecionar uma imagem da galeria do dispositivo
  const pickImage = async () => {
    // Solicita permissão para acessar a galeria
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permissão para acessar a galeria é necessária!"); // Exibe um alerta se a permissão for negada
      return;
    }

    // Abre a galeria para o usuário selecionar uma imagem
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Apenas imagens
      allowsEditing: true, // Permite edição básica da imagem
      aspect: [1, 1], // Define a proporção da imagem
      quality: 1, // Define a qualidade máxima da imagem
    });

    // Atualiza o estado local e global com a imagem selecionada
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri); // Define a URI da imagem selecionada
      setEditedUser &&
        setEditedUser((prev) => ({
          ...prev,
          foto: result.assets[0].uri, // Atualiza a foto no estado global
        }));
    }
  };

  // Função para atualizar o nome no estado local e global
  const handleNomeChange = (value: string) => {
    setName(value); // Atualiza o estado local com o novo nome
    setEditedUser &&
      setEditedUser((prev) => ({
        ...prev,
        nome: value, // Atualiza o nome no estado global
      }));
  };

  // Valor compartilhado para a posição de rolagem da página
  const scrollY = useSharedValue(0);

  // Manipulador de eventos para rolagem, que atualiza o valor de scrollY
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y; // Define a posição atual da rolagem
  });

  // Estilo animado para o cabeçalho, baseado na posição de rolagem
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const height =
      scrollY.value < heightPageCover
        ? 90 + (scrollY.value / heightPageCover) * 90 // Calcula altura proporcional à rolagem
        : 180;

    return {
      height,
      transform: [{ translateY: Math.max(scrollY.value, heightPageCover) }],
    };
  });

  // Estilo animado para o corpo principal, ajustando o espaçamento superior
  const animatedBodyContainerStyle = useAnimatedStyle(() => {
    const marginTop =
      scrollY.value < heightPageCover
        ? (scrollY.value / heightPageCover) * 90 // Calcula a margem proporcional à rolagem
        : 90;

    return {
      marginTop,
    };
  });

  // função para fazer com que a capa suba com o scroll
  const animatedCoverStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: scrollY.value > 0 ? -scrollY.value : 0, // Move para cima com o scroll
        },
      ],
    };
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Capa*/}
      {(isEditing || isRegisting) && (
        <View style={localStyles.PageCover}>
          <ImageBackground
            source={{
              uri: selectedBackgroundImage
                ? selectedBackgroundImage
                : "https://example.com/user-image.jpg", // Imagem padrão
            }}
            style={localStyles.backgroundImage}
          />
          <Text style={localStyles.editHint}>Toque para alterar a capa</Text>
        </View>
      )}
      {!(isEditing || isRegisting) && (
        <ImageBackground
          source={{
            uri: selectedBackgroundImage
              ? selectedBackgroundImage
              : "https://example.com/user-image.jpg", // Imagem padrão
          }}
          style={localStyles.backgroundImage}
        />
      )}

      <Animated.View
        style={[localStyles.PageCover, { zIndex: 5 }, animatedCoverStyle]}
      >
        {(isEditing || isRegisting) && (
          <TouchableOpacity
            onPress={pickBackgroudImage}
            style={localStyles.coverTouchable}
          />
        )}
      </Animated.View>

      {/* ScrollView animado para o conteúdo da página */}
      <Animated.ScrollView
        contentContainerStyle={localStyles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View style={[localStyles.container]}>
          {/* Cabeçalho animado que exibe a imagem de perfil e o nome */}
          <Animated.View style={[localStyles.header, animatedHeaderStyle]}>
            {/* Local da foto*/}
            {(isEditing || isRegisting) && (
              <TouchableOpacity
                onPress={pickImage}
                style={localStyles.fotoContainer}
              >
                <Image
                  source={{
                    uri: selectedImage
                      ? selectedImage
                      : "https://example.com/user-image.jpg", // imagem padrão se foto for null
                  }}
                  style={localStyles.foto}
                />
              </TouchableOpacity>
            )}
            {!(isEditing || isRegisting) && (
              <Image
                source={{
                  uri: selectedImage
                    ? selectedImage
                    : "https://example.com/user-image.jpg", // imagem padrão se foto for null
                }}
                style={localStyles.foto}
              />
            )}

            {/* Local do nome */}
            {isEditing || isRegisting ? (
              <TextInput
                style={localStyles.headerTitleInput}
                placeholder="Digite o nome aqui..."
                value={name || ""}
                onChangeText={handleNomeChange}
              />
            ) : (
              <Text style={localStyles.headerTitle}>
                {name || "Nome não informado"}
              </Text>
            )}
          </Animated.View>

          {/* Conteúdo principal da página com suporte a rolagem */}
          <View style={[{ marginTop: heightPageCover + heightHeader }]}>
            <ScrollView contentContainerStyle={localStyles.scrollContent}>
              <View style={localStyles.bodyContainer}>
                <Animated.View
                  style={[
                    localStyles.bodyContainer,
                    animatedBodyContainerStyle,
                  ]}
                >
                  {children}
                </Animated.View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

// Estilos locais do componente
const localStyles = StyleSheet.create({
  container: { flex: 1, padding: 0 },
  header: {
    backgroundColor: Theme.light.background,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 1,
    height: heightHeader,
    justifyContent: "center",
    borderTopWidth: 3,
    borderColor: Theme.light.text,
  },
  coverTouchable: {
    position: "absolute",
    top: 0,
    left: 0,
    marginLeft: 170,
    width: screenWidth - 170,
    height: "100%",
  },
  PageCover: {
    position: "absolute",
    top: 0,
    width: screenWidth,
    height: heightPageCover,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  fotoContainer: {
    width: 150,
    height: 150,
    borderColor: Theme.light.text,
    borderRadius: 15,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  foto: {
    width: 150,
    height: 150,
    borderWidth: 5,
    borderColor: Theme.light.text,
    borderRadius: 15,
    backgroundColor: "white",
    position: "absolute",
    bottom: 15,
    left: 15,
  },
  headerTitleInput: {
    fontSize: 30,
    color: Theme.light.text,
    marginLeft: 195,
    borderWidth: 1,
    right: 15,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: Theme.light.text,
    marginLeft: 180,
  },
  scrollContent: { paddingTop: 0 },
  bodyContainer: {
    paddingTop: 0,
    flex: 1,
    padding: 16,
    backgroundColor: Theme.light.background,
  },
  editHint: {
    color: "white",
    textAlign: "center",
    marginTop: 0,
    fontSize: 30,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});

export default ParallaxProfile;
