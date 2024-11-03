import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { images } from "@routes/Routes";
import { Theme } from "@/app/styles/Theme"; // Importa o tema de cores
import Header from "@/components/Header";
import ApiWakeUp from "@/components/AcordarAPI";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const ParallaxScreen: React.FC = () => {
  <ApiWakeUp /> // Mantem a API desperta

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const backgroundStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value * 0.3 }], // Parallax mais lento para imagem de fundo
  }));

  return (
    <View style={{ flex: 1 }}>
      {/* Exibe o cabeçalho com título */}
      <Header title="Cadastro de usuário" />
      <View style={localStyles.container}>
        {/* Cabeçalho fixo */}
        <View style={localStyles.header}>
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
          {/* Corpo da tela com conteúdo */}
          <View style={localStyles.bodyContainer}>
            {/* Primeiro container com imagem */}
            <View style={[localStyles.imageContainer, { height: 50 }]}>
              <Image source={images.loading1} style={localStyles.foto} />
              <Text style={localStyles.headerTitle}>Título</Text>
            </View>

            {/* Segundo container com conteúdo, ajustando o topo para começar após a imagem */}
            <View style={[localStyles.textContainer, { marginTop: 25 }]}>
              <Text style={localStyles.content}>
                Este é um exemplo de tela com efeito Parallax no React Native.
                Ao rolar, o fundo se move mais lentamente que o primeiro plano,
                criando um efeito de profundidade.
                {"\n\n"}
                Adicione mais conteúdo aqui para testar a rolagem e o efeito
                parallax...
              </Text>
            </View>
          </View>
        </Animated.ScrollView>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backgroundImage: {
    flex: 1, // Faz a imagem ocupar toda a área disponível
    justifyContent: "center", // Centraliza o conteúdo verticalmente
    alignItems: "center", // Centraliza o conteúdo horizontalmente
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  header: {
    position: "absolute",
    top: 0,
    width: screenWidth,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)", // Fundo semi-transparente
  },
  headerTitle: {
    fontSize: 30, // Aumenta o tamanho do texto
    fontWeight: "bold",
    color: "#333",
    marginLeft: 180, // Margem esquerda ajustada
  },
  scrollContent: {
    paddingTop: 200, // Espaço para exibir o cabeçalho
  },
  bodyContainer: {
    backgroundColor: Theme.light.background,
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    flexDirection: "row", // Adiciona flexDirection para alinhar imagem e texto na horizontal
    alignItems: "center", // Centraliza verticalmente o conteúdo
  },
  foto: {
    width: 150,
    height: 150,
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 15,
    marginLeft: 15,
    marginBottom: 16,
    backgroundColor: "white",
    position: "absolute",
    top: -90,
  },
  textContainer: {
    paddingLeft: 16,
    flexGrow: 1, // Permite que o container cresça para preencher o espaço restante
    minHeight: screenHeight, // Define a altura mínima para preencher a tela
  },
  content: {
    fontSize: 16,
    color: "#555",
  },
});

export default ParallaxScreen;
