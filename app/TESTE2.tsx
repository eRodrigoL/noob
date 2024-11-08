import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
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
            <View style={{ backgroundColor: "#b7fffb" }}>
              {/* Container para a imagem do usuário e nome */}
              <View style={[localStyles.imageContainer, { height: 50 }]}>
                <Image
                  source={{
                    uri: "https://example.com/user-image.jpg", // URL da imagem do perfil do usuário
                  }}
                  style={localStyles.foto} // Estilo da imagem do perfil
                />
                {/* Nome do usuário */}
                <Text style={localStyles.headerTitle}>Nome</Text>
              </View>
            </View>

            {/* Container com informações adicionais do perfil */}
            <View style={localStyles.bodyContainer}>
              <View style={[localStyles.textContainer, { marginTop: 25 }]}>
                <Text style={localStyles.content}>
                  {/* Informações adicionais */}A{"\n\n"}B{"\n\n"}C{"\n\n"}D
                  {"\n\n"}E{"\n\n"}F{"\n\n"}G{"\n\n"}H{"\n\n"}I{"\n\n"}J{"\n\n"}
                  K{"\n\n"}L{"\n\n"}M{"\n\n"}N{"\n\n"}O{"\n\n"}P{"\n\n"}Q
                  {"\n\n"}R{"\n\n"}S{"\n\n"}T{"\n\n"}U{"\n\n"}V{"\n\n"}W{"\n\n"}
                  X{"\n\n"}Y{"\n\n"}Z
                </Text>
              </View>
            </View>
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
    backgroundColor: Theme.light.background, // Cor de fundo do tema
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
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333", // Cor do texto
    marginLeft: 180, // Distância do início da tela
  },
  scrollContent: {
    paddingTop: 200, // Espaço no topo para ajustar o conteúdo ao cabeçalho
  },
  bodyContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: Theme.light.background, // Cor de fundo do tema
  },
  imageContainer: {
    flexDirection: "row", // Organiza imagem e nome em linha
    alignItems: "center",
  },
  foto: {
    width: 150, // Largura da foto do usuário
    height: 150, // Altura da foto do usuário
    borderWidth: 5,
    borderColor: "#333", // Borda escura ao redor da imagem
    borderRadius: 15, // Bordas arredondadas
    marginLeft: 15,
    marginBottom: 16,
    backgroundColor: "white", // Fundo branco na foto do usuário
    position: "absolute", // Posição fixa em relação ao container
    top: -90, // Move a imagem para cima
  },
  textContainer: {
    paddingLeft: 16,
    flex: 1,
    backgroundColor: Theme.light.background,
  },
  content: {
    fontSize: 16,
    color: "#555", // Cor do texto
  },
  label: {
    fontSize: 18,
    color: Theme.light.text, // Cor de texto do tema
    alignSelf: "flex-start",
    marginLeft: "10%", // Margem à esquerda
    marginBottom: 8,
  },
  userInfoText: {
    fontSize: 16,
    color: Theme.light.text, // Cor do texto
    marginBottom: 20,
    alignSelf: "flex-start",
    marginLeft: "10%",
  },
  userInfoTextEditable: {
    fontSize: 16,
    color: Theme.light.text, // Cor do texto
    marginBottom: 20,
    alignSelf: "flex-start",
    marginLeft: "10%",
    borderBottomWidth: 1, // Linha inferior para indicar campo editável
    borderBottomColor: "#ccc", // Cor da linha inferior
  },
});

export default UserProfile;
