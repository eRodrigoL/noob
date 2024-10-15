import React, { useState, useEffect } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import axios from "axios"; // Adiciona o axios para requisição
import IMAGES from "@routes/Routes";
import SearchBar from "@/components/SearchBar";
import { Theme } from "@/app/styles/Theme";
import styles from "@/app/styles/Default";
import Header from "@/components/Header";

// Definição de tipos para o produto baseado na API
interface Product {
  titulo: string;
  ano?: number; // Pode ser opcional
  capa?: string; // Pode ser opcional
  rating: string; // Para a nota gerada automaticamente
}

export default function List() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState<number>(0); // Contador de tentativas

  const MAX_RETRY = 5; // Número máximo de tentativas

  // Função para buscar os produtos da API com retry
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://api-noob-react.onrender.com/api/jogos/"
      );
      // Atualiza os produtos com os dados da API e gera as notas
      const updatedProducts = response.data.map((item: any) => ({
        titulo: item.titulo,
        ano: item.ano, // Mantém o ano se existir
        capa: item.capa, // Mantém a capa se existir
        rating: Math.floor(Math.random() * (100 - 70 + 1)) + 70 + " ⭐", // Gera uma nota aleatória entre 70 e 100
      }));
      setProducts(updatedProducts);
      setLoading(false); // Desativa o carregamento ao receber os dados
    } catch (error) {
      console.error("Erro ao buscar os dados da API:", error);
      if (retryCount < MAX_RETRY) {
        setTimeout(() => {
          setRetryCount(retryCount + 1);
          fetchData(); // Tenta novamente após 1 segundo
        }, 1000);
      } else {
        setLoading(false); // Para as tentativas após atingir o limite
      }
    }
  };

  // Chama a função de buscar dados quando o componente for montado
  useEffect(() => {
    fetchData();
  }, []);

  // Filtra os produtos com base na consulta de pesquisa
  const filteredProducts = products.filter((product) =>
    product.titulo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Função para renderizar cada item da lista
  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Image
        source={
          item.capa ? { uri: item.capa } : IMAGES.IMAGES.unavailable // Se não houver imagem, usa a imagem de "indisponível"
        }
        style={localStyles.image}
      />
      <Text style={localStyles.productName}>
        {item.titulo} {item.ano ? `(${item.ano})` : ""}
      </Text>
      <Text style={localStyles.productRating}>{item.rating}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header title="Cadastro de usuário" />
      {/* Barra de pesquisa */}
      <SearchBar
        placeholder="Pesquisar jogos..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        // Exibe a imagem de carregamento enquanto os dados estão sendo carregados
        <View style={localStyles.loadingContainer}>
          <Image
            source={IMAGES.IMAGES.loading}
            style={localStyles.loadingImage}
          />
          <Text>Carregando jogos...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ ...localStyles.container, flexGrow: 1 }}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
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
});
