import React, { useState } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import IMAGES from "@routes/Routes";
import SearchBar from "@/components/SearchBar";
import { Theme } from "@/app/styles/Theme";
import styles from "@/app/styles/Default";
import Header from "@/components/Header";

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
    <View style={styles.card}>
      <Image source={IMAGES.IMAGES.loading} style={localStyles.image} />
      <Text style={localStyles.productName}>{item.name}</Text>
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
});
