import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { images } from "@routes/Routes";
import SearchBar from "@/components/SearchBar";
import { Theme } from "@/app/styles/Theme";
import styles from "@/app/styles/Default";
import Header from "@/components/Header";
import ButtonPrimary from "@components/ButtonPrimary";
import { useRouter } from "expo-router"; // Hook de navegação
import { screens } from "@routes/Routes";
import ApiWakeUp from "@/components/AcordarAPI";

interface Product {
  id: number;
  titulo: string;
  ano?: number;
  capa?: string;
  rating: string;
}

export default function List() {
  const router = useRouter(); // Instância do roteador
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState<number>(0);

  const MAX_RETRY = 10;

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://api-noob-react.onrender.com/api/jogos/"
      );
      const updatedProducts = response.data.map((item: any) => ({
        id: item._id, // Inclui o id do item
        titulo: item.titulo,
        ano: item.ano,
        capa: item.capa,
        rating: Math.floor(Math.random() * 101) + " ⭐",
      }));
      setProducts(updatedProducts);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar os dados da API:", error);
      if (retryCount < MAX_RETRY) {
        setTimeout(() => {
          setRetryCount(retryCount + 1);
          fetchData();
        }, 1000);
      } else {
        setLoading(false);
      }
    }
  };

  <ApiWakeUp />; // Mantem a API desperta

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.titulo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => screens.boardgame.gameProfile(item.id)} // Agora usa screens.boardgame.gameProfile
    >
      <Image
        source={item.capa ? { uri: item.capa } : images.unavailable}
        style={localStyles.image}
      />
      <Text style={localStyles.productName}>
        {item.titulo} {item.ano ? `(${item.ano})` : ""}
      </Text>
      <Text style={localStyles.productRating}>{item.rating}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header title="Jogos" />
      <SearchBar
        placeholder="Pesquisar jogos..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {loading ? (
        <View style={localStyles.loadingContainer}>
          <Image source={images.loading} style={localStyles.loadingImage} />
          <Text>Carregando jogos...</Text>
        </View>
      ) : filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ ...localStyles.container, flexGrow: 1 }}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      ) : (
        <View style={localStyles.noResultsContainer}>
          <Text style={localStyles.noResultsText}>
            Jogo não encontrado. Deseja adicioná-lo?
          </Text>
          <ButtonPrimary
            title="Adicionar"
            onPress={screens.boardgame.register}
          />
        </View>
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Theme.light.text,
    marginBottom: 5,
  },
  productRating: {
    fontSize: 14,
    color: Theme.light.borda,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: "contain",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    color: Theme.light.text,
    marginBottom: 20,
    textAlign: "center",
  },
});
