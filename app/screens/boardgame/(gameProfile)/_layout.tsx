import React, { useState, useEffect } from "react";
import { View, Text, Alert, StyleSheet, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styles from "@styles/Default";
import Header from "@/components/Header";
import ParallaxProfile from "@/components/ParallaxProfile";
import ApiWakeUp from "@/app/services/AcordarAPI";

const screenWidth = Dimensions.get("window").width;

// Define o tipo para os dados do jogo
interface Game {
  id?: string | null;
  foto?: string | null;
  capa?: string | null;
  titulo?: string | null;
  ano?: string | null; // Ajustado para string, conforme o modelo da API
  idade?: number | null;
  designer?: string | null;
  artista?: string | null;
  editora?: string | null;
  descricao?: string | null;
}

const GameProfile: React.FC = () => {
  <ApiWakeUp />; // Mantem a API desperta

  const { id } = useLocalSearchParams<{ id?: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedGame, seteditedGame] = useState<any>(null);

  const [user, setUser] = useState<any>(null); //apagar
  const [editedUser, setEditedUser] = useState<any>(null); //apagar

  // Função para buscar os dados do jogo
  const fetchGameData = async () => {
    try {
      if (!id) {
        Alert.alert("Erro", "ID do jogo não encontrados.");
        return;
      }

      const response = await axios.get(
        `https://api-noob-react.onrender.com/api/jogos/${id}`
      );

      setGame(response.data);
      seteditedGame(response.data);
    } catch (error) {
      console.error("Erro ao buscar os dados do jogo:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do jogo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando dados do jogo...</Text>
      </View>
    );
  }

  if (!game) {
    return (
      <View style={styles.container}>
        <Text>Erro ao carregar os dados do jogo.</Text>
      </View>
    );
  }

  const addOneDay = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Adiciona 1 dia
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Jogo" />
      <ParallaxProfile
        id={id}
        name={`${game.titulo} (${game.ano})`}
        photo={game.capa}
        cover={null}
        initialIsEditing={false}
        initialIsRegisting={false}
        isEditing={isEditing}
        setEditedUser={setEditedUser}
      >
        <View style={{ flex: 1 }}>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: localStyles.tabBar,
              tabBarActiveTintColor: "#000",
              tabBarInactiveTintColor: "#8E8E93",
            }}
          >
            <Tabs.Screen
              name="Descricao"
              options={{
                title: "Descrição",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="dice-outline" size={size} color={color} />
                ),
              }}
              initialParams={{ id: id }}
            />
            <Tabs.Screen
              name="Analises"
              options={{
                title: "Análises",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons
                    name="stats-chart-outline"
                    size={size}
                    color={color}
                  />
                ),
              }}
              initialParams={{ id: id }}
            />
            <Tabs.Screen
              name="Classificacao"
              options={{
                title: "Classificação",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="trophy-outline" size={size} color={color} />
                ),
              }}
              initialParams={{ id: id }}
            />
            <Tabs.Screen
              name="Avaliacao"
              options={{
                title: "Avaliação",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons
                    name="clipboard-outline"
                    size={size}
                    color={color}
                  />
                ),
              }}
              initialParams={{ id: id }}
            />
          </Tabs>
        </View>
      </ParallaxProfile>
    </View>
  );
};

const localStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  tabBarItemStyle: {
    flex: 1,
  },
});

export default GameProfile;
