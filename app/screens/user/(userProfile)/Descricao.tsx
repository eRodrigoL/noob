import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "@/app/styles/Default";
import { screens } from "@/app/routes/Routes";

const screenWidth = Dimensions.get("window").width;

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
      <ScrollView style={{ flex: 1, width: screenWidth }}>
        <Text>
          Pedro Paulo Pereira Pinto, pequeno pintor paulista, pintava portas,
          paredes, portais. Porém, pediu para parar porque preferiu pintar
          panfletos. Partindo para Piracicaba, pintou prateleiras para poder
          progredir. Posteriormente, partiu para Pirapora, pernoitando por
          perto. Prosseguiu para Paranavaí, pois pretendia praticar pinturas
          para pessoas pobres. Porém, pouco praticou, porque Padre Paulino pediu
          para pintar panelas. Posteriormente, pintou pratos para poder pagar
          promessas. Pálido, porém personalizado, preferiu partir. Pediu
          permissão para papai para permanecer praticando pinturas, preferindo,
          portanto, Paris.{"\n\n"}
          Partindo para Paris, passou pelos Pirineus, pois pretendia pintá-los.
          Pareciam plácidos, porém, pesaroso. Percebeu penhascos pedregosos,
          preferindo pintá-los parcialmente, pois perigosas pedras pareciam
          precipitar-se, principalmente pelo Pico, porque pastores passavam
          pelas picadas para pedirem pousada, provocando provavelmente pequenas
          perfurações. Pelos passos, percorriam permanentemente, possantes
          potrancas. Pisando Paris, pediu permissão para pintar palácios
          pomposos, procurando pontos pitorescos, pois, para pintar pobreza,
          precisaria percorrer pontos perigosos, pestilentos, perniciosos,
          preferindo, Pedro Paulo, precaver-se. Profundas privações passou Pedro
          Paulo. Pensava poder prosseguir pintando, porém, pretas previsões
          passavam pelo pensamento, provocando profundos pesares, principalmente
          por pretender partir prontamente para Portugal. Povo previdente!
          {"\n\n"}
          "Preciso partir para Portugal porque pretendem, pela primavera, pintar
          principais portos, painéis, personalidades, prestigiando patrícios",
          pensava Pedro Paulo.{"\n"}- Paris! Paris! Proferiu Pedro Paulo.{"\n"}-
          Parto, porém penso pintá-la permanentemente, pois pretendo progredir.
          {"\n\n"}
          Pisando Portugal, Pedro Paulo procurou pelos pais, porém, Papai
          Procópio partira para Província. Pedindo provisões, partiu
          prontamente, pois precisava pedir permissão para Papai Procópio para
          prosseguir praticando pinturas. Profundamente pálido, perfez percurso
          percorrido pelo pai. Passando pelo porto, penetrou pela pequena
          propriedade patriarcal pelo portão principal. Porém, Papai Procópio
          puxando-o pelo pescoço proferiu:{"\n"}- Pediste permissão para
          praticar pintura, porém, pintas pior. Primo Pinduca pintou
          perfeitamente prima Petúnia. Por que pintas porcarias?{"\n"}- Papai,
          proferiu Pedro Paulo, pinto porque permitiste, porém, prefiro poder
          procurar profissão própria para poder provar perseverança, pois
          pretendo permanecer por Portugal.{"\n\n"}
          Pegando Pedro Paulo pelo pulso, penetrou pelo patamar. Pegando
          pertences, partiu prontamente, pois pretendia pôr Pedro Paulo para
          praticar profissão perfeita: pedreiro! Passando pela ponte, precisaram
          pescar para poderem prosseguir peregrinando. Primeiro, pegaram peixes
          pequenos. Passando pouco prazo, pegaram pacus, piaparas, pirarucus.
          Posteriormente, partiram pela picada próxima, pois pretendiam
          pernoitar pertinho, para procurar primo Péricles primeiro. Pisando por
          pedras pontudas, Papai Procópio procurou Péricles, primo próximo,
          pedreiro profissional perfeito. Poucas palavras proferiram, porém
          prometeu pagar pequena parcela para Péricles profissionalizar Pedro
          Paulo.{"\n\n"}
          Primeiramente, Pedro Paulo pegava pedras, porém, Péricles pediu-lhe
          para pintar prédios, pois precisava pagar pintores práticos.
          Particularmente, Pedro Paulo preferia pintar paredes, pisos, portas,
          portões, painéis. Pereceu pintando prédios para Péricles, pois
          precipitou-se pelas paredes pintadas. Pobre Pedro Paulo, pereceu
          pintando...{"\n\n"}
          'Permita-me poder parar. Pretendo pensar. Peço perdão pela paciência,
          pois pretendo parar para pensar... Para parar preciso pensar. Pensei.
          Portanto, pronto pararei'.
        </Text>

        {/* Apelido */}
        <Text style={styles.label}>Apelido:</Text>
        <Text style={styles.label}>{user.apelido}</Text>

        {/* Email */}
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.label}>{user.email}</Text>

        {/* Data de Nascimento */}
        <Text style={styles.label}>Data de Nascimento:</Text>
        <Text style={styles.label}>{addOneDay(user.nascimento)}</Text>

        <View style={{ flex: 1, alignItems: "center" }}>
          {/* Botão de Editar */}
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={screens.user.editProfile}
          >
            <Text style={styles.buttonPrimaryText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    minWidth: screenWidth,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});
