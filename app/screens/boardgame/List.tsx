import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import styles from "@styles/Default";
import IMAGES from "@routes/Routes";

export default function List() {
  const products = Array(6).fill({ name: "Jogo", rating: "nota" });

  return (
    <ScrollView contentContainerStyle={localStyles.container}>
      {products.map((product, index) => (
        <View key={index} style={localStyles.card}>
          <Image source={IMAGES.IMAGES.loading} style={localStyles.image} />
          <Text style={localStyles.productName}>{product.name}</Text>
          <Text style={localStyles.productRating}>{product.rating}</Text>
        </View>
      ))}
    </ScrollView>
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
});
