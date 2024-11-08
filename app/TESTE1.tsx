import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
} from "react-native"; // Importação dos componentes do React Native
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"; // Importação de animações do react-native-reanimated
import * as ImagePicker from "expo-image-picker"; // Biblioteca para seleção de imagens do Expo
import styles from "@styles/Default"; // Estilos importados do projeto
import { images } from "@routes/Routes"; // Importa imagens configuradas no projeto
import { Theme } from "@/app/styles/Theme"; // Importa o tema de cores
import Header from "@/components/Header"; // Componente de cabeçalho personalizado
import ButtonPrimary from "@/components/ButtonPrimary";

// Obtem as dimensões da tela para ajustar estilos responsivos
const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const heightPageCover = 200;
const heightHeader = 90;

const ParallaxProfile: React.FC = () => {
  // Configuração do valor compartilhado scrollY, usado para controlar o efeito de parallax
  const scrollY = useSharedValue(0);

  // Função que detecta o scroll da tela e atualiza scrollY com a posição do scroll
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Estilo animado para deslocar o cabeçalho e ajustar a margem superior do bodyContainer
  const animatedHeaderStyle = useAnimatedStyle(() => {
    // Interpolação de altura entre 90 e 180 baseado no valor de scrollY
    const height =
      scrollY.value < heightPageCover
        ? 90 + (scrollY.value / heightPageCover) * 90 // altura interpolada de 90 a 180
        : 180; // Altura máxima é 180

    return {
      height,
      transform: [{ translateY: Math.max(scrollY.value, heightPageCover) }],
    };
  });

  // Estilo animado para o bodyContainer sem o salto indesejado
  const animatedBodyContainerStyle = useAnimatedStyle(() => {
    const marginTop =
      scrollY.value < heightPageCover
        ? (scrollY.value / heightPageCover) * 90 // marginTop cresce conforme scrollY
        : 90; // Mantém o valor máximo de 90 após ultrapassar o limite

    return {
      marginTop,
    };
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Componente de cabeçalho com o título "Perfil" */}
      <Header title="Perfil" />
      <View style={localStyles.container}>
        <View style={localStyles.PageCover}>
          {/* Imagem de fundo com efeito de parallax */}
          <ImageBackground
            source={images.fundo} // Define a imagem de fundo
            style={localStyles.backgroundImage} // Aplica estilos de tamanho e posição à imagem de fundo
          ></ImageBackground>
        </View>

        {/* Scroll animado para permitir o efeito de parallax */}
        <Animated.ScrollView
          contentContainerStyle={localStyles.scrollContent} // Estilo de conteúdo no ScrollView
          onScroll={scrollHandler} // Configura o handler para atualizar a posição do scroll
          scrollEventThrottle={16} // Define a taxa de atualização do evento de scroll para 60 fps
        >
          <View style={[localStyles.container]}>
            {/* Cabeçalho fixo com animação de deslocamento */}
            <Animated.View style={[localStyles.header, animatedHeaderStyle]}>
              <Image
                source={{ uri: "https://example.com/user-image.jpg" }}
                style={localStyles.foto}
              />
              <Text style={localStyles.headerTitle}>Nome</Text>
            </Animated.View>

            {/* Conteúdo rolável */}
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
      <ButtonPrimary title="Mudar" onPress={() => {}}></ButtonPrimary>
    </View>
  );
};

// Estilos personalizados para os componentes
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
    justifyContent: "center", // Centraliza o headerTitle verticalmente
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 180,
  },
  scrollContent: {
    paddingTop: 0, // Altere este valor para corresponder exatamente à altura desejada do header
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
    position: "absolute", // Faz com que a imagem fique fixa em relação ao container
    width: "100%", // Largura total da tela
    height: "100%", // Altura total da tela
  },
  PageCover: {
    position: "absolute",
    top: 0,
    width: screenWidth, // Largura total da tela
    height: heightPageCover, // Altura do cabeçalho
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)", // Fundo semitransparente
  },
});

export default ParallaxProfile;
