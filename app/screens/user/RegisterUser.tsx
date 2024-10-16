import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import styles from "@styles/Default";
import ButtonPrimary from "@components/ButtonPrimary";
import ButtonGoBack from "@/components/ButtonGoBack";
import { useRouter } from "expo-router";

const RegisterUser: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const router = useRouter();

  // Função para selecionar uma imagem da galeria
  const pickImage = async () => {
    // Pede permissão ao usuário para acessar a galeria
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permissão para acessar as fotos é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Para cortar a imagem em formato quadrado
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri); // Define a URI da imagem
    }
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          {/* Botão de voltar (X) */}
          <ButtonGoBack />

          {/* ESPAÇO VAZIO -- TROCAR ISSO E CORRIGIR NO STYLE */}
          <View style={{ width: 100, height: 70 }}></View>

          {/* Título */}
          <Text style={styles.title}>Crie sua conta:</Text>

          {/* Imagem de Perfil */}
          <TouchableOpacity
            onPress={pickImage}
            style={styles.profileImageContainer}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.profileImage} />
            ) : (
              <Text style={styles.profileImagePlaceholder}>
                Adicionar Imagem
              </Text>
            )}
          </TouchableOpacity>

          {/* Campo para Nome */}
          <TextInput style={styles.input} placeholder="Nome" />

          {/* Campo para Apelido */}
          <TextInput style={styles.input} placeholder="Apelido" />

          {/* Campo para Data de Nascimento */}
          <TextInput style={styles.input} placeholder="Data nascimento" />

          {/* Campo para Email */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
          />

          {/* Campo para Senha */}
          <TextInput style={styles.input} placeholder="Senha" secureTextEntry />

          {/* Campo para Confirmar Senha */}
          <TextInput
            style={styles.input}
            placeholder="Confirmar senha"
            secureTextEntry
          />

          {/* Botão para Cadastrar */}
          <ButtonPrimary title="Cadastrar" onPress={() => {}} />
          {/* AINDA SEM AÇÃO */}
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterUser;
