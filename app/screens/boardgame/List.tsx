import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";
import IMAGES from "@routes/Routes";
import SearchBar from "@/components/SearchBar";

// Definição de tipos para o produto
interface Product {
  name: string;
  rating: string;
}

export default function List() {
  // Estado para armazenar os jogos e a pesquisa
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Lista de jogos
  const products: Product[] = [
    { name: "Projeto Gaia", rating: 91 + " ⭐" },
    { name: "Terraforming Mars", rating: 90 + " ⭐" },
    { name: "Terra Mystica", rating: 90 + " ⭐" },
    { name: "Captive", rating: 78 + " ⭐" },
    { name: "Puerto Rico", rating: 89 + " ⭐" },
    { name: "Wingspan", rating: 88 + " ⭐" },
    { name: "Root", rating: 89 + " ⭐" },
    { name: "Lobisomem", rating: 89 + " ⭐" },
    { name: "Everdell", rating: 88 + " ⭐" },
    { name: "A Cidade de Your Town", rating: 77 + " ⭐" },
    { name: "Zumbis!", rating: 73 + " ⭐" },
    { name: "Scout", rating: 87 + " ⭐" },
    { name: "Quatro Casos de Sherlock Holmes", rating: 82 + " ⭐" },
    { name: "Power Grid: Versão Energizada", rating: 88 + " ⭐" },
    { name: "Trio", rating: 85 + " ⭐" },
    { name: "Splendor: Marvel", rating: 85 + " ⭐" },
    { name: "Istanbul", rating: 83 + " ⭐" },
    { name: "Calico", rating: 84 + " ⭐" },
    { name: "Abstratus", rating: 84 + " ⭐" },
    { name: "Telestrations", rating: 84 + " ⭐" },
    { name: "Quartz", rating: 81 + " ⭐" },
    { name: "Cartógrafos", rating: 82 + " ⭐" },
  ];

  // Filtra os produtos com base na consulta de pesquisa
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Função para renderizar cada item da lista
  const renderProduct = ({ item }: { item: Product }) => (
    <View style={localStyles.card}>
      <Image source={IMAGES.IMAGES.loading} style={localStyles.image} />
      <Text style={localStyles.productName}>{item.name}</Text>
      <Text style={localStyles.productRating}>{item.rating}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Barra de pesquisa */}
      <SearchBar
        placeholder="Pesquisar jogos..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ ...localStyles.container, flexGrow: 1 }}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }} // Aqui é onde você centraliza os cards na linha
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    justifyContent: "space-between", // Ajusta o espaçamento para preencher a tela corretamente
    paddingHorizontal: 10,
  },
  card: {
    width: "45%", // Mantém o tamanho dos cards
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10, // Adiciona uma pequena margem lateral
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
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
    color: "#333",
    marginBottom: 5,
  },
  productRating: {
    fontSize: 14,
    color: "#888",
  },
});
