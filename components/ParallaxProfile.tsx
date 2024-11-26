// Importa as bibliotecas e componentes necessários
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import styles from "@styles/Default";
import { images } from "@routes/Routes";
import { Theme } from "@/app/styles/Theme";

// Obtém as dimensões da tela para uso nos estilos
const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const heightPageCover = 200;
const initialHeightHeader = 90;
const finalHeightHeader = 180;

// Define as propriedades aceitas pelo componente ParallaxProfile
export interface ParallaxProfileProps {
  id?: string | null;
  name?: string | null;
  photo?: string | null;
  initialIsEditing?: boolean;
  initialIsRegisting?: boolean;
  children?: React.ReactNode;
  isEditing?: boolean;
  onEditChange?: React.Dispatch<React.SetStateAction<boolean>>;
  setEditedUser?: React.Dispatch<React.SetStateAction<User>>; // Função para atualizar o estado do usuário
}

interface User {
  id?: string;
  nome: string;
  foto?: string | null;
}

// Componente principal ParallaxProfile
const ParallaxProfile: React.FC<ParallaxProfileProps> = ({
  id,
  name: initialName = null,
  photo,
  isEditing = false,
  initialIsRegisting = false,
  children,
  setEditedUser,
}) => {
  // Estados locais para controle do nome e foto
  const [isRegisting, setIsRegisting] = useState<boolean>(
    !id || initialIsRegisting
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(
    photo || null
  );
  const [name, setName] = useState<string | null>(initialName);
  const [interactionEnabled, setInteractionEnabled] = useState(true); // Para travar interação

  // Efeito para atualizar o estado de registro baseado no id
  useEffect(() => {
    if (!id) {
      setIsRegisting(true);
    }
  }, [id]);

  // Função para selecionar imagem
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setEditedUser &&
        setEditedUser((prev) => ({
          ...prev,
          foto: result.assets[0].uri, // Atualiza a foto no estado global
        }));
    }
  };

  // Função para capturar alterações no nome
  const handleNomeChange = (value: string) => {
    setName(value);
    setEditedUser &&
      setEditedUser((prev) => ({
        ...prev,
        nome: value, // Atualiza o nome no estado global
      }));
  };

  // Define uma variável animada para a rolagem da página
  const scrollY = useSharedValue(0);

  // Handler para atualizar o valor de scrollY durante a rolagem
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Estilo animado para o cabeçalho, que muda com base na rolagem
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const height =
      scrollY.value < heightPageCover
        ? initialHeightHeader +
          (scrollY.value / heightPageCover) *
            (finalHeightHeader - initialHeightHeader)
        : finalHeightHeader;

    return {
      height,
      transform: [{ translateY: Math.max(scrollY.value, heightPageCover) }],
    };
  });

  // Estilo animado para o conteúdo do corpo da página
  const animatedBodyContainerStyle = useAnimatedStyle(() => {
    // Altura inicial e máxima para o bodyContainer
    const initialHeight =
      screenHeight + 4 - (heightPageCover + initialHeightHeader + 120);
    const maxHeight = screenHeight + 15 - (initialHeightHeader + 120);

    // Progresso do scroll relativo à heightPageCover
    const scrollProgress = Math.min(scrollY.value / heightPageCover, 1);

    // Calcula a altura dinâmica
    const heightDiff = maxHeight - initialHeight;
    const height = initialHeight + heightDiff * scrollProgress;

    // Deslocamento adicional
    const additionalOffset = heightPageCover; // Valor fixo que desloca o bodyContainer mais para baixo

    // Calcula o marginTop, garantindo limites e adicionando o deslocamento
    const marginTop = Math.min(
      heightPageCover + initialHeightHeader + additionalOffset - scrollY.value,
      initialHeightHeader + additionalOffset
    );

    return {
      height,
      minHeight: initialHeight,
      marginTop,
    };
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Imagem de fundo da página */}
      <View style={localStyles.PageCover}>
        <ImageBackground
          source={images.fundo}
          style={localStyles.backgroundImage}
        />
      </View>

      {/* ScrollView animado para o conteúdo da página */}
      <Animated.ScrollView
        contentContainerStyle={localStyles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View>
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

          {/* View com tamanho fixo para forçar o scroll */}
          <View style={{ height: screenHeight + initialHeightHeader }}>
            {/* Conteúdo principal da página com suporte a rolagem */}
            <Animated.View
              style={[
                localStyles.bodyContainer,
                animatedBodyContainerStyle,
                { position: "absolute", top: 0, left: 0, right: 0 },
              ]}
              pointerEvents={interactionEnabled ? "auto" : "none"}
            >
              {children}
            </Animated.View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

// Estilos locais do componente
const localStyles = StyleSheet.create({
  header: {
    //backgroundColor: Theme.light.background,
    backgroundColor: "red",
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 1,
    height: initialHeightHeader,
    justifyContent: "center",
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
  scrollContent: {
    flexGrow: 1,
    flexDirection: "column",
  },
  bodyContainer: {
    paddingTop: 0,
    flex: 1,
    padding: 0,
    backgroundColor: Theme.light.background,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "100%",
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
});

export default ParallaxProfile;
