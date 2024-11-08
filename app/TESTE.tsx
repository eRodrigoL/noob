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

// Obtem as dimensões da tela para ajustar estilos responsivos
const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const UserProfile: React.FC = () => {
  // Configuração do valor compartilhado scrollY, usado para controlar o efeito de parallax
  const scrollY = useSharedValue(0);

  // Função que detecta o scroll da tela e atualiza scrollY com a posição do scroll
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Estilo animado para o fundo, aplicando o efeito de parallax
  const backgroundStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value * 0.3 }], // Parallax com base na posição do scroll
  }));

  return (
    <View style={{ flex: 1 }}>
      {/* Componente de cabeçalho com o título "Perfil" */}
      <Header title="Perfil" />
      <View style={localStyles.container}>
        <View style={localStyles.header}>
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
          <View style={localStyles.container}>
            {/* Cabeçalho fixo */}
            <View style={localStyles.headerContainer}>
              <Image
                source={{ uri: "https://example.com/user-image.jpg" }}
                style={localStyles.foto}
              />

              <Text style={localStyles.headerTitle}>Nome</Text>
            </View>

            {/* Conteúdo rolável */}
            <ScrollView contentContainerStyle={localStyles.scrollContent}>
              <View style={localStyles.bodyContainer}>
                <View style={[localStyles.textContainer, { marginTop: 25 }]}>
                  <Text style={localStyles.content}>
                    A{"\n\n"}B{"\n\n"}C{"\n\n"}D{"\n\n"}E{"\n\n"}F{"\n\n"}G
                    {"\n\n"}H{"\n\n"}I{"\n\n"}J{"\n\n"}K{"\n\n"}L{"\n\n"}M
                    {"\n\n"}N{"\n\n"}O{"\n\n"}P{"\n\n"}Q{"\n\n"}R{"\n\n"}S
                    {"\n\n"}T{"\n\n"}U{"\n\n"}V{"\n\n"}W{"\n\n"}X{"\n\n"}Y
                    {"\n\n"}Z
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </Animated.ScrollView>
      </View>
    </View>
  );
};

// Estilos personalizados para os componentes
const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: "#b7fffb",
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 1,
    height: 85, // Define o tamanho do headerContainer para 50
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
    bottom: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 180,
  },
  scrollContent: {
    paddingTop: 70, // Altere este valor para corresponder exatamente à altura desejada do headerContainer
  },
  bodyContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
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
  header: {
    position: "absolute",
    top: 0,
    width: screenWidth, // Largura total da tela
    height: 200, // Altura do cabeçalho
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)", // Fundo semitransparente
  },
});

export default UserProfile;
