import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import styles from "@styles/Default";
import IMAGES from "@routes/Routes";

export default function List() {
  // Estado para armazenar os jogos e a pesquisa
  const [searchQuery, setSearchQuery] = useState("");

  // Lista de jogos
  const products = [
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

  return (
    <View>
      {/* Barra de pesquisa */}
      <TextInput
        style={localStyles.searchBar}
        placeholder="Pesquisar jogos..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      <ScrollView contentContainerStyle={localStyles.container}>
        {filteredProducts.map((product, index) => (
          <View key={index} style={localStyles.card}>
            <Image source={IMAGES.IMAGES.loading} style={localStyles.image} />
            <Text style={localStyles.productName}>{product.name}</Text>
            <Text style={localStyles.productRating}>{product.rating}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
  },
  card: {
    width: "45%", // Define que cada item ocupa quase metade da tela (com espaçamento entre eles)
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
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
    resizeMode: "contain", // Garante que a imagem seja redimensionada corretamente
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
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    margin: 10,
  },
});
