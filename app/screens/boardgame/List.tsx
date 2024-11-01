import React, { useState, useEffect } from "react"; // Importa React, useState e useEffect para gerenciar estados e efeitos
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity, // Importa os componentes do React Native
} from "react-native";
import axios from "axios"; // Adiciona o axios para requisições HTTP
import IMAGES from "@routes/Routes"; // Importa imagens de um arquivo de rotas
import SearchBar from "@/components/SearchBar"; // Importa o componente de barra de pesquisa
import { Theme } from "@/app/styles/Theme"; // Importa tema de cores
import styles from "@/app/styles/Default"; // Importa estilos padrões
import Header from "@/components/Header"; // Importa componente de cabeçalho
import SCREENS from "@routes/Routes"; // Importa rotas
import ButtonPrimary from "@components/ButtonPrimary"; // Importa botão primário para ações
import { useRouter } from "expo-router"; // Importa useRouter para navegação entre telas

// Definição de tipos para o produto baseado na API
interface Product {
  titulo: string; // O título do jogo
  ano?: number; // O ano é opcional
  capa?: string; // A capa também é opcional
  rating: string; // A nota do jogo
}

export default function List() {
  const [searchQuery, setSearchQuery] = useState<string>(""); // Estado para o valor da barra de pesquisa
  const [products, setProducts] = useState<Product[]>([]); // Estado para armazenar os produtos
  const [loading, setLoading] = useState<boolean>(true); // Estado para indicar se os dados estão sendo carregados
  const [retryCount, setRetryCount] = useState<number>(0); // Contador de tentativas de retry em caso de erro

  const MAX_RETRY = 10; // Define o número máximo de tentativas
  const router = useRouter(); // Inicializa o router para navegação

  // Função para buscar os produtos da API com retry
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://api-noob-react.onrender.com/api/jogos/" // Endpoint da API
      );
      // Atualiza os produtos com os dados da API e gera as notas aleatórias
      const updatedProducts = response.data.map((item: any) => ({
        titulo: item.titulo, // Define o título
        ano: item.ano, // Define o ano se existir
        capa: item.capa, // Define a capa se existir
        rating: Math.floor(Math.random() * 101) + " ⭐", // Gera uma nota aleatória entre 0 e 100
      }));
      setProducts(updatedProducts); // Atualiza o estado de produtos
      setLoading(false); // Desativa o estado de carregamento
    } catch (error) {
      console.error("Erro ao buscar os dados da API:", error); // Loga o erro no console
      if (retryCount < MAX_RETRY) {
        setTimeout(() => {
          setRetryCount(retryCount + 1); // Incrementa o contador de tentativas
          fetchData(); // Tenta novamente após 1 segundo
        }, 1000);
      } else {
        setLoading(false); // Para de tentar após o limite ser atingido
      }
    }
  };

  // useEffect para buscar dados ao montar o componente
  useEffect(() => {
    fetchData(); // Chama a função para buscar dados da API
  }, []);

  // Filtra os produtos com base na consulta de pesquisa
  const filteredProducts = products.filter(
    (product) =>
      product.titulo.toLowerCase().includes(searchQuery.toLowerCase()) // Compara os títulos com a pesquisa
  );

  // Função para renderizar cada item da lista
  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Image
        source={
          item.capa ? { uri: item.capa } : IMAGES.IMAGES.unavailable // Usa a imagem de capa ou uma imagem de "indisponível"
        }
        style={localStyles.image}
      />
      <Text style={localStyles.productName}>
        {/* Exibe título e ano se existir */}
        {item.titulo} {item.ano ? `(${item.ano})` : ""}
      </Text>
      {/* Exibe a nota do jogo */}
      <Text style={localStyles.productRating}>{item.rating}</Text>
    </View>
  );

  // Função para navegação ao clicar no botão "Adicionar"
  const goToRegisterGame = () => {
    SCREENS.SCREENS.boardgame.register(router); // Navega para a tela de cadastro de jogo
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Exibe o cabeçalho com título */}
      <Header title="Jogos" />
      <SearchBar
        placeholder="Pesquisar jogos..."
        value={searchQuery}
        onChangeText={setSearchQuery} // Controla a barra de pesquisa
      />
      {loading ? (
        // Exibe a imagem de carregamento enquanto os dados estão sendo carregados
        <View style={localStyles.loadingContainer}>
          <Image
            source={IMAGES.IMAGES.loading} // Imagem de carregamento
            style={localStyles.loadingImage}
          />
          <Text>Carregando jogos...</Text>
        </View>
      ) : filteredProducts.length > 0 ? (
        // Exibe a lista filtrada de produtos
        <FlatList
          data={filteredProducts} // Dados filtrados
          renderItem={renderProduct} // Função de renderização para cada item
          keyExtractor={(item, index) => index.toString()} // Define a chave de cada item
          contentContainerStyle={{ ...localStyles.container, flexGrow: 1 }}
          numColumns={2} // Define o layout em 2 colunas
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      ) : (
        // Exibe a mensagem e botão quando nenhum jogo é encontrado
        <View style={localStyles.noResultsContainer}>
          <Text style={localStyles.noResultsText}>
            Jogo não encontrado. Deseja adicioná-lo?
          </Text>
          {/* Botão para adicionar novo jogo */}
          <ButtonPrimary title="Adicionar" onPress={goToRegisterGame} />
        </View>
      )}
    </View>
  );
}

// Definição de estilos locais
const localStyles = StyleSheet.create({
  container: {
    justifyContent: "space-between", // Espaçamento entre itens
    paddingHorizontal: 10, // Padding horizontal
  },
  image: {
    width: 100, // Largura da imagem
    height: 100, // Altura da imagem
    resizeMode: "contain", // Ajuste da imagem para caber
    marginBottom: 10, // Espaçamento inferior
  },
  productName: {
    fontSize: 16, // Tamanho da fonte
    fontWeight: "bold", // Peso da fonte em negrito
    color: Theme.light.text, // Cor do texto com base no tema
    marginBottom: 5, // Espaçamento inferior
  },
  productRating: {
    fontSize: 14, // Tamanho da fonte para a nota
    color: Theme.light.borda, // Cor da borda com base no tema
  },
  loadingContainer: {
    flex: 1, // Ocupar todo o espaço disponível
    justifyContent: "center", // Centralizar conteúdo verticalmente
    alignItems: "center", // Centralizar conteúdo horizontalmente
  },
  loadingImage: {
    width: 100, // Largura da imagem de carregamento
    height: 100, // Altura da imagem de carregamento
    marginBottom: 20, // Espaçamento inferior
    resizeMode: "contain", // Ajuste da imagem para caber
  },
  noResultsContainer: {
    flex: 1, // Ocupar todo o espaço disponível
    justifyContent: "center", // Centralizar conteúdo verticalmente
    alignItems: "center", // Centralizar conteúdo horizontalmente
    padding: 20, // Padding interno
  },
  noResultsText: {
    fontSize: 18, // Tamanho da fonte do texto de não encontrado
    color: Theme.light.text, // Cor do texto com base no tema
    marginBottom: 20, // Espaçamento inferior
    textAlign: "center", // Centralizar texto
  },
});
