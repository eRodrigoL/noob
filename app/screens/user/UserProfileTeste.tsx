import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import IMAGES from "@routes/Routes";

const { height: screenHeight } = Dimensions.get("window");

const ParallaxScreen: React.FC = () => {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const backgroundStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value * 0.5 }],
  }));

  const foregroundStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value * 1.0 }],
  }));

  return (
    <View style={localStyles.container}>
      {/* Imagem de fundo com efeito parallax */}
      <Animated.Image
        source={IMAGES.IMAGES.fundo}
        style={[localStyles.backgroundImage, backgroundStyle]}
        resizeMode="cover"
      />

      <Animated.ScrollView
        contentContainerStyle={localStyles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Animated.View style={[localStyles.foreground, foregroundStyle]}>
          <Text style={localStyles.title}>Parallax Effect</Text>
          <Text style={localStyles.content}>
            Este é um exemplo de tela com efeito Parallax no React Native. Ao
            rolar, o fundo se move mais lentamente que o primeiro plano, criando
            um efeito de profundidade.
            {"\n\n"}
            Este é um exemplo de tela com efeito Parallax no React Native. Ao
            rolar, o fundo se move mais lentamente que o primeiro plano, criando
            um efeito de profundidade.
            {"\n\n"}
            Este é um exemplo de tela com efeito Parallax no React Native. Ao
            rolar, o fundo se move mais lentamente que o primeiro plano, criando
            um efeito de profundidade.
            {"\n\n"}
            Este é um exemplo de tela com efeito Parallax no React Native. Ao
            rolar, o fundo se move mais lentamente que o primeiro plano, criando
            um efeito de profundidade.
            {"\n\n"}
            Este é um exemplo de tela com efeito Parallax no React Native. Ao
            rolar, o fundo se move mais lentamente que o primeiro plano, criando
            um efeito de profundidade.
            {"\n\n"}
            Este é um exemplo de tela com efeito Parallax no React Native. Ao
            rolar, o fundo se move mais lentamente que o primeiro plano, criando
            um efeito de profundidade.
            {"\n\n"}
            Este é um exemplo de tela com efeito Parallax no React Native. Ao
            rolar, o fundo se move mais lentamente que o primeiro plano, criando
            um efeito de profundidade.
            {"\n\n"}
            Este é um exemplo de tela com efeito Parallax no React Native. Ao
            rolar, o fundo se move mais lentamente que o primeiro plano, criando
            um efeito de profundidade.
            {"\n\n"}
            Este é um exemplo de tela com efeito Parallax no React Native. Ao
            rolar, o fundo se move mais lentamente que o primeiro plano, criando
            um efeito de profundidade.
            {"\n\n"}
            Este é um exemplo de tela com efeito Parallax no React Native. Ao
            rolar, o fundo se move mais lentamente que o primeiro plano, criando
            um efeito de profundidade.
            {"\n\n"}
            Este é um exemplo de tela com efeito Parallax no React Native. Ao
            rolar, o fundo se move mais lentamente que o primeiro plano, criando
            um efeito de profundidade.
            {"\n\n"}
            Este é um exemplo de tela com efeito Parallax no React Native. Ao
            rolar, o fundo se move mais lentamente que o primeiro plano, criando
            um efeito de profundidade.
            {"\n\n"}
            Este é um exemplo de tela com efeito Parallax no React Native. Ao
            rolar, o fundo se move mais lentamente que o primeiro plano, criando
            um efeito de profundidade.
            {"\n\n"}
            Este é um exemplo de tela com efeito Parallax no React Native. Ao
            rolar, o fundo se move mais lentamente que o primeiro plano, criando
            um efeito de profundidade.
            {"\n\n"}
            Este é um exemplo de tela com efeito Parallax no React Native. Ao
            rolar, o fundo se move mais lentamente que o primeiro plano, criando
            um efeito de profundidade.
            {"\n\n"}
            Este é um exemplo de tela com efeito Parallax no React Native. Ao
            rolar, o fundo se move mais lentamente que o primeiro plano, criando
            um efeito de profundidade.
            {"\n\n"}
            Este é um exemplo de tela com efeito Parallax no React Native. Ao
            rolar, o fundo se move mais lentamente que o primeiro plano, criando
            um efeito de profundidade.
            {"\n\n"}
            Este é um exemplo de tela com efeito Parallax no React Native. Ao
            rolar, o fundo se move mais lentamente que o primeiro plano, criando
            um efeito de profundidade.
            {"\n\n"}
            Este é um exemplo de tela com efeito Parallax no React Native. Ao
            rolar, o fundo se move mais lentamente que o primeiro plano, criando
            um efeito de profundidade.
          </Text>
        </Animated.View>
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
    height: screenHeight * 1.7, // Altura extra para rolagem suave
  },
  scrollContent: {
    paddingTop: screenHeight * 0.5, // Espaço para visualizar o fundo
  },
  foreground: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    margin: 16,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    fontSize: 16,
    color: "#555",
  },
});

export default ParallaxScreen;
