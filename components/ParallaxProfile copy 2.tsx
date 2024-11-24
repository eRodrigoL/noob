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
  interpolate,
} from "react-native-reanimated";
import { Extrapolation } from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import styles from "@styles/Default";
import { images } from "@routes/Routes";
import { Theme } from "@/app/styles/Theme";

// Obtém as dimensões da tela para uso nos estilos
const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const heightPageCover = 200;
const heightHeader = 90;

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
    const translateY = interpolate(
      scrollY.value,
      [0, heightPageCover],
      [0, -heightPageCover],
      "clamp"
    );

    return {
      transform: [{ translateY }],
    };
  });

  // Estilo animado para o conteúdo do corpo da página
  const animatedBodyContainerStyle = useAnimatedStyle(() => {
    const marginTop =
      scrollY.value < heightPageCover
        ? (scrollY.value / heightPageCover) * 90
        : 90;

    return {
      marginTop,
    };
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Imagem de fundo da página */}
      <View style={[localStyles.PageCover, { zIndex: 5 }]}>
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
        {/* Conteúdo principal */}
        {/* Conteúdo principal da página com suporte a rolagem */}
        <ScrollView contentContainerStyle={localStyles.scrollContent}>
          <View style={localStyles.bodyContainer}>
            <Animated.View
              style={[localStyles.bodyContainer, animatedBodyContainerStyle]}
            >
              {children}
            </Animated.View>
          </View>
        </ScrollView>
      </Animated.ScrollView>
    </View>
  );
};

// Estilos locais do componente
const localStyles = StyleSheet.create({
  container: { flex: 1, padding: 0 },
  header: {
    backgroundColor: "red",
    position: "absolute",
    top: heightPageCover,
    left: 0,
    right: 0,
    zIndex: 3,
    justifyContent: "flex-end",
    paddingBottom: 10,
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
  },
  bodyContainer: {
    flex: 1,
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
    zIndex: 1,
  },
});

export default ParallaxProfile;
