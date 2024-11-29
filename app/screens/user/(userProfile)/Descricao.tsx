import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "@/app/styles/Default";
import { screens } from "@/app/routes/Routes";

export default function Descricao() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");

      if (!userId || !token) {
        Alert.alert("Erro", "ID do usuário ou token não encontrados.");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.get(
        `https://api-noob-react.onrender.com/api/usuarios/${userId}`,
        config
      );

      setUser(response.data);
    } catch (error) {
      console.error("Erro ao buscar os dados do usuário:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
    }
  };

  const addOneDay = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!user) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={localStyles.container}>
      <ScrollView style={{ flex: 1 }}>
        {/* Apelido */}
        <Text style={styles.label}>Apelido:</Text>
        <Text style={styles.label}>{user.apelido}</Text>

        {/* Email */}
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.label}>{user.email}</Text>

        {/* Data de Nascimento */}
        <Text style={styles.label}>Data de Nascimento:</Text>
        <Text style={styles.label}>{addOneDay(user.nascimento)}</Text>

        {/* Botão de Editar */}
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={screens.user.editProfile}
        >
          <Text style={styles.buttonPrimaryText}>Editar Perfil</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});
