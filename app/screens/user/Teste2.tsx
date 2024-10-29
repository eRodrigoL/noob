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
import IMAGES from "@routes/Routes";
import { Theme } from "@/app/styles/Theme"; // Importa o tema de cores
import Header from "@/components/Header";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const ParallaxScreen: React.FC = () => {
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
            source={IMAGES.IMAGES.fundo}
            style={localStyles.backgroundImage}
          >
            <Text style={localStyles.headerTitle}>Título</Text>
          </ImageBackground>
        </View>

        <Animated.ScrollView
          contentContainerStyle={localStyles.scrollContent}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          {/* Corpo da tela com conteúdo */}
          <View style={localStyles.bodyContainer}>
            <View>
              {/* Imagem antes do texto */}
              <Image
                source={IMAGES.IMAGES.loading1}
                style={localStyles.foto} // Estilo para a imagem
              />
            </View>
            <View>
              <Text style={localStyles.content}>
                Este é um exemplo de tela com efeito Parallax no React Native.
                Ao rolar, o fundo se move mais lentamente que o primeiro plano,
                criando um efeito de profundidade.
                {"\n\n"}
                Este{"\n\n"} é{"\n\n"} um{"\n\n"} exemplo{"\n\n"} de{"\n\n"}{" "}
                tela
                {"\n\n"} com{"\n\n"} efeito{"\n\n"} Parallax{"\n\n"} no{"\n\n"}{" "}
                React{"\n\n"} Native.{"\n\n"} Ao{"\n\n"}
                rolar,{"\n\n"} o{"\n\n"} fundo{"\n\n"} se{"\n\n"} move{"\n\n"}{" "}
                mais
                {"\n\n"} lentamente{"\n\n"} que{"\n\n"} o{"\n\n"} primeiro
                {"\n\n"} plano,{"\n\n"} criando um{"\n\n"} efeito{"\n\n"} de
                {"\n\n"} profundidade.
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
  foto: {
    width: 150, // Largura da imagem
    height: 150, // Altere para metade da altura do cabeçalho (200 / 2)
    borderWidth: 2, // Largura da borda
    borderColor: "#333", // Cor da borda
    borderRadius: 15, // Raio de arredondamento dos cantos
    alignSelf: "flex-start", // Alinha a imagem à esquerda
    marginLeft: 15, // Afasta a imagem 15 unidades da borda esquerda
    marginBottom: 16, // Espaço abaixo da imagem
    backgroundColor: "white", // Cor de fundo da imagem
    position: "absolute", // Permite o posicionamento absoluto
    top: -75, // Move a imagem para cima, para que ocupe parte do cabeçalho
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
    marginTop: 90, // Adiciona espaço acima do texto
  },
  scrollContent: {
    paddingTop: 200, // Espaço para exibir o cabeçalho
  },
  bodyContainer: {
    backgroundColor: Theme.light.background,
    flex: 1,
    padding: 16,
  },
  content: {
    fontSize: 16,
    color: "#555",
  },
});

export default ParallaxScreen;
