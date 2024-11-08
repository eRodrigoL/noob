import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

const UserProfileContent: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Cabeçalho fixo */}
      <View style={styles.headerContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: "https://example.com/user-image.jpg" }}
            style={styles.foto}
          />
          <Text style={styles.headerTitle}>Nome</Text>
        </View>
      </View>

      {/* Conteúdo rolável */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.bodyContainer}>
          <View style={[styles.textContainer, { marginTop: 25 }]}>
            <Text style={styles.content}>
              A{"\n\n"}B{"\n\n"}C{"\n\n"}D{"\n\n"}E{"\n\n"}F{"\n\n"}G{"\n\n"}H
              {"\n\n"}I{"\n\n"}J{"\n\n"}K{"\n\n"}L{"\n\n"}M{"\n\n"}N{"\n\n"}O
              {"\n\n"}P{"\n\n"}Q{"\n\n"}R{"\n\n"}S{"\n\n"}T{"\n\n"}U{"\n\n"}V
              {"\n\n"}W{"\n\n"}X{"\n\n"}Y{"\n\n"}Z
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: "#b7fffb",
    paddingBottom: 20,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 1,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    marginTop: 50,
  },
  foto: {
    width: 150,
    height: 150,
    borderWidth: 5,
    borderColor: "#333",
    borderRadius: 15,
    backgroundColor: "white",
    position: "absolute",
    top: -90,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 180,
  },
  scrollContent: {
    paddingTop: 70, // Altere este valor para corresponder exatamente à altura desejada do headerContainer
  },
  bodyContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  textContainer: {
    paddingLeft: 16,
  },
  content: {
    fontSize: 16,
    color: "#555",
  },
});

export default UserProfileContent;
