import React from "react";
import { View, Text } from "react-native";
import ParallaxProfile from "./TESTE1";

const ProfileScreen = () => {
  return (
    <ParallaxProfile
      id="456" // Passe um id se necessário
      initialIsEditing={false} // Inicia o componente no modo de edição
      initialIsRegisting={false} // Não inicia no modo de registro
    >
      {/* Conteúdo a ser exibido dentro do ParallaxProfile */}
      <View>
        <Text>Conteúdo adicional dentro do Parallax Profile</Text>
        {/* Você pode adicionar mais componentes aqui conforme necessário */}
      </View>
    </ParallaxProfile>
  );
};

export default ProfileScreen;
