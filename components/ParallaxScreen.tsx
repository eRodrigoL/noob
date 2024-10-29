import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import IMAGES from "@routes/Routes";
import { Theme } from "@/app/styles/Theme"; // Importa o tema de cores

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const ParallaxScreen: React.FC = () => {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value * 0.5 }],
    opacity: scrollY.value < 80 ? 1 : 0, // Ocultar o cabeçalho quando rolar para baixo
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value * 0.3 }], // Menor velocidade para o plano de fundo
  }));

  return (
    <View style={localStyles.container}>
      {/* Imagem de fundo com efeito parallax */}
      <Animated.Image
        source={IMAGES.IMAGES.fundo}
        style={[localStyles.backgroundImage, backgroundStyle]}
        resizeMode="cover"
      />

      {/* Cabeçalho com Parallax */}
      <Animated.View style={[localStyles.header, headerStyle]}>
        <Text style={localStyles.headerTitle}>Título</Text>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={localStyles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Corpo da tela com conteúdo */}
        <View style={localStyles.bodyContainer}>
          <Text style={localStyles.content}>
            Este é um exemplo de tela com efeito Parallax no React Native. Ao
            rolar, o fundo se move mais lentamente que o primeiro plano, criando
            um efeito de profundidade.
            {"\n\n"}
            Este é um exemplo de tela com efeito Parallax no React Native. Ao
            rolar, o fundo se move mais lentamente que o primeiro plano, criando
            um efeito de profundidade.
            {"\n\n"}
            Adicione mais conteúdo aqui para testar a rolagem e o efeito
            parallax...
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: screenHeight * 1.7, // Altura extra para efeito parallax
  },
  header: {
    position: "absolute",
    top: 0,
    width: screenWidth,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  scrollContent: {
    paddingTop: 100, // Espaço para visualização do cabeçalho
  },
  bodyContainer: {
    backgroundColor: Theme.light.background, // Cor de fundo do corpo usando o tema
    borderRadius: 10,
    margin: 16,
    padding: 20,
  },
  content: {
    fontSize: 16,
    color: "#555",
  },
});

export default ParallaxScreen;
