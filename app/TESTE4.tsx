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
  TouchableOpacity, // Importar TouchableOpacity para capturar toques na imagem
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker"; // Biblioteca para seleção de imagens do Expo
import styles from "@styles/Default";
import { images } from "@routes/Routes";
import { Theme } from "@/app/styles/Theme";
import Header from "@/components/Header";
import ButtonPrimary from "@/components/ButtonPrimary";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const heightPageCover = 200;
const heightHeader = 90;

const ParallaxProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isRegisting, setIsRegisting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Estado para guardar a imagem selecionada
  const [name, setName] = useState(""); // Estado para armazenar o nome digitado

  const handleButtonPress = () => {
    if (isEditing) {
      setIsEditing(false);
      setIsRegisting(true);
    } else if (isRegisting) {
      setIsEditing(false);
      setIsRegisting(false);
    } else {
      setIsEditing(true);
      setIsRegisting(false);
    }
  };

  useEffect(() => {
    console.log("isEditing: " + isEditing);
    console.log("isRegisting: " + isRegisting);
  }, [isEditing, isRegisting]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Ativa a edição para cortar a imagem
      aspect: [1, 1], // Configura a proporção 1:1
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri); // Guarda a URI da imagem selecionada
    }
  };

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    const height =
      scrollY.value < heightPageCover
        ? 90 + (scrollY.value / heightPageCover) * 90
        : 180;

    return {
      height,
      transform: [{ translateY: Math.max(scrollY.value, heightPageCover) }],
    };
  });

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
      <Header title="Perfil" />
      <View style={localStyles.container}>
        <View style={localStyles.PageCover}>
          <ImageBackground
            source={images.fundo}
            style={localStyles.backgroundImage}
          ></ImageBackground>
        </View>

        <Animated.ScrollView
          contentContainerStyle={localStyles.scrollContent}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          <View style={[localStyles.container]}>
            <Animated.View style={[localStyles.header, animatedHeaderStyle]}>
              {isEditing || isRegisting ? (
                <TouchableOpacity
                  onPress={pickImage}
                  style={localStyles.fotoContainer}
                >
                  <Image
                    source={{
                      uri: selectedImage
                        ? selectedImage
                        : "https://example.com/user-image.jpg",
                    }}
                    style={localStyles.foto}
                  />
                </TouchableOpacity>
              ) : (
                <Image
                  source={{
                    uri: selectedImage
                      ? selectedImage
                      : "https://example.com/user-image.jpg",
                  }}
                  style={localStyles.foto}
                />
              )}
              {/* Renderiza TextInput se for editing ou registering, senão mostra o nome */}
              {isEditing || isRegisting ? (
                <TextInput
                  style={localStyles.headerTitleInput}
                  placeholder="Digite o nome aqui..."
                  value={name}
                  onChangeText={setName} // Atualiza o nome conforme o usuário digita
                />
              ) : (
                <Text style={localStyles.headerTitle}>{name || "Nome"}</Text>
              )}
              <TextInput placeholder=""></TextInput>
            </Animated.View>

            <View style={[{ marginTop: heightPageCover + heightHeader }]}>
              <ScrollView contentContainerStyle={localStyles.scrollContent}>
                <View style={localStyles.bodyContainer}>
                  <Animated.View
                    style={[
                      localStyles.bodyContainer,
                      animatedBodyContainerStyle,
                    ]}
                  >
                    <View style={localStyles.textContainer}>
                      <Text style={localStyles.content}>
                        A{"\n\n"}B{"\n\n"}C{"\n\n"}D{"\n\n"}E{"\n\n"}F{"\n\n"}G
                        {"\n\n"}H{"\n\n"}I{"\n\n"}J{"\n\n"}K{"\n\n"}L{"\n\n"}M
                        {"\n\n"}N{"\n\n"}O{"\n\n"}P{"\n\n"}Q{"\n\n"}R{"\n\n"}S
                        {"\n\n"}T{"\n\n"}U{"\n\n"}V{"\n\n"}W{"\n\n"}X{"\n\n"}Y
                        {"\n\n"}Z
                      </Text>
                    </View>
                  </Animated.View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Animated.ScrollView>
      </View>
      <ButtonPrimary
        title={isEditing ? "Editando" : isRegisting ? "Registrando" : "Nada"}
        onPress={handleButtonPress}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  header: {
    backgroundColor: Theme.light.background,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 1,
    height: heightHeader,
    justifyContent: "center",
  },
  fotoContainer: {
    width: 150,
    height: 150,
    borderColor: "#333",
    borderRadius: 15,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  foto: {
    width: 150,
    height: 150,
    borderWidth: 5,
    borderColor: "#333",
    borderRadius: 15,
    backgroundColor: "white",
    position: "absolute",
    bottom: 15,
    left: 15,
  },
  headerTitleInput: {
    fontSize: 30,
    color: "#333",
    marginLeft: 195,
    borderWidth: 1,
    right: 15,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 180,
  },
  scrollContent: {
    paddingTop: 0,
  },
  bodyContainer: {
    paddingTop: 0,
    flex: 1,
    padding: 16,
    backgroundColor: Theme.light.background,
  },
  textContainer: {
    paddingLeft: 16,
  },
  content: {
    fontSize: 16,
    color: "#555",
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
